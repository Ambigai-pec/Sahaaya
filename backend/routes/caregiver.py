from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json
try:
    from .. import models, schemas, database
except (ImportError, ValueError):
    import models, schemas, database

router = APIRouter(prefix="/caregiver", tags=["caregiver"])

@router.get("/{caregiver_id}/patients")
def get_patients(caregiver_id: int, db: Session = Depends(database.get_db)):
    cg = db.query(models.Caregiver).filter(models.Caregiver.user_id == caregiver_id).first()
    if not cg:
        raise HTTPException(status_code=404, detail="Caregiver not found")
    patient_ids = json.loads(cg.assigned_patients) if isinstance(cg.assigned_patients, str) else cg.assigned_patients
    
    patient_summaries = []
    for pid in patient_ids:
        profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == pid).first()
        if not profile:
            continue
        
        # Calculate adherence & missed
        doses = db.query(models.MedicationDose).filter(models.MedicationDose.patient_id == pid).all()
        total_doses = len(doses)
        taken_doses = sum(1 for d in doses if d.status == "taken")
        missed_doses = sum(1 for d in doses if d.status == "missed")
        adherence_pct = round((taken_doses / total_doses * 100.0), 1) if total_doses > 0 else 71.0

        # Latest mood
        latest_mood = db.query(models.MoodEntry).filter(models.MoodEntry.patient_id == pid).order_by(models.MoodEntry.timestamp.desc()).first()

        # Min stock days
        meds = db.query(models.Medication).filter(models.Medication.patient_id == pid).all()
        min_stock = 14.0
        for m in meds:
            stk = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == m.id).first()
            if stk:
                try:
                    daily = len(json.loads(m.times)) * (m.tablets_per_dose or 1.0)
                except Exception:
                    daily = 1.0
                if daily > 0:
                    days_left = stk.remaining_tablets / daily
                    if days_left < min_stock:
                        min_stock = days_left

        # Latest risk
        latest_risk = db.query(models.RiskAssessment).filter(models.RiskAssessment.patient_id == pid).order_by(models.RiskAssessment.id.desc()).first()

        patient_summaries.append({
            "id": profile.id,
            "user_id": profile.user_id,
            "name": profile.name,
            "age": profile.age,
            "gender": profile.gender,
            "phone": profile.phone,
            "emergency_contact": profile.emergency_contact,
            "health_conditions": json.loads(profile.health_conditions) if isinstance(profile.health_conditions, str) else profile.health_conditions,
            "adherence_pct": adherence_pct,
            "missed_doses": missed_doses,
            "mood": latest_mood.mood_label if latest_mood else "Not logged",
            "stock_days": round(min_stock, 1),
            "support_priority": latest_risk.support_priority if latest_risk else "moderate",
            "risk_factors": json.loads(latest_risk.factors) if (latest_risk and isinstance(latest_risk.factors, str)) else []
        })

    return patient_summaries

@router.get("/{caregiver_id}/patient/{patient_id}/overview")
def get_patient_overview(caregiver_id: int, patient_id: int, db: Session = Depends(database.get_db)):
    cg = db.query(models.Caregiver).filter(models.Caregiver.user_id == caregiver_id).first()
    assigned = json.loads(cg.assigned_patients) if (cg and isinstance(cg.assigned_patients, str)) else []
    if not cg or patient_id not in assigned:
        raise HTTPException(status_code=403, detail="Not assigned to patient")
        
    profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == patient_id).first()
    meds = db.query(models.Medication).filter(models.Medication.patient_id == patient_id).all()
    latest_risk = db.query(models.RiskAssessment).filter(models.RiskAssessment.patient_id == patient_id).order_by(models.RiskAssessment.id.desc()).first()
    
    # Calculate adherence stats
    doses = db.query(models.MedicationDose).filter(models.MedicationDose.patient_id == patient_id).all()
    total_doses = len(doses)
    taken = sum(1 for d in doses if d.status == "taken")
    missed = sum(1 for d in doses if d.status == "missed")
    adherence = round((taken / total_doses * 100.0), 1) if total_doses > 0 else 71.0

    # Recent moods
    moods = db.query(models.MoodEntry).filter(models.MoodEntry.patient_id == patient_id).order_by(models.MoodEntry.timestamp.desc()).limit(7).all()
    
    # Medicine stocks
    stocks_list = []
    min_stock_days = 99.0
    for m in meds:
        stk = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == m.id).first()
        if stk:
            try:
                daily = len(json.loads(m.times)) * (m.tablets_per_dose or 1.0)
            except Exception:
                daily = 1.0
            days = (stk.remaining_tablets / daily) if daily > 0 else 0
            if days < min_stock_days:
                min_stock_days = days
            stocks_list.append({
                "medication_name": m.name,
                "dosage": m.dosage,
                "remaining_tablets": stk.remaining_tablets,
                "days_remaining": round(days, 1),
                "needs_refill": days <= stk.refill_threshold
            })

    return {
        "profile": {
            "name": profile.name,
            "age": profile.age,
            "gender": profile.gender,
            "phone": profile.phone,
            "emergency_contact": profile.emergency_contact,
            "health_conditions": json.loads(profile.health_conditions) if isinstance(profile.health_conditions, str) else profile.health_conditions
        },
        "adherence_pct": adherence,
        "missed_doses": missed,
        "support_priority": latest_risk.support_priority if latest_risk else "moderate",
        "factors": json.loads(latest_risk.factors) if (latest_risk and isinstance(latest_risk.factors, str)) else [],
        "min_stock_days": round(min_stock_days, 1) if min_stock_days < 99 else 5.0,
        "medications": stocks_list,
        "recent_moods": [{"date": m.timestamp.strftime("%Y-%m-%d"), "label": m.mood_label, "score": m.mood_score} for m in moods]
    }

@router.get("/{caregiver_id}/alerts")
def get_alerts(caregiver_id: int, db: Session = Depends(database.get_db)):
    notifications = db.query(models.Notification).filter(models.Notification.user_id == caregiver_id).order_by(models.Notification.created_at.desc()).all()
    return notifications

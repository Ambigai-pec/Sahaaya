from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
try:
    from .. import models, schemas, database
    from ..ai.risk_engine import calculate_risk
except (ImportError, ValueError):
    import models, schemas, database
    from ai.risk_engine import calculate_risk

router = APIRouter(prefix="/risk", tags=["risk"])

@router.post("/{patient_id}/assess", response_model=schemas.RiskAssessmentResponse)
def assess_risk(patient_id: int, db: Session = Depends(database.get_db)):
    # 1. Query doses for patient
    doses = db.query(models.MedicationDose).filter(models.MedicationDose.patient_id == patient_id).all()
    total_doses = len(doses)
    missed_doses = sum(1 for d in doses if d.status == "missed")
    delayed_doses = sum(1 for d in doses if d.status == "delayed")
    taken_doses = sum(1 for d in doses if d.status == "taken")
    adherence_pct = (taken_doses / total_doses * 100.0) if total_doses > 0 else 85.0

    # 2. Query mood entries
    moods = db.query(models.MoodEntry).filter(models.MoodEntry.patient_id == patient_id).order_by(models.MoodEntry.timestamp.desc()).limit(7).all()
    mood_scores = [m.mood_score for m in moods] if moods else [5]
    
    # Calculate negative streak
    streak = 0
    for m in moods:
        if m.mood_score <= 2 or m.sentiment in ["negative", "distress"]:
            streak += 1
        else:
            break

    # 3. Query minimum days of stock remaining across all medications
    meds = db.query(models.Medication).filter(models.Medication.patient_id == patient_id).all()
    min_days_stock = 14.0
    for med in meds:
        stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == med.id).first()
        if stock:
            try:
                times_list = json.loads(med.times) if isinstance(med.times, str) else med.times
                daily_usage = len(times_list) * (med.tablets_per_dose or 1.0)
            except Exception:
                daily_usage = 1.0
            if daily_usage > 0:
                days_left = stock.remaining_tablets / daily_usage
                if days_left < min_days_stock:
                    min_days_stock = days_left

    result_dict = calculate_risk(
        missed_doses_week=missed_doses,
        delayed_doses_week=delayed_doses,
        adherence_pct=adherence_pct,
        mood_scores_week=mood_scores,
        days_remaining_stock=min_days_stock,
        negative_mood_streak=streak
    )
    
    db_risk = models.RiskAssessment(
        patient_id=patient_id,
        support_priority=result_dict['support_priority'],
        medication_risk_score=result_dict['medication_risk'],
        mood_risk_score=result_dict['mood_risk'],
        stock_risk_score=result_dict['stock_risk'],
        total_score=result_dict['total_score'],
        factors=json.dumps(result_dict['factors'])
    )
    db.add(db_risk)

    # If high priority, notify caregiver if registered
    if result_dict['support_priority'] in ['moderate', 'high']:
        profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == patient_id).first()
        if profile and profile.caregiver_id:
            alert = models.Notification(
                user_id=profile.caregiver_id,
                title=f"{'High' if result_dict['support_priority'] == 'high' else 'Moderate'} Support Priority Alert",
                body=f"Patient {profile.name} status updated: {'; '.join(result_dict['factors'][:2])}",
                type="caregiver_alert",
                severity="critical" if result_dict['support_priority'] == 'high' else "warning"
            )
            db.add(alert)

    db.commit()
    db.refresh(db_risk)
    return db_risk

@router.get("/{patient_id}/latest", response_model=schemas.RiskAssessmentResponse)
def get_latest_risk(patient_id: int, db: Session = Depends(database.get_db)):
    risk = db.query(models.RiskAssessment).filter(models.RiskAssessment.patient_id == patient_id).order_by(models.RiskAssessment.assessed_at.desc()).first()
    if not risk:
        raise HTTPException(status_code=404, detail="No risk assessment found")
    return risk

@router.get("/{patient_id}/history", response_model=List[schemas.RiskAssessmentResponse])
def get_risk_history(patient_id: int, db: Session = Depends(database.get_db)):
    risks = db.query(models.RiskAssessment).filter(models.RiskAssessment.patient_id == patient_id).order_by(models.RiskAssessment.assessed_at.desc()).all()
    return risks

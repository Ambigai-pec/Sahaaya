from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import json
try:
    from .. import models, schemas, database
except (ImportError, ValueError):
    import models, schemas, database

router = APIRouter(tags=["medications"])

@router.get("/medications/{patient_id}", response_model=List[schemas.MedicationResponse])
def get_medications(patient_id: int, db: Session = Depends(database.get_db)):
    medications = db.query(models.Medication).filter(models.Medication.patient_id == patient_id).all()
    return medications

@router.post("/medications/", response_model=schemas.MedicationResponse)
def create_medication(med: schemas.MedicationCreate, db: Session = Depends(database.get_db)):
    db_med = models.Medication(**med.model_dump())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)

    # Initialize stock record for this medication
    stock = models.MedicineStock(
        medication_id=db_med.id,
        remaining_tablets=30.0,
        refill_threshold=7.0,
        last_updated=datetime.now(timezone.utc)
    )
    db.add(stock)

    # Create today's scheduled dose(s)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    try:
        times_list = json.loads(db_med.times) if isinstance(db_med.times, str) else db_med.times
    except Exception:
        times_list = ["08:00"]

    for t in times_list:
        dose = models.MedicationDose(
            medication_id=db_med.id,
            patient_id=db_med.patient_id,
            scheduled_time=t,
            status="pending",
            date=today_str
        )
        db.add(dose)

    db.commit()
    return db_med

@router.put("/medications/{med_id}", response_model=schemas.MedicationResponse)
def update_medication(med_id: int, med: schemas.MedicationBase, db: Session = Depends(database.get_db)):
    db_med = db.query(models.Medication).filter(models.Medication.id == med_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medication not found")
    for k, v in med.model_dump().items():
        setattr(db_med, k, v)
    db.commit()
    db.refresh(db_med)
    return db_med

@router.delete("/medications/{med_id}")
def delete_medication(med_id: int, db: Session = Depends(database.get_db)):
    db_med = db.query(models.Medication).filter(models.Medication.id == med_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medication not found")
    db.delete(db_med)
    db.commit()
    return {"message": "Deleted successfully"}

@router.get("/medications/{patient_id}/today", response_model=List[schemas.MedicationDoseResponse])
def get_today_schedule(patient_id: int, db: Session = Depends(database.get_db)):
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    doses = db.query(models.MedicationDose).filter(
        models.MedicationDose.patient_id == patient_id,
        models.MedicationDose.date == today_str
    ).all()

    # If no doses yet generated for today, generate them from active medications
    if not doses:
        meds = db.query(models.Medication).filter(
            models.Medication.patient_id == patient_id,
            models.Medication.is_active == True
        ).all()
        for m in meds:
            try:
                times_list = json.loads(m.times) if isinstance(m.times, str) else m.times
            except Exception:
                times_list = ["08:00"]
            for t in times_list:
                new_dose = models.MedicationDose(
                    medication_id=m.id,
                    patient_id=patient_id,
                    scheduled_time=t,
                    status="pending",
                    date=today_str
                )
                db.add(new_dose)
        db.commit()
        doses = db.query(models.MedicationDose).filter(
            models.MedicationDose.patient_id == patient_id,
            models.MedicationDose.date == today_str
        ).all()

    return doses

@router.post("/doses/", response_model=schemas.MedicationDoseResponse)
def record_dose(dose: schemas.MedicationDoseCreate, db: Session = Depends(database.get_db)):
    db_dose = models.MedicationDose(**dose.model_dump())
    db.add(db_dose)
    
    # Decrement stock if taken
    if db_dose.status == "taken":
        db_dose.taken_at = datetime.now(timezone.utc)
        stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == dose.medication_id).first()
        if stock:
            med = db.query(models.Medication).filter(models.Medication.id == dose.medication_id).first()
            usage = med.tablets_per_dose if med and med.tablets_per_dose else 1.0
            stock.remaining_tablets = max(0.0, stock.remaining_tablets - usage)
            stock.last_updated = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_dose)
    return db_dose

@router.put("/doses/{dose_id}", response_model=schemas.MedicationDoseResponse)
def update_dose_status(dose_id: int, status: str, db: Session = Depends(database.get_db)):
    dose = db.query(models.MedicationDose).filter(models.MedicationDose.id == dose_id).first()
    if not dose:
        raise HTTPException(status_code=404, detail="Dose not found")

    dose.status = status
    if status == "taken":
        dose.taken_at = datetime.now(timezone.utc)
        stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == dose.medication_id).first()
        if stock:
            med = db.query(models.Medication).filter(models.Medication.id == dose.medication_id).first()
            usage = med.tablets_per_dose if med and med.tablets_per_dose else 1.0
            stock.remaining_tablets = max(0.0, stock.remaining_tablets - usage)
            stock.last_updated = datetime.now(timezone.utc)
    elif status == "missed":
        # Check missed dose count for this patient
        missed_count = db.query(models.MedicationDose).filter(
            models.MedicationDose.patient_id == dose.patient_id,
            models.MedicationDose.status == "missed"
        ).count()
        if missed_count >= 2:
            profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == dose.patient_id).first()
            if profile and profile.caregiver_id:
                alert = models.Notification(
                    user_id=profile.caregiver_id,
                    title="Repeated Missed Medication Alert",
                    body=f"Patient {profile.name} has missed {missed_count} scheduled doses this week. Recommended action: Check in with patient.",
                    type="missed_dose",
                    severity="warning"
                )
                db.add(alert)

    db.commit()
    db.refresh(dose)
    return dose

@router.get("/doses/{patient_id}/history", response_model=List[schemas.MedicationDoseResponse])
def get_dose_history(patient_id: int, db: Session = Depends(database.get_db)):
    doses = db.query(models.MedicationDose).filter(models.MedicationDose.patient_id == patient_id).order_by(models.MedicationDose.date.desc()).all()
    return doses

@router.get("/doses/{patient_id}/week-stats")
def get_week_stats(patient_id: int, db: Session = Depends(database.get_db)):
    doses = db.query(models.MedicationDose).filter(models.MedicationDose.patient_id == patient_id).all()
    total = len(doses)
    if total == 0:
        return {"adherence_pct": 0.0, "missed": 0, "taken": 0, "delayed": 0}
    taken = sum(1 for d in doses if d.status == 'taken')
    missed = sum(1 for d in doses if d.status == 'missed')
    delayed = sum(1 for d in doses if d.status == 'delayed')
    adherence = (taken / total) * 100.0
    return {
        "adherence_pct": round(adherence, 1),
        "missed": missed,
        "taken": taken,
        "delayed": delayed,
        "total": total
    }

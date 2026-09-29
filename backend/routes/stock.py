from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import json
try:
    from .. import models, schemas, database
except (ImportError, ValueError):
    import models, schemas, database

router = APIRouter(prefix="/stock", tags=["stock"])

@router.get("/{patient_id}", response_model=List[schemas.MedicineStockResponse])
def get_patient_stock(patient_id: int, db: Session = Depends(database.get_db)):
    meds = db.query(models.Medication.id).filter(models.Medication.patient_id == patient_id).all()
    med_ids = [m.id for m in meds]
    stocks = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id.in_(med_ids)).all()
    return stocks

@router.get("/{patient_id}/overview")
def get_stock_overview(patient_id: int, db: Session = Depends(database.get_db)):
    meds = db.query(models.Medication).filter(models.Medication.patient_id == patient_id).all()
    overview = []
    for m in meds:
        stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == m.id).first()
        if not stock:
            continue
        try:
            times_list = json.loads(m.times) if isinstance(m.times, str) else m.times
            daily_usage = len(times_list) * (m.tablets_per_dose or 1.0)
        except Exception:
            daily_usage = 1.0

        days_remaining = (stock.remaining_tablets / daily_usage) if daily_usage > 0 else 0.0
        needs_refill = days_remaining <= stock.refill_threshold

        overview.append({
            "medication_id": m.id,
            "medication_name": m.name,
            "dosage": m.dosage,
            "remaining_tablets": stock.remaining_tablets,
            "daily_consumption": daily_usage,
            "refill_threshold": stock.refill_threshold,
            "days_remaining": round(days_remaining, 1),
            "needs_refill": needs_refill
        })
    return overview

@router.put("/{medication_id}", response_model=schemas.MedicineStockResponse)
def update_stock(medication_id: int, stock: schemas.MedicineStockBase, db: Session = Depends(database.get_db)):
    db_stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == medication_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    db_stock.remaining_tablets = stock.remaining_tablets
    db_stock.refill_threshold = stock.refill_threshold
    db_stock.last_updated = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@router.post("/{medication_id}/refill")
def add_refill(medication_id: int, added_tablets: float = 30.0, db: Session = Depends(database.get_db)):
    db_stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == medication_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    db_stock.remaining_tablets += added_tablets
    db_stock.last_updated = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_stock)
    return {"message": "Refilled successfully", "remaining_tablets": db_stock.remaining_tablets}

@router.get("/{medication_id}/prediction")
def get_stock_prediction(medication_id: int, db: Session = Depends(database.get_db)):
    db_stock = db.query(models.MedicineStock).filter(models.MedicineStock.medication_id == medication_id).first()
    med = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if not db_stock or not med:
        raise HTTPException(status_code=404, detail="Not found")
    
    try:
        daily_doses = len(json.loads(med.times)) if isinstance(med.times, str) else len(med.times)
    except Exception:
        daily_doses = 1
    total_daily = daily_doses * (med.tablets_per_dose or 1.0)
    days_left = db_stock.remaining_tablets / total_daily if total_daily > 0 else 0
    
    return {
        "medication_name": med.name,
        "remaining_tablets": db_stock.remaining_tablets,
        "daily_consumption": total_daily,
        "days_remaining": round(days_left, 1),
        "needs_refill": days_left <= db_stock.refill_threshold
    }

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json
try:
    from .. import models, database
except (ImportError, ValueError):
    import models, database

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    users_count = db.query(models.User).count()
    patients_count = db.query(models.User).filter(models.User.role == "patient").count()
    caregivers_count = db.query(models.User).filter(models.User.role == "caregiver").count()
    assessments_count = db.query(models.RiskAssessment).count()
    total_alerts = db.query(models.Notification).count()
    critical_alerts = db.query(models.Notification).filter(models.Notification.severity == "critical").count()
    
    # Priority breakdown
    high_count = db.query(models.RiskAssessment).filter(models.RiskAssessment.support_priority == "high").count()
    mod_count = db.query(models.RiskAssessment).filter(models.RiskAssessment.support_priority == "moderate").count()
    low_count = db.query(models.RiskAssessment).filter(models.RiskAssessment.support_priority == "low").count()

    return {
        "total_users": users_count,
        "total_patients": patients_count,
        "total_caregivers": caregivers_count,
        "total_assessments": assessments_count,
        "total_alerts": total_alerts,
        "critical_alerts": critical_alerts,
        "priority_distribution": {
            "high": high_count,
            "moderate": mod_count,
            "low": low_count
        }
    }

@router.get("/users")
def get_all_users(db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    return [{"id": u.id, "username": u.username, "role": u.role, "is_active": u.is_active, "created_at": u.created_at} for u in users]

@router.get("/alerts")
def get_all_alerts(db: Session = Depends(database.get_db)):
    return db.query(models.Notification).order_by(models.Notification.created_at.desc()).all()

@router.get("/activity")
def get_system_activity(db: Session = Depends(database.get_db)):
    activity = []
    
    # Recent assessments
    assessments = db.query(models.RiskAssessment).order_by(models.RiskAssessment.assessed_at.desc()).limit(5).all()
    for a in assessments:
        activity.append({
            "type": "risk_assessment",
            "title": f"Risk Assessed: {a.support_priority.upper()}",
            "time": a.assessed_at.strftime("%Y-%m-%d %H:%M"),
            "severity": "critical" if a.support_priority == "high" else "warning" if a.support_priority == "moderate" else "info"
        })

    # Recent doses
    doses = db.query(models.MedicationDose).order_by(models.MedicationDose.id.desc()).limit(5).all()
    for d in doses:
        activity.append({
            "type": "medication_dose",
            "title": f"Dose marked as {d.status.upper()} ({d.scheduled_time})",
            "time": d.date,
            "severity": "warning" if d.status == "missed" else "info"
        })

    return activity

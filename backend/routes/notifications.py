from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
try:
    from .. import models, schemas, database
except (ImportError, ValueError):
    import models, schemas, database

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/{user_id}", response_model=List[schemas.NotificationResponse])
def get_notifications(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).all()

@router.put("/{notif_id}/read", response_model=schemas.NotificationResponse)
def mark_read(notif_id: int, db: Session = Depends(database.get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@router.post("/", response_model=schemas.NotificationResponse)
def create_notification(notif: schemas.NotificationCreate, db: Session = Depends(database.get_db)):
    db_notif = models.Notification(**notif.model_dump())
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

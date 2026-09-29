from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import json
try:
    from .. import models, schemas, database
    from ..ai.sentiment import classify_sentiment
except (ImportError, ValueError):
    import models, schemas, database
    from ai.sentiment import classify_sentiment

router = APIRouter(prefix="/mood", tags=["mood"])

@router.post("/", response_model=schemas.MoodEntryResponse)
def create_mood(entry: schemas.MoodEntryCreate, db: Session = Depends(database.get_db)):
    sentiment_result = {"sentiment": entry.sentiment, "score": 0.0, "keywords": []}
    if entry.journal_text:
        sentiment_result = classify_sentiment(entry.journal_text)
        sentiment_label = sentiment_result["sentiment"]
    else:
        sentiment_label = entry.sentiment

    entry_data = entry.model_dump()
    entry_data["sentiment"] = sentiment_label
    db_entry = models.MoodEntry(**entry_data)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    # Save associated journal entry if text provided
    if entry.journal_text:
        journal = models.JournalEntry(
            patient_id=entry.patient_id,
            mood_entry_id=db_entry.id,
            text=entry.journal_text,
            sentiment=sentiment_result["sentiment"],
            sentiment_score=sentiment_result["score"],
            keywords=json.dumps(sentiment_result["keywords"])
        )
        db.add(journal)

    # If distress detected, alert caregiver
    if sentiment_result["sentiment"] == "distress":
        profile = db.query(models.PatientProfile).filter(models.PatientProfile.user_id == entry.patient_id).first()
        if profile and profile.caregiver_id:
            alert = models.Notification(
                user_id=profile.caregiver_id,
                title="Emotional Distress Pattern Alert",
                body=f"Patient {profile.name} recorded an entry indicating high emotional distress. Please reach out to offer supportive care.",
                type="wellness",
                severity="critical"
            )
            db.add(alert)

    db.commit()
    return db_entry

@router.post("/journal", response_model=schemas.JournalEntryResponse)
def create_journal(journal: schemas.JournalEntryCreate, db: Session = Depends(database.get_db)):
    sentiment_result = classify_sentiment(journal.text)
    db_journal = models.JournalEntry(
        patient_id=journal.patient_id,
        mood_entry_id=journal.mood_entry_id,
        text=journal.text,
        sentiment=sentiment_result["sentiment"],
        sentiment_score=sentiment_result["score"],
        keywords=json.dumps(sentiment_result["keywords"])
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@router.get("/{patient_id}/history", response_model=List[schemas.MoodEntryResponse])
def get_mood_history(patient_id: int, db: Session = Depends(database.get_db)):
    entries = db.query(models.MoodEntry).filter(models.MoodEntry.patient_id == patient_id).order_by(models.MoodEntry.timestamp.desc()).all()
    return entries

@router.get("/{patient_id}/week", response_model=List[schemas.MoodEntryResponse])
def get_mood_week(patient_id: int, db: Session = Depends(database.get_db)):
    return get_mood_history(patient_id, db)[:7]

@router.get("/{patient_id}/journals", response_model=List[schemas.JournalEntryResponse])
def get_patient_journals(patient_id: int, db: Session = Depends(database.get_db)):
    journals = db.query(models.JournalEntry).filter(models.JournalEntry.patient_id == patient_id).order_by(models.JournalEntry.created_at.desc()).all()
    return journals

@router.get("/{patient_id}/stats")
def get_mood_stats(patient_id: int, db: Session = Depends(database.get_db)):
    entries = get_mood_history(patient_id, db)
    if not entries:
        return {
            "avg_mood": 0,
            "total_entries": 0,
            "sentiment_distribution": {"positive": 0, "neutral": 0, "negative": 0, "distress": 0},
            "low_mood_days": 0
        }
    avg = sum(e.mood_score for e in entries) / len(entries)
    sent_dist = {"positive": 0, "neutral": 0, "negative": 0, "distress": 0}
    low_days = 0
    for e in entries:
        s = e.sentiment or "neutral"
        sent_dist[s] = sent_dist.get(s, 0) + 1
        if e.mood_score <= 2:
            low_days += 1

    return {
        "avg_mood": round(avg, 1),
        "total_entries": len(entries),
        "sentiment_distribution": sent_dist,
        "low_mood_days": low_days
    }

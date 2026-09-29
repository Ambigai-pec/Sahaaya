import json
from datetime import datetime, timezone, timedelta
from database import engine, Base, SessionLocal
import models

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(models.User).first():
        print("Database already seeded")
        db.close()
        return

    radha = models.User(username="radha", role="patient", password_hash="demo")
    meena = models.User(username="meena", role="caregiver", password_hash="demo")
    admin = models.User(username="admin", role="admin", password_hash="demo")
    
    db.add_all([radha, meena, admin])
    db.commit()

    radha_profile = models.PatientProfile(
        user_id=radha.id,
        name="Radha",
        age=65,
        gender="Female",
        phone="1234567890",
        emergency_contact="0987654321",
        health_conditions=json.dumps(["Type 2 Diabetes", "Hypertension"]),
        caregiver_id=meena.id
    )
    db.add(radha_profile)
    db.commit()

    meena_cg = models.Caregiver(
        user_id=meena.id,
        name="Meena",
        relationship="Daughter",
        phone="0987654321",
        assigned_patients=json.dumps([radha.id])
    )
    db.add(meena_cg)
    db.commit()

    med1 = models.Medication(
        patient_id=radha.id,
        name="Metformin 500mg",
        dosage="500mg",
        frequency="daily",
        times=json.dumps(["08:00"]),
        tablets_per_dose=1.0,
        food_instruction="after",
        start_date=datetime.now(timezone.utc) - timedelta(days=30)
    )
    med2 = models.Medication(
        patient_id=radha.id,
        name="Amlodipine 5mg",
        dosage="5mg",
        frequency="daily",
        times=json.dumps(["21:00"]),
        tablets_per_dose=1.0,
        food_instruction="after",
        start_date=datetime.now(timezone.utc) - timedelta(days=30)
    )
    db.add_all([med1, med2])
    db.commit()

    stock1 = models.MedicineStock(medication_id=med1.id, remaining_tablets=5.0, refill_threshold=7.0)
    stock2 = models.MedicineStock(medication_id=med2.id, remaining_tablets=18.0, refill_threshold=7.0)
    db.add_all([stock1, stock2])
    db.commit()

    today = datetime.now(timezone.utc)
    for i in range(7):
        d = today - timedelta(days=6-i)
        date_str = d.strftime("%Y-%m-%d")
        
        if i in [1, 4, 5, 6]:
            status = "missed"
        else:
            status = "taken"
            
        dose = models.MedicationDose(
            medication_id=med1.id,
            patient_id=radha.id,
            scheduled_time="08:00",
            status=status,
            taken_at=d if status == "taken" else None,
            date=date_str
        )
        db.add(dose)
    db.commit()

    moods = [
        (6, "Great", today - timedelta(days=6)),
        (5, "Good", today - timedelta(days=5)),
        (3, "Okay", today - timedelta(days=4)),
        (2, "Low", today - timedelta(days=3)),
        (2, "Low", today - timedelta(days=2)),
        (5, "Good", today - timedelta(days=1))
    ]
    for score, label, ts in moods:
        mood = models.MoodEntry(
            patient_id=radha.id,
            mood_score=score,
            mood_label=label,
            journal_text="A mock journal entry.",
            sentiment="neutral",
            timestamp=ts
        )
        db.add(mood)
    db.commit()

    risk = models.RiskAssessment(
        patient_id=radha.id,
        support_priority="moderate",
        medication_risk_score=2,
        mood_risk_score=2,
        stock_risk_score=1,
        total_score=5,
        factors=json.dumps([
            "Missed 4 doses this week.",
            "Adherence is low at 68.0%.",
            "Consecutive low mood entries (2 days).",
            "Medicine stock is low (5.0 days remaining)."
        ])
    )
    db.add(risk)
    db.commit()

    notif1 = models.Notification(
        user_id=radha.id,
        title="Medication Reminder",
        body="Time to take Metformin 500mg.",
        type="medication_reminder",
        severity="info"
    )
    notif2 = models.Notification(
        user_id=meena.id,
        title="Missed Doses Alert",
        body="Radha missed 4 doses this week.",
        type="caregiver_alert",
        severity="warning"
    )
    db.add_all([notif1, notif2])
    db.commit()

    print("Successfully seeded database.")
    db.close()

if __name__ == "__main__":
    seed_db()

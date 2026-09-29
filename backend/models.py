from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import json
try:
    from .database import Base
except (ImportError, ValueError):
    from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # patient/caregiver/admin
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_active = Column(Boolean, default=True)

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    phone = Column(String)
    emergency_contact = Column(String)
    health_conditions = Column(String) # JSON string
    caregiver_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class Medication(Base):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    dosage = Column(String)
    frequency = Column(String) # daily/twice/thrice
    times = Column(String) # JSON string list
    tablets_per_dose = Column(Float)
    food_instruction = Column(String) # before/after/with
    start_date = Column(DateTime)
    is_active = Column(Boolean, default=True)

class MedicineStock(Base):
    __tablename__ = "medicine_stocks"
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"))
    remaining_tablets = Column(Float)
    refill_threshold = Column(Float)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class MedicationDose(Base):
    __tablename__ = "medication_doses"
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"))
    patient_id = Column(Integer, ForeignKey("users.id"))
    scheduled_time = Column(String)
    status = Column(String) # taken/missed/delayed/pending
    taken_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    date = Column(String) # YYYY-MM-DD

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    mood_score = Column(Integer) # 1-6
    mood_label = Column(String)
    journal_text = Column(Text, nullable=True)
    sentiment = Column(String) # positive/neutral/negative/distress
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    mood_entry_id = Column(Integer, ForeignKey("mood_entries.id"), nullable=True)
    text = Column(Text)
    sentiment = Column(String) # positive/neutral/negative/distress
    sentiment_score = Column(Float, default=0.0)
    keywords = Column(String, default="[]")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    support_priority = Column(String) # low/moderate/high
    medication_risk_score = Column(Integer)
    mood_risk_score = Column(Integer)
    stock_risk_score = Column(Integer)
    total_score = Column(Integer)
    factors = Column(String) # JSON list of strings
    assessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Caregiver(Base):
    __tablename__ = "caregivers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    relationship = Column(String)
    phone = Column(String)
    assigned_patients = Column(String) # JSON list of patient IDs

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    body = Column(Text)
    type = Column(String) # medication_reminder/missed_dose/refill/caregiver_alert/wellness/escalation
    severity = Column(String) # info/warning/critical
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    related_id = Column(Integer, nullable=True)

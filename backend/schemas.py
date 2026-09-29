from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
import json

class UserBase(BaseModel):
    username: str
    role: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PatientProfileBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    emergency_contact: str
    health_conditions: str
    caregiver_id: Optional[int] = None

class PatientProfileCreate(PatientProfileBase):
    user_id: int

class PatientProfileResponse(PatientProfileBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class MedicationBase(BaseModel):
    name: str
    dosage: str
    frequency: str
    times: str
    tablets_per_dose: float
    food_instruction: str
    start_date: datetime
    is_active: bool = True

class MedicationCreate(MedicationBase):
    patient_id: int

class MedicationResponse(MedicationBase):
    id: int
    patient_id: int
    model_config = ConfigDict(from_attributes=True)

class MedicineStockBase(BaseModel):
    remaining_tablets: float
    refill_threshold: float

class MedicineStockCreate(MedicineStockBase):
    medication_id: int

class MedicineStockResponse(MedicineStockBase):
    id: int
    medication_id: int
    last_updated: datetime
    model_config = ConfigDict(from_attributes=True)

class MedicationDoseBase(BaseModel):
    scheduled_time: str
    status: str
    taken_at: Optional[datetime] = None
    notes: Optional[str] = None
    date: str

class MedicationDoseCreate(MedicationDoseBase):
    medication_id: int
    patient_id: int

class MedicationDoseResponse(MedicationDoseBase):
    id: int
    medication_id: int
    patient_id: int
    model_config = ConfigDict(from_attributes=True)

class MoodEntryBase(BaseModel):
    mood_score: int
    mood_label: str
    journal_text: Optional[str] = None
    sentiment: str

class MoodEntryCreate(MoodEntryBase):
    patient_id: int

class MoodEntryResponse(MoodEntryBase):
    id: int
    patient_id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class JournalEntryBase(BaseModel):
    text: str
    sentiment: str
    sentiment_score: Optional[float] = 0.0
    keywords: Optional[str] = "[]"

class JournalEntryCreate(JournalEntryBase):
    patient_id: int
    mood_entry_id: Optional[int] = None

class JournalEntryResponse(JournalEntryBase):
    id: int
    patient_id: int
    mood_entry_id: Optional[int] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RiskAssessmentBase(BaseModel):
    support_priority: str
    medication_risk_score: int
    mood_risk_score: int
    stock_risk_score: int
    total_score: int
    factors: str

class RiskAssessmentCreate(RiskAssessmentBase):
    patient_id: int

class RiskAssessmentResponse(RiskAssessmentBase):
    id: int
    patient_id: int
    assessed_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CaregiverBase(BaseModel):
    name: str
    relationship: str
    phone: str
    assigned_patients: str

class CaregiverCreate(CaregiverBase):
    user_id: int

class CaregiverResponse(CaregiverBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class NotificationBase(BaseModel):
    title: str
    body: str
    type: str
    severity: str
    is_read: bool = False
    related_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

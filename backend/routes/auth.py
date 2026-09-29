from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
try:
    from .. import models, schemas, database
except (ImportError, ValueError):
    import models, schemas, database

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    role: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == request.username, models.User.role == request.role).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Login successful", "user": {"id": user.id, "username": user.username, "role": user.role}}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

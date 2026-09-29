from fastapi import APIRouter
from pydantic import BaseModel
try:
    from ..ai.chatbot import get_response
except (ImportError, ValueError):
    from ai.chatbot import get_response

router = APIRouter(prefix="/chat", tags=["chat"])

from typing import Optional

class ChatRequest(BaseModel):
    message: str
    patient_id: Optional[int] = None
    session_id: Optional[str] = "default"

@router.post("/")
def chat(request: ChatRequest):
    context = {"is_first_session": request.session_id == "new"}
    res = get_response(request.message, context)
    return res

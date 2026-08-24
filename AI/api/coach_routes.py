from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.coach_service import chat_with_coach

coach_router = APIRouter()

class ConversationMessage(BaseModel):
    role: str
    content: str

class CoachChatRequest(BaseModel):
    message: str
    conversation: List[ConversationMessage]
    context: Dict[str, Any]

@coach_router.post("/chat")
def coach_chat(request: CoachChatRequest):
    try:
        response_text = chat_with_coach(
            message=request.message,
            conversation=[{"role": m.role, "content": m.content} for m in request.conversation],
            context=request.context
        )
        return {"success": True, "response": response_text}
    except Exception as e:
        print("FastAPI Coach route error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

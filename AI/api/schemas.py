from pydantic import BaseModel
from typing import List, Dict, Any


class StartInterviewRequest(BaseModel):
    category: str
    questions: List[str]


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class InterviewResponse(BaseModel):
    session_id: str
    question: str
    score: int | None = None
    evaluation: Dict[str, Any] | None = None
    difficulty: str | None = None
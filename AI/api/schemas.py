from pydantic import BaseModel
from typing import List, Dict, Any


class StartInterviewRequest(BaseModel):
    collection_id: str
    category: str
    num_questions: int = 5


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class InterviewResponse(BaseModel):
    session_id: str
    question: str
    score: int | None = None
    evaluation: Dict[str, Any] | None = None
    difficulty: str | None = None
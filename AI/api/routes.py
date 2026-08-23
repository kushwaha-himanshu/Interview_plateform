from fastapi import APIRouter, HTTPException

from api.schemas import (
    StartInterviewRequest,
    AnswerRequest
)

from interview.session_manager import (
    create_session,
    submit_answer
)

from llm.gemini_client import llm

from vectorStore.retrieval import get_resume_context


router = APIRouter()


# ==========================================
# START INTERVIEW
# ==========================================

@router.post("/start")
def start_interview(
    request: StartInterviewRequest
):

    try:

        # Retrieve relevant resume context
        query = f"""
        Find resume information relevant to
        a {request.category} interview.

        Focus only on information explicitly
        present in the resume.
        """

        context = get_resume_context(query)

        # Create interview session
        session_id, state = create_session(
            category=request.category,
            questions=request.questions,
            context=context
        )

        return {
            "session_id": session_id,
            "question": state["current_question"],
            "status": "active"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================
# SUBMIT ANSWER
# ==========================================

@router.post("/answer")
def answer_interview(
    request: AnswerRequest
):

    try:

        result = submit_answer(
            session_id=request.session_id,
            answer=request.answer,
            llm=llm
        )

        return result

    except KeyError:

        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
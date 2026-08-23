from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

import os
import uuid

from services.rag_service import (
    process_resume,
    retrieve_resume_context
)

from llm.question_generator import generate_questions

from interview.session_manager import (
    create_session,
    submit_answer
)

from llm.gemini_client import llm
UPLOAD_DIR = "temp"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)
router = APIRouter()
@router.post("/process-resume")
async def process_resume_endpoint(
    file: UploadFile = File(...)
):

    allowed_extensions = {
        ".pdf",
        ".docx"
    }

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )

    temp_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    temp_path = os.path.join(
        UPLOAD_DIR,
        temp_filename
    )

    try:

        contents = await file.read()

        with open(temp_path, "wb") as f:
            f.write(contents)

        result = process_resume(
            temp_path
        )

        return {
            "success": True,
            "file_name": file.filename,
            "collection_id": result["collection_id"],
            "chunk_count": result["chunk_count"]
        }

    except Exception as e:

        print("Resume processing error:", e)

        raise HTTPException(
            status_code=500,
            detail="Resume processing failed"
        )

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)

from pydantic import BaseModel


class StartInterviewRequest(BaseModel):
    collection_id: str
    category: str = "technical"
    num_questions: int = 5


@router.post("/start")
def start_interview(
    request: StartInterviewRequest
):

    try:

        # 1. Generate questions from this resume
        questions_text = generate_questions(
            collection_id=request.collection_id,
            category=request.category,
            num_questions=request.num_questions
        )

        # 2. Convert AI response into a list
        questions = []

        for line in questions_text.splitlines():

            line = line.strip()

            if not line:
                continue

            # Remove "1.", "2.", etc.
            parts = line.split(".", 1)

            if (
                len(parts) == 2
                and parts[0].strip().isdigit()
            ):
                line = parts[1].strip()

            if line:
                questions.append(line)

        if not questions:
            raise ValueError(
                "No questions were generated"
            )

        # 3. Get resume context
        query = f"""
        Find information from the resume
        relevant to a {request.category} interview.
        """

        context = retrieve_resume_context(
            collection_id=request.collection_id,
            query=query
        )

        # 4. Create interview session
        session_id, state = create_session(
            category=request.category,
            questions=questions,
            context=context
        )

        return {
            "success": True,
            "session_id": session_id,
            "question": state["current_question"],
            "question_number": 1,
            "total_questions": len(questions),
            "status": "active"
        }

    except Exception as e:

        print(
            "Start interview error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to start interview"
        )
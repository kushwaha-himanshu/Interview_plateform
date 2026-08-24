import uuid

from interview.evaluator import evaluate_answer
from interview.adaptive_question import generate_adaptive_question
from interview.final_report import generate_final_report

# Store active interviews
sessions = {}


def create_session(category, questions, context, difficulty="Intermediate", interviewer_style="Professional", duration="30 min", total_questions=5, resume_id=None, collection_id=None):

    session_id = str(uuid.uuid4())

    state = {
        "category": category,
        "questions": questions,

        "current_question_index": 0,
        "current_question": (
            questions[0]
            if questions
            else None
        ),

        "answers": [],
        "covered_topics": [],
        "evaluations": [],
        "scores": [],

        "context": context,
        "status": "active",
        "difficulty": difficulty,
        "interviewer_style": interviewer_style,
        "duration": duration,
        "total_questions": total_questions,
        "resume_id": resume_id,
        "collection_id": collection_id
    }

    sessions[session_id] = state

    return session_id, state


def submit_answer(session_id, answer, llm):

    if session_id not in sessions:
        raise KeyError("Interview session not found")

    state = sessions[session_id]

    current_question = state["current_question"]

    # -----------------------------
    # Evaluate answer
    # -----------------------------

    evaluation = evaluate_answer(
        llm,
        state["context"],
        current_question,
        answer
    )

    score = evaluation["score"]

    # -----------------------------
    # Difficulty
    # -----------------------------

    if score <= 3:
        difficulty = "easy"

    elif score <= 6:
        difficulty = "medium"

    elif score <= 8:
        difficulty = "hard"

    else:
        difficulty = "advanced"

    # -----------------------------
    # Store answer
    # -----------------------------

    state["answers"].append(answer)

    state["evaluations"].append(
        evaluation
    )

    state["scores"].append(
        score
    )

    # -----------------------------
    # Covered topic
    # -----------------------------

    topic = evaluation.get("topic")

    if (
        topic
        and topic not in state["covered_topics"]
    ):
        state["covered_topics"].append(topic)

    # -----------------------------
    # Check completion
    # -----------------------------

    # if len(state["answers"]) >= 5:

    #     state["status"] = "completed"

    #     return {
    #         "completed": True,
    #         "score": score,
    #         "evaluation": evaluation,
    #         "difficulty": difficulty,
    #         "covered_topics": state["covered_topics"],
    #         "scores": state["scores"]
    #     }

    if len(state["answers"]) >= state.get("total_questions", 5):

      state["status"] = "completed"

      final_report = generate_final_report(state)

      return {
        "completed": True,

        "score": score,

        "evaluation": evaluation,

        "difficulty": difficulty,

        "covered_topics": state["covered_topics"],

        "scores": state["scores"],

        "final_report": final_report
    }

    # -----------------------------
    # Generate next question
    # -----------------------------

    next_question = generate_adaptive_question(

        llm=llm,

        context=state["context"],

        category=state["category"],

        question=current_question,

        answer=answer,

        evaluation=evaluation,

        difficulty=difficulty,

        covered_topics=state["covered_topics"],

        selected_difficulty=state.get("difficulty", "Intermediate"),

        interviewer_style=state.get("interviewer_style", "Professional")
    )

    state["current_question"] = next_question

    state["current_question_index"] += 1

    # -----------------------------
    # Return API response
    # -----------------------------

    return {
        "completed": False,

        "question": next_question,

        "score": score,

        "evaluation": evaluation,

        "difficulty": difficulty,

        "covered_topics": state["covered_topics"],

        "question_number": len(
            state["answers"]
        ) + 1
    }
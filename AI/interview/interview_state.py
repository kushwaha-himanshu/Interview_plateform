def create_interview_state(category,questions):

    return {
        "category": category,
        "questions": questions,
        "current_question_index": 0,
        "current_question": questions[0] if questions else None,
        "answers": [],
        "covered_topics" : [],
        "evaluations": [],
        "scores": [],
        "status": "active"
    }
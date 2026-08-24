from llm.prompts import FOLLOWUP_PROMPT


def generate_adaptive_question(
    llm,
    context,
    category,
    question,
    answer,
    evaluation,
    difficulty,
    covered_topics,
    selected_difficulty="Intermediate",
    interviewer_style="Professional"
):

    prompt = FOLLOWUP_PROMPT.format(
        context=context,
        category=category,
        question=question,
        answer=answer,
        evaluation=evaluation,
        difficulty=difficulty,
        covered_topics=covered_topics,
        selected_difficulty=selected_difficulty,
        interviewer_style=interviewer_style
    )

    response = llm.invoke(prompt)

    if isinstance(response.content, list):
        return response.content[0]["text"]

    return response.content
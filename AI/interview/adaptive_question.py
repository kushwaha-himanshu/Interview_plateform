from llm.prompts import FOLLOWUP_PROMPT


def generate_adaptive_question(
    llm,
    context,
    category,
    question,
    answer,
    evaluation,
    difficulty,
    covered_topics
):

    prompt = FOLLOWUP_PROMPT.format(
        context=context,
        category=category,
        question=question,
        answer=answer,
        evaluation=evaluation,
        difficulty=difficulty,
        covered_topics=covered_topics
    )

    response = llm.invoke(prompt)

    if isinstance(response.content, list):
        return response.content[0]["text"]

    return response.content
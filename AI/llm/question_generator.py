# llm/question_generator.py

from vectorStore.retrieval import retrieve_resume_context
from llm.prompts import QUESTION_GENERATION_PROMPT
from llm.gemini_client import llm


def generate_questions(
    collection_id: str,
    category: str,
    num_questions: int = 5
):

    query = f"""
    Find resume information relevant to a {category} interview.

    Focus ONLY on information explicitly present in the resume.

    Do not invent any skills, projects, technologies,
    companies, certifications, or experience.
    """

    # Retrieve context from THIS resume's collection
    
    context = retrieve_resume_context(
        collection_id=collection_id,
        query=query
    )

    if not context:
        raise ValueError(
            "No relevant resume context found"
        )

    prompt = QUESTION_GENERATION_PROMPT.format(
        context=context,
        category=category,
        num_questions=num_questions
    )

    response = llm.invoke(prompt)

    if isinstance(response.content, list):
        return response.content[0]["text"]

    return response.content
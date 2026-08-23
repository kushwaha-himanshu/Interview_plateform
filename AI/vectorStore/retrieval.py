# vectorStore/retrieval.py

from vectorStore.chroma_store import get_resume_context


def retrieve_resume_context(
    collection_id: str,
    query: str
):
    return get_resume_context(
        collection_id=collection_id,
        query=query
    )
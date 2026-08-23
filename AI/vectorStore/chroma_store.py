# vectorStore/chroma_store.py

from pathlib import Path

from langchain_chroma import Chroma
from embeddings.upsate_embedding import embeddings


BASE_DIR = Path(__file__).resolve().parents[1]

CHROMA_PATH = BASE_DIR / "chroma_db"


def get_vectorstore(collection_id: str):

    collection_name = f"resume_{collection_id}"

    return Chroma(
        collection_name=collection_name,
        persist_directory=str(CHROMA_PATH),
        embedding_function=embeddings
    )


def create_resume_collection(
    collection_id: str,
    documents
):

    if not documents:
        raise ValueError("No documents to store")

    vectorstore = get_vectorstore(
        collection_id
    )

    vectorstore.add_documents(
        documents
    )

    return vectorstore


def get_resume_retriever(
    collection_id: str
):

    vectorstore = get_vectorstore(
        collection_id
    )

    return vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 3,
            "fetch_k": 15,
            "lambda_mult": 0.5
        }
    )


def get_resume_context(
    collection_id: str,
    query: str
):

    retriever = get_resume_retriever(
        collection_id
    )

    results = retriever.invoke(query)

    return "\n\n".join(
        doc.page_content
        for doc in results
    )
# services/rag_service.py

import uuid

from loaders.resume_loader import load_resume
from processing.text_splitter import split_documents
from vectorStore.chroma_store import (
    create_resume_collection,
    get_resume_context
)


def process_resume(file_path):

    # Generate unique collection ID
    collection_id = str(uuid.uuid4())

    # Parse resume
    documents = load_resume(file_path)

    # Split resume
    chunks = split_documents(documents)

    # Store in Chroma
    create_resume_collection(
        collection_id,
        chunks
    )

    return {
        "collection_id": collection_id,
        "chunk_count": len(chunks)
    }


def retrieve_resume_context(
    collection_id,
    query
):

    return get_resume_context(
        collection_id,
        query
    )
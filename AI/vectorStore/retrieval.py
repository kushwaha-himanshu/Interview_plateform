from vectorStore.chroma_store import retriever


def get_resume_context(query):

    results = retriever.invoke(query)

    context = "\n\n".join(
        doc.page_content
        for doc in results
    )

    return context
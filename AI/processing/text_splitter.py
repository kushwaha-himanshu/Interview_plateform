# processing/text_splitter.py

from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents):

    if not documents:
        raise ValueError("No documents provided")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    return splitter.split_documents(documents)
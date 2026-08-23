from pathlib import Path

from embeddings.upsate_embedding import embeddings
from langchain_chroma import Chroma


# ==========================================
# BASE DIRECTORY
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[1]

CHROMA_PATH = BASE_DIR / "chroma_db"


# ==========================================
# LOAD EXISTING VECTOR DATABASE
# ==========================================

vectorstore = Chroma(

    persist_directory=str(CHROMA_PATH),

    embedding_function=embeddings
)


# ==========================================
# MMR RETRIEVER
# ==========================================

retriever = vectorstore.as_retriever(

    search_type="mmr",

    search_kwargs={
        "k": 3,
        "fetch_k": 15,
        "lambda_mult": 0.5
    }
)
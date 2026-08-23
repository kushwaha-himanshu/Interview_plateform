from pathlib import Path

from embeddings.upsate_embedding import embeddings
from langchain_chroma import Chroma

from processing.text_splitter import texts


# ==========================================
# 1. BASE DIRECTORY
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[1]

CHROMA_PATH = BASE_DIR / "chroma_db"


# ==========================================
# 2. REMOVE DUPLICATE CHUNKS
# ==========================================

unique_texts = []
seen = set()

for doc in texts:

    content = doc.page_content.strip()

    if content and content not in seen:

        seen.add(content)
        unique_texts.append(doc)


texts = unique_texts

print("Unique chunks:", len(texts))


# ==========================================
# 3. CREATE VECTOR DATABASE
# ==========================================

vectorstore = Chroma.from_documents(

    documents=texts,

    embedding=embeddings,

    persist_directory=str(CHROMA_PATH)
)

print("Vectors stored successfully!")


# ==========================================
# 4. CREATE MMR RETRIEVER
# ==========================================

retriever = vectorstore.as_retriever(

    search_type="mmr",

    search_kwargs={
        "k": 3,
        "fetch_k": 15,
        "lambda_mult": 0.5
    }
)


print("MMR retriever created!")


# ==========================================
# 5. TEST RETRIEVAL
# ==========================================

query = "What skills and projects are mentioned in the resume?"

results = retriever.invoke(query)

print("\nRetrieved results:")

for i, doc in enumerate(results):

    print(f"\n--- Result {i + 1} ---")

    print(doc.page_content)
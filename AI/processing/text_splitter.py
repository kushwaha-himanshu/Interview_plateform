from pathlib import Path

from loaders.resume_loader import load_resume
from langchain_text_splitters import RecursiveCharacterTextSplitter


BASE_DIR = Path(__file__).resolve().parents[1]

file_path = BASE_DIR / "data" / "uploads" / "Aarav_sharma.pdf"

print("Loading file:", file_path)


# Load and clean resume
docs = load_resume(file_path)

print("Number of pages:", len(docs))


# Split documents
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

texts = text_splitter.split_documents(docs)

print("Number of chunks:", len(texts))


# Check chunks
# for i, text in enumerate(texts[:5]):
#     print(f"\n--- Chunk {i + 1} ---")
#     print(text.page_content)
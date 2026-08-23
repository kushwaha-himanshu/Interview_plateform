from pathlib import Path

from dotenv import load_dotenv
from langchain_upstage import UpstageDocumentParseLoader

from processing.text_cleaner import clean_documents


BASE_DIR = Path(__file__).resolve().parents[1]

load_dotenv(BASE_DIR / ".env")


def load_resume(file_path):

    loader = UpstageDocumentParseLoader(
        str(file_path),
        split="page"
    )

    docs = loader.load()

    docs = clean_documents(docs)

    return docs
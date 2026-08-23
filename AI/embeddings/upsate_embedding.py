import os

from dotenv import load_dotenv
from langchain_upstage import UpstageEmbeddings

load_dotenv()


embeddings = UpstageEmbeddings(
    model="embedding-query",
    api_key=os.getenv("UPSTAGE_API_KEY")
)
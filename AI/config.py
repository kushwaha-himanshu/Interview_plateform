import os
from dotenv import load_dotenv

load_dotenv()

UPSTAGE_API_KEY = os.getenv("UPSTAGE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


if not UPSTAGE_API_KEY:
    raise ValueError("UPSTAGE_API_KEY is missing in .env")


if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing in .env")
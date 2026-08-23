from fastapi import FastAPI

app = FastAPI(
    title="MINDFLARE AI Service",
    description="AI and RAG service for the MINDFLARE Interview Platform",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "MINDFLARE AI Service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
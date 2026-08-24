from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from api.coach_routes import coach_router


app = FastAPI(
    title="MINDFLARE AI Service",
    description="AI-powered adaptive interview service",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5174",
        "http://localhost:8000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================
# ROUTES
# ==========================================

app.include_router(
    router,
    prefix="/api/interview"
)

app.include_router(
    coach_router,
    prefix="/api/coach"
)


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "MINDFLARE AI Service is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }
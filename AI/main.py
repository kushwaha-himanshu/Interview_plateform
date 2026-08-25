import os
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

allowed_origins_env = os.getenv("CORS_ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8000",
        "https://interview-plateform-three.vercel.app",
        "https://interview-plateform-1-b12h.onrender.com"
    ]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

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
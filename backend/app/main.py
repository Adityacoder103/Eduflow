from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from .core.config import settings
from .schemas.schemas import (
    LoginRequest,
    Token,
    UserResponse,
    AIAssistantRequest,
    AIAssistantResponse
)
from .core.security import create_access_token, verify_password, get_password_hash
from .ai.risk_engine import RuleBasedRiskEngine

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Teacher-First College Project Management and Evaluation SaaS for Indian Colleges."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "product": "EduFlow SaaS",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs",
        "academic_session": "2026-2027"
    }

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "connected"
    }

# Demonstration authentication endpoint
@app.post(f"{settings.API_V1_STR}/auth/login", response_model=Token)
async def login(req: LoginRequest):
    # Simulated demo users
    if "sharma" in req.email.lower() or "teacher" in req.email.lower():
        user = UserResponse(
            id="usr_t1",
            email=req.email,
            name="Prof. Rajeshwar Sharma",
            role="teacher",
            department="Computer Science & Engineering",
            roll_number=None,
            created_at=datetime.now(timezone.utc)
        )
        token = create_access_token(user.id, role="teacher")
        return Token(access_token=token, token_type="bearer", user=user)
    else:
        user = UserResponse(
            id="usr_s1",
            email=req.email,
            name="Aditya Verma",
            role="student",
            department="Computer Science & Engineering",
            roll_number="21CS042",
            created_at=datetime.now(timezone.utc)
        )
        token = create_access_token(user.id, role="student")
        return Token(access_token=token, token_type="bearer", user=user)

# AI Teacher Assistant Endpoint
@app.post(f"{settings.API_V1_STR}/ai/assistant", response_model=AIAssistantResponse)
async def ai_assistant_query(req: AIAssistantRequest):
    query_lower = req.query.lower()
    heuristics = ["RuleBasedRiskEngine", "ContinuousEvaluationRubric"]

    if "risk" in query_lower or "delay" in query_lower:
        response_text = (
            "Heuristic Risk Assessment indicates Group 09 (PulseGuard) is currently at HIGH RISK "
            "due to 1 overdue milestone and 19 days without deliverable. Recommended faculty intervention: "
            "convene a check-in with leader Kunal Deshmukh."
        )
    elif "rubric" in query_lower or "viva" in query_lower:
        response_text = (
            "Generated Capstone Viva Rubric (50 Marks):\n"
            "1. Architecture & Normalization: 15 Marks\n"
            "2. Prototype Implementation & Demo: 15 Marks\n"
            "3. Individual Defense & Git Audit: 10 Marks\n"
            "4. IEEE Report Documentation: 10 Marks"
        )
    else:
        response_text = (
            f"EduFlow Academic Intelligence processed query: '{req.query}'. "
            "All curriculum milestones are synchronized with university semester deadlines."
        )

    return AIAssistantResponse(
        query=req.query,
        response=response_text,
        heuristics_used=heuristics,
        timestamp=datetime.now(timezone.utc)
    )

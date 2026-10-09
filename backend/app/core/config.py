from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduFlow SaaS"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "eduflow-secret-development-key-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    DATABASE_URL: str = "sqlite+aiosqlite:///./eduflow.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://eduflow-frontend-rho.vercel.app"
    ]

    GEMINI_API_KEY: str = ""
    UPLOAD_DIR: str = "./uploads"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

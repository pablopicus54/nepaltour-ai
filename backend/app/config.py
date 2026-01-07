from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database (SQLite for local development, use PostgreSQL for production)
    DATABASE_URL: str = "sqlite:///./nepaltour_ai.db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"


settings = Settings()

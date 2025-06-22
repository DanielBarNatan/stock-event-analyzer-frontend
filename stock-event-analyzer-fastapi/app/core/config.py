import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env file from parent directory
load_dotenv(dotenv_path='../.env')

class Settings(BaseSettings):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS settings
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",  # Frontend
        "http://localhost:4000",  # Express backend
    ]

settings = Settings() 
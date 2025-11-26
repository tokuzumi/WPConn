from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    APP_SECRET: str
    WEBHOOK_VERIFY_TOKEN: str
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()

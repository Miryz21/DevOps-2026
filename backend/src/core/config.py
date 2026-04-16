from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Require DATABASE_URL to be provided via environment for security
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # Secret keys: these should be provided via environment (SECRET_KEY/PUBLIC_KEY)
    # The values can be either the raw PEM content or a path to the PEM file
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    PUBLIC_KEY: str = Field(..., env="PUBLIC_KEY")

    class Config:
        env_file = ".env"


settings = Settings()

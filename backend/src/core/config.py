from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/dbname"
    SECRET_KEY: str = "keys/private.pem"
    PUBLIC_KEY: str = "keys/public.pem"

    class Config:
        env_file = ".env"


settings = Settings()

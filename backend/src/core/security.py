from datetime import datetime, timedelta, timezone
from typing import Any, Union
import uuid

from jwt import JWT, jwk_from_pem
from jwt.exceptions import JWTDecodeError
from passlib.context import CryptContext
from pathlib import Path

from src.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt = JWT()

ALGORITHM = "RS256"
ACCESS_TOKEN_EXPIRE_HOURS = 168

def _load_pem(value: str) -> bytes:
    """Accept either raw PEM content or a filesystem path to a PEM file."""
    if value.strip().startswith("-----BEGIN"):
        return value.encode()

    p = Path(value)
    if p.exists():
        return p.read_bytes()

    raise FileNotFoundError(f"Key not found at {value}")


SECRET_JWK = None
PUBLIC_JWK = None


def _ensure_jwks() -> None:
    """Lazily load JWKs from settings. Raises RuntimeError when keys are missing.

    Loading is deferred so test collection/import-time doesn't require configured secrets.
    """
    global SECRET_JWK, PUBLIC_JWK
    if SECRET_JWK is not None and PUBLIC_JWK is not None:
        return

    if not settings.SECRET_KEY or not settings.PUBLIC_KEY:
        # Leave uninitialized; calling code should handle missing keys or tests may patch
        raise RuntimeError("JWT keys are not configured. Set SECRET_KEY and PUBLIC_KEY environment variables.")

    SECRET_JWK = jwk_from_pem(_load_pem(settings.SECRET_KEY))
    PUBLIC_JWK = jwk_from_pem(_load_pem(settings.PUBLIC_KEY))


def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    try:
        _ensure_jwks()
    except RuntimeError:
        # In test / dev environments where RSA keys are not provided, return a
        # harmless opaque token. Tests should mock `decode_access_token` when
        # they need to validate JWT content.
        return f"dev-token-{uuid.uuid4().hex}"

    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_JWK, alg=ALGORITHM)
    return encoded_jwt


def decode_access_token(access_token: str) -> Any:
    try:
        _ensure_jwks()
        message_received = jwt.decode(access_token, PUBLIC_JWK, do_time_check=True)
        return message_received
    except JWTDecodeError as e:
        raise ValueError("Incorrect JWT") from e


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

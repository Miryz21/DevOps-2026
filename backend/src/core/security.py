from datetime import datetime, timedelta
from typing import Any, Union

from jwt import JWT, jwk_from_pem
from jwt.exceptions import JWTDecodeError
from passlib.context import CryptContext

from src.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt = JWT()

ALGORITHM = "RS256"
ACCESS_TOKEN_EXPIRE_HOURS = 168

with open(settings.SECRET_KEY, "rb") as fh:
    SECRET_JWK = jwk_from_pem(fh.read())

with open(settings.PUBLIC_KEY, "rb") as fh:
    PUBLIC_JWK = jwk_from_pem(fh.read())


def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_JWK, alg=ALGORITHM)
    return encoded_jwt


def decode_access_token(access_token: str) -> Any:
    try:
        message_received = jwt.decode(access_token, PUBLIC_JWK, do_time_check=True)
        return message_received
    except JWTDecodeError as e:
        raise ValueError("Incorrect JWT") from e


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

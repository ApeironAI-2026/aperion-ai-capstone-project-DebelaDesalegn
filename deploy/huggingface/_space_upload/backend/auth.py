import hmac
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from jwt.exceptions import InvalidTokenError

from backend.config import (
    ADMIN_API_KEY,
    ADMIN_PASSWORD,
    ADMIN_USERNAME,
    JWT_EXPIRE_HOURS,
    JWT_SECRET,
)

bearer_scheme = HTTPBearer(auto_error=False)


def auth_required() -> bool:
    """True when admin login or API key is configured."""
    return bool(ADMIN_PASSWORD) or bool(ADMIN_API_KEY)


def verify_password(password: str) -> bool:
    if not ADMIN_PASSWORD:
        return False
    return hmac.compare_digest(password.encode("utf-8"), ADMIN_PASSWORD.encode("utf-8"))


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    payload = {
        "sub": subject,
        "role": "admin",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "jti": secrets.token_hex(8),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc

    if payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Invalid token role")
    return payload


def authenticate_admin(username: str, password: str) -> str:
    if not ADMIN_PASSWORD:
        raise HTTPException(
            status_code=503,
            detail="Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.",
        )

    username_ok = hmac.compare_digest(
        username.encode("utf-8"),
        ADMIN_USERNAME.encode("utf-8"),
    )
    if not username_ok or not verify_password(password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return create_access_token(ADMIN_USERNAME)


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    x_admin_key: str | None = Header(default=None),
) -> None:
    """Allow request when auth is off, or when JWT / admin API key is valid."""
    if not auth_required():
        return

    if ADMIN_API_KEY and x_admin_key and hmac.compare_digest(x_admin_key, ADMIN_API_KEY):
        return

    if credentials and credentials.scheme.lower() == "bearer":
        decode_access_token(credentials.credentials)
        return

    raise HTTPException(
        status_code=401,
        detail="Admin authentication required. Sign in or provide a valid token.",
        headers={"WWW-Authenticate": "Bearer"},
    )

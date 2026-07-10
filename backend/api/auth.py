from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

from backend.auth import (
    auth_required,
    authenticate_admin,
    decode_access_token,
    require_admin,
)
from backend.config import ADMIN_PASSWORD, ADMIN_USERNAME

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, examples=["admin"])
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "admin"
    username: str


@router.get("/status")
def auth_status():
    return {
        "auth_required": auth_required(),
        "login_enabled": bool(ADMIN_PASSWORD),
    }


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    token = authenticate_admin(body.username.strip(), body.password)
    return LoginResponse(
        access_token=token,
        username=ADMIN_USERNAME,
    )


@router.get("/me")
def me(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    _: None = Depends(require_admin),
):
    username = ADMIN_USERNAME
    if credentials and credentials.scheme.lower() == "bearer":
        payload = decode_access_token(credentials.credentials)
        username = payload.get("sub", ADMIN_USERNAME)
    return {"authenticated": True, "role": "admin", "username": username}

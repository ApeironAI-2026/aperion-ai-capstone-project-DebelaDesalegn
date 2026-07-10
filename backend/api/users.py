from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.attendance.analytics import list_users
from backend.auth import require_admin
from backend.database.crud import get_user_profile
from backend.database.dp import get_db

router = APIRouter()


@router.get("/")
def attendance_analytics(
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    return list_users(db)


@router.get("/profile/{user_id}")
def user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    profile = get_user_profile(db, user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")
    return profile

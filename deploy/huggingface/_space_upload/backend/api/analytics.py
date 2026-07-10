from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.attendance.analytics import compute_analytics
from backend.auth import require_admin
from backend.database.dp import get_db

router = APIRouter()


@router.get("/")
def attendance_analytics(
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    return compute_analytics(db)

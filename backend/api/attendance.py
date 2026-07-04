router = APIRouter()

# 1. Mark attendance (main endpoint)
@router.post("/")
async def mark_attendance(image: UploadFile = File(...), db: Session = Depends(get_db)):
    ...

# 2. Dashboard data
@router.get("/attendance/all")
def get_attendance_records():
    ...

# 3. Analytics
@router.get("/attendance/analytics")
def attendance_analytics():
    ...

# 4. Today’s attendance (optional)
@router.get("/attendance/today")
def get_today_attendance():
    ...

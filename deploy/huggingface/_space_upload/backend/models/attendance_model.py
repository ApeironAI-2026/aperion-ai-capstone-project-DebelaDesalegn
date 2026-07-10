from sqlalchemy import Column, Integer, String, DateTime
from backend.database.database import Base
from sqlalchemy.orm import declarative_base
Base = declarative_base()

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    timestamp = Column(DateTime)
    status = Column(String)

from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class TranscriptionJob(Base):
    __tablename__ = "transcription_jobs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    transcript_text = Column(Text, nullable=True)
    transcript_file_path = Column(String, nullable=True)
    language = Column(String, default="auto")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

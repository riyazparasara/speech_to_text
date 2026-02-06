from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TranscriptionJobBase(BaseModel):
    filename: str

class TranscriptionJobCreate(TranscriptionJobBase):
    pass

class TranscriptionJobResponse(TranscriptionJobBase):
    id: int
    status: str
    transcript_text: Optional[str] = None
    transcript_file_path: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

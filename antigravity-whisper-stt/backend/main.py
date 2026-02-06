from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid
from datetime import datetime, timezone

from .database import engine, Base, get_db
from .models import TranscriptionJob
from .schemas import TranscriptionJobResponse
from .whisper_service import run_transcription

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Whisper Transcription API",
    description="API for transcribing audio files using OpenAI Whisper",
    version="1.1.0"
)

# CORS - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
TRANSCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "transcripts")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/upload", response_model=TranscriptionJobResponse, status_code=status.HTTP_201_CREATED)
async def upload_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: str = Form("auto"),
    db: Session = Depends(get_db)
):
    # Validate file type
    allowed_exts = ('.mp3', '.wav', '.m4a', '.mp4', '.ogg', '.flac', '.webm')
    if not file.filename.lower().endswith(allowed_exts):
        raise HTTPException(status_code=400, detail=f"Unsupported file format. Please upload one of: {', '.join(allowed_exts)}")

    # Save file
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = os.path.join(UPLOADS_DIR, saved_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"DEBUG: Upload received. Filename: {file.filename}, Language selected: {language}")

    # Create Job Record with explicit UTC time
    new_job = TranscriptionJob(
        filename=file.filename,
        status="pending",
        transcript_file_path="",
        language=language,
        created_at=datetime.now(timezone.utc) 
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Trigger Background Task
    background_tasks.add_task(run_transcription, new_job.id, file_path, db)

    return new_job

@app.get("/jobs", response_model=List[TranscriptionJobResponse])
def list_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(TranscriptionJob).order_by(TranscriptionJob.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@app.get("/jobs/{job_id}", response_model=TranscriptionJobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(TranscriptionJob).filter(TranscriptionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(TranscriptionJob).filter(TranscriptionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return None

@app.get("/download/{job_id}/{format}")
def download_transcript(job_id: int, format: str, db: Session = Depends(get_db)):
    job = db.query(TranscriptionJob).filter(TranscriptionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job.status != "completed":
        raise HTTPException(status_code=400, detail="Transcription not yet completed")

    if format not in ["txt", "json", "segments"]:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'txt', 'json', or 'segments'")

    if format == "segments":
        filename = f"transcript_{job_id}_segments.json"
    else:
        filename = f"transcript_{job_id}.{format}"
        
    file_path = os.path.join(TRANSCRIPTS_DIR, filename)
    
    if not os.path.exists(file_path):
        # Fallback for 'segments' if legacy job or failed save - serve main json
        if format == "segments":
            fallback = os.path.join(TRANSCRIPTS_DIR, f"transcript_{job_id}.json")
            if os.path.exists(fallback):
                 return FileResponse(path=fallback, filename=f"transcript_{job_id}.json", media_type="application/json")
        
        raise HTTPException(status_code=404, detail="Transcript file missing on server")

    return FileResponse(
        path=file_path, 
        filename=filename, 
        media_type="application/json" if format in ["json", "segments"] else "application/text"
    )

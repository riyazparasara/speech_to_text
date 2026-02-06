import whisper
import os
import json
from sqlalchemy.orm import Session
from .models import TranscriptionJob
from datetime import datetime, timezone

# Load model globally to avoid reloading per request
# Using "base" model as default, can be configured via env
MODEL_SIZE = os.getenv("WHISPER_MODEL", "base")
print(f"Loading Whisper model: {MODEL_SIZE}...")
try:
    model = whisper.load_model(MODEL_SIZE)
    print("Whisper model loaded successfully.")
except Exception as e:
    print(f"Error loading Whisper model: {e}")
    model = None

def run_transcription(job_id: int, file_path: str, db: Session):
    """
    Background task to process audio file with Whisper.
    Updates DB status and saves transcript to file.
    """
    try:
        if model is None:
            raise Exception("Whisper model not loaded")

        job = db.query(TranscriptionJob).filter(TranscriptionJob.id == job_id).first()
        if not job:
            return

        job.status = "processing"
        db.commit()

        # result = model.transcribe(file_path) # Basic transcription
        # Using fp16=False for CPU compatibility if CUDA not available
        # verbose=True / default returns segments
        transcribe_options = {"fp16": False}
        if job.language and job.language != "auto":
            transcribe_options["language"] = job.language
            print(f"DEBUG: Forcing language to: {job.language}")
            
            # Add initial prompt for Hindi to force Devanagari script
            if job.language == "hi":
                transcribe_options["initial_prompt"] = "नमस्ते, यह हिंदी में ट्रांसक्रिप्शन है।"
        else:
            print("DEBUG: Using Auto-Detect language.")

        result = model.transcribe(file_path, **transcribe_options)

        transcript_text = result["text"]
        segments = result.get("segments", [])
        
        # Save to file
        transcripts_dir = os.path.join(os.path.dirname(__file__), "transcripts")
        os.makedirs(transcripts_dir, exist_ok=True)
        
        txt_filename = f"transcript_{job_id}.txt"
        json_filename = f"transcript_{job_id}.json"
        segments_filename = f"transcript_{job_id}_segments.json"
        
        txt_path = os.path.join(transcripts_dir, txt_filename)
        json_path = os.path.join(transcripts_dir, json_filename)
        segments_path = os.path.join(transcripts_dir, segments_filename)
        
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(transcript_text)
            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
            
        with open(segments_path, "w", encoding="utf-8") as f:
            json.dump(segments, f, indent=2, ensure_ascii=False)

        # Update DB
        job.transcript_text = transcript_text
        job.transcript_file_path = txt_path
        job.status = "completed"
        job.updated_at = datetime.now(timezone.utc)
        db.commit()

        print(f"Job {job_id} completed successfully.")

    except Exception as e:
        print(f"Job {job_id} failed: {e}")
        job = db.query(TranscriptionJob).filter(TranscriptionJob.id == job_id).first()
        if job:
            job.status = "failed"
            job.updated_at = datetime.now(timezone.utc)
            db.commit()

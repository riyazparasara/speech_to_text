# Docker Hub Instructions

## 🎙️ Whisper Speech-to-Text

A self-hosted, full-stack video and audio transcription platform supporting multiple languages including **Hindi** and **English**.

### 🐳 How to Run

1. **Pull the Images:**

```bash
docker pull riyazparasara/speech_to_text:backend
docker pull riyazparasara/speech_to_text:frontend
```

2. **Run with Docker Compose:**

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    image: riyazparasara/speech_to_text:backend
    ports:
      - "8000:8000"
    volumes:
      - ./app_data/uploads:/app/backend/uploads
      - ./app_data/transcripts:/app/backend/transcripts
    environment:
      - WHISPER_MODEL=turbo
  
  frontend:
    image: riyazparasara/speech_to_text:frontend
    ports:
      - "3000:80"
```

3. **Start:**
```bash
docker-compose up -d
```

### 🔧 Configuration

**WHISPER_MODEL**:
- `turbo` (Default) - Fast and accurate.
- `large-v3` - Best accuracy (requires ~4GB RAM).
- `medium` - Balanced.
- `base` - Fast, lower accuracy.

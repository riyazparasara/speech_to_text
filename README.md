# 🎙️ Whisper Speech-to-Text Platform

> **A self-hosted, full-stack audio transcription platform built with OpenAI Whisper, FastAPI, and React.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://hub.docker.com/r/riyazparasara/speech_to_text)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)

---

## 🌟 Features

- **High Accuracy Transcription**: Powered by OpenAI's **Whisper** models (`large-v3`, `turbo`, `medium`).
- **Multi-Language Support**: Automatically handles **Hindi**, **English**, and mixed-language (Hinglish) audio.
- **Rich File Support**: Upload `MP3`, `WAV`, `MP4`, `M4A`, `OGG`, `FLAC`, and `WEBM`.
- **Detailed Segments**: View precise start/end timestamps for every sentence.
- **Docker Ready**: One-command deployment.
- **Modern UI**: Clean, responsive interface for managing transcription jobs.

---

## 🚀 Quick Start (Docker)

The fastest way to run the application is using the pre-built images from Docker Hub.

### 1. Create a `docker-compose.yml`

Copy the content below into a file named `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: riyazparasara/speech_to_text:backend
    ports:
      - "8000:8000"
    volumes:
      - ./uploads:/app/backend/uploads
      - ./transcripts:/app/backend/transcripts
    environment:
      # Options: tiny, base, small, medium, large-v3, turbo
      - WHISPER_MODEL=turbo
    restart: always

  frontend:
    image: riyazparasara/speech_to_text:frontend
    ports:
      - "3000:80"
    restart: always
```

### 2. Run the Application

```bash
docker-compose up -d
```

### 3. Access

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

*Note: The first run may take time to download the Whisper model file.*

---

## 🛠️ Development Setup

To build and run from source:

### Prerequisites
- Python 3.9+
- Node.js 18+
- FFmpeg

### 1. Clone & Setup Backend
```bash
git clone https://github.com/riyazparasara/speech_to_text.git
cd speech_to_text/backend

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Server
uvicorn main:app --reload
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔮 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `WHISPER_MODEL` | The Whisper model size to use. (`tiny`, `base`, `small`, `medium`, `large-v3`, `turbo`) | `large-v3` |


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

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

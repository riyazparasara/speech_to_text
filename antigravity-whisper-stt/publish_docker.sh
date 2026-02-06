#!/bin/bash

# Build and Push Backend
echo "Building Backend..."
docker build -t riyazparasara/speech_to_text:backend -f docker/Dockerfile.backend .
docker push riyazparasara/speech_to_text:backend

# Build and Push Frontend
echo "Building Frontend..."
docker build -t riyazparasara/speech_to_text:frontend -f docker/Dockerfile.frontend .
docker push riyazparasara/speech_to_text:frontend

echo "Done! Images pushed to Docker Hub."

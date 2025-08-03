# Multi-stage build for Rhyme Racer
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Python backend
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create a simple server to serve the frontend
RUN pip install aiofiles

# Create a simple static file server
RUN echo 'from aiofiles import open as aio_open\n\
import os\n\
from fastapi import FastAPI\n\
from fastapi.staticfiles import StaticFiles\n\
from fastapi.responses import FileResponse\n\
from backend.main import app\n\
\n\
# Mount static files\n\
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")\n\
\n\
@app.get("/")\n\
async def serve_frontend():\n\
    return FileResponse("frontend/build/index.html")\n\
\n\
@app.get("/{full_path:path}")\n\
async def serve_static(full_path: str):\n\
    if os.path.exists(f"frontend/build/{full_path}"):\n\
        return FileResponse(f"frontend/build/{full_path}")\n\
    return FileResponse("frontend/build/index.html")\n\
' > serve.py

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Start the application
CMD ["python", "-m", "uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "8000"] 
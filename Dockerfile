# Build React Frontend
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Build FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for OpenCV and ML models
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend assets
COPY --from=build-stage /app/dist ./dist

# Create uploads and temp directories
RUN mkdir -p backend/uploads backend/temp

EXPOSE 8000

# Start server
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]

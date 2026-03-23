import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, status, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel

import jwt
import uuid
import base64

from models import ComplaintRequest, Token, UserCreate, UserLogin
from nlp_component import analyze_complaint
from whisper_service import transcribe_audio
from pothole_detector import PotholeDetector

app = FastAPI(
    title="Jan Vaani API",
    description="AI-Powered Governance Platform Backend",
    version="1.0.0",
)

# Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
SECRET_KEY = os.getenv("SECRET_KEY", "janvaani_secret_key_change_me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
DATASET_BASE = os.path.join(os.path.dirname(__file__), "..", "data", "India")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB — lazy connection (won't crash if MongoDB isn't running at import time)
client: Optional[AsyncIOMotorClient] = None
db = None
users_collection = None
complaints_collection = None
pothole_reports_collection = None

# Pothole detector – initialised with dataset for annotation lookup
pothole_detector: Optional[PotholeDetector] = None


@app.on_event("startup")
async def startup_db():
    global client, db, users_collection, complaints_collection, pothole_reports_collection
    global pothole_detector
    try:
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=3000)
        await client.admin.command("ping")
        db = client.janvaani_db
        users_collection = db.users
        complaints_collection = db.complaints
        pothole_reports_collection = db.pothole_reports
        print("[MongoDB] Connected successfully")
    except Exception as e:
        print(f"[MongoDB] Not available ({e}). Auth endpoints will return errors.")
        client = None
        db = None
        users_collection = None
        complaints_collection = None
        pothole_reports_collection = None

    # Wire shared DB handle for governance routes
    try:
        from db import set_db
        if db is not None:
            set_db(db)
            print("[Governance] Shared DB handle set")
    except Exception as e:
        print(f"[Governance] DB handle setup failed: {e}")

    # Ensure directories exist
    os.makedirs("temp", exist_ok=True)
    os.makedirs(UPLOADS_DIR, exist_ok=True)

    # Initialise pothole detector
    dataset_path = DATASET_BASE if os.path.isdir(DATASET_BASE) else None
    pothole_detector = PotholeDetector(dataset_base=dataset_path)

# Mount uploads directory for serving static images
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


import bcrypt

# Auth utilities (Replaced passlib with direct bcrypt for v5.0 compatibility)
def verify_password(plain_password, hashed_password):
    try:
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_password[:72].encode('utf-8'), hashed_password)
    except Exception:
        return False

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password[:72].encode('utf-8'), salt).decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except jwt.PyJWTError:
        return None
    
    if users_collection is not None:
        user = await users_collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
            return user
    return None

async def require_current_user(current_user: dict = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return current_user

# -----------------------------------------------------------------------
# Health Check
# -----------------------------------------------------------------------

@app.get("/api/health")
async def health_check():
    mongo_ok = users_collection is not None
    return {
        "status": "ok",
        "mongodb": "connected" if mongo_ok else "unavailable",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# -----------------------------------------------------------------------
# Auth Endpoints
# -----------------------------------------------------------------------

@app.post("/api/auth/signup", response_model=Token)
async def signup(user: UserCreate):
    try:
        if users_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")

        existing_user = await users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        if user.role == "admin":
            if not user.registration_key or user.registration_key != "JANVAANI_ADMIN_2024":
                raise HTTPException(status_code=403, detail="Invalid administration registration key")

        hashed_password = get_password_hash(user.password)
        user_dict = user.model_dump() if hasattr(user, "model_dump") else user.dict()
        user_dict.pop("password")
        user_dict["hashed_password"] = hashed_password

        await users_collection.insert_one(user_dict)

        access_token = create_access_token(data={"sub": user.email, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[AUTH] SIGNUP ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "alive"}


@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    user = await users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}


# -----------------------------------------------------------------------
# NLP Analysis Endpoint (used by Citizen Portal)
# -----------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    text: str
    location: Optional[str] = None
    category: Optional[str] = None


@app.post("/api/analyze")
async def analyze_text(req: AnalyzeRequest):
    """Analyze citizen complaint text using NLP pipeline."""
    result = analyze_complaint(req.text)

    # Override location/category if user provided them explicitly
    if req.location:
        result["location"] = req.location
    if req.category:
        result["category"] = req.category

    return result


# -----------------------------------------------------------------------
# Voice Report Endpoint
# -----------------------------------------------------------------------

async def _handle_voice_report(audio: UploadFile, language: Optional[str]):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_location = os.path.join(temp_dir, audio.filename)

    with open(file_location, "wb") as f:
        f.write(await audio.read())

    try:
        transcript = transcribe_audio(file_location, language_hint=language)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Speech transcription failed: {exc}")

    nlp_result = analyze_complaint(
        transcript.get("text", ""),
        language_hint=transcript.get("language") or language,
    )

    try:
        os.remove(file_location)
    except OSError:
        pass

    return {
        "transcript": transcript,
        "analysis": nlp_result,
    }


@app.post("/api/voice-report")
async def voice_report(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
):
    return await _handle_voice_report(audio, language)


@app.post("/voice-report")
async def voice_report_alias(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
):
    return await _handle_voice_report(audio, language)


@app.post("/analyze")
async def analyze_text(payload: ComplaintRequest):
    if not payload.text:
        raise HTTPException(status_code=400, detail="text is required")

    analysis_result = analyze_complaint(payload.text, language_hint=payload.language)

    return {
        "analysis": analysis_result,
        "transcript": payload.text
    }


# -----------------------------------------------------------------------
# Complaints Storage Endpoints
# -----------------------------------------------------------------------

class ComplaintCreate(BaseModel):
    description: str
    location: str
    category: str
    analysis: dict
    author_email: Optional[str] = None


@app.post("/api/complaints")
async def create_complaint(complaint: ComplaintCreate, current_user: dict = Depends(get_current_user)):
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    complaint_dict = complaint.model_dump() if hasattr(complaint, "model_dump") else complaint.dict()
    complaint_dict["created_at"] = datetime.now(timezone.utc)
    complaint_dict["status"] = "Pending"
    
    if current_user:
        complaint_dict["author_email"] = current_user.get("email")
    
    # Generate a sequential tracking ID simply using current count
    count = await complaints_collection.count_documents({})
    complaint_dict["tracking_id"] = f"JV-2024-{(count + 1):03d}"

    result = await complaints_collection.insert_one(complaint_dict)
    complaint_dict["_id"] = str(result.inserted_id)
    
    return complaint_dict


@app.get("/api/complaints")
async def get_complaints(current_user: dict = Depends(require_current_user)):
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    query = {}
    if current_user.get("role") == "public":
        query["author_email"] = current_user.get("email")
    elif current_user.get("role") == "admin":
        assigned_region = current_user.get("assigned_region")
        if assigned_region:
            query["location"] = assigned_region

    complaints = await complaints_collection.find(query).sort("created_at", -1).to_list(100)
    for c in complaints:
        c["_id"] = str(c["_id"])
    return complaints

class ComplaintStatusUpdate(BaseModel):
    status: str

from bson import ObjectId

@app.patch("/api/complaints/{complaint_id}/status")
async def update_complaint_status(complaint_id: str, status_update: ComplaintStatusUpdate, current_user: dict = Depends(require_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only administrators can update status")
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        updated = await complaints_collection.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": {"status": status_update.status, "updated_at": datetime.now(timezone.utc)}}
        )
        if updated.modified_count == 0:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return {"message": "Status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid complaint ID format")


@app.get("/api/complaints/{complaint_id}")
async def get_complaint_by_id(complaint_id: str, current_user: dict = Depends(require_current_user)):
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        comp = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not comp:
            raise HTTPException(status_code=404, detail="Complaint not found")
        comp["_id"] = str(comp["_id"])
        return comp
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid complaint ID")


@app.get("/api/complaints/{complaint_id}/status")
async def get_complaint_status(complaint_id: str):
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        comp = await complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not comp:
            raise HTTPException(status_code=404, detail="Complaint not found")
        comp["_id"] = str(comp["_id"])
        return {
            "complaint_id": comp["_id"],
            "status": comp.get("status", "Pending"),
            "workflow_status": comp.get("workflow_status", "complaint_created"),
            "timeline": comp.get("timeline", []),
            "assigned_officer": comp.get("assigned_officer"),
            "proof_image_url": comp.get("proof_image_url"),
            "ai_verification": comp.get("ai_verification"),
            "citizen_feedback": comp.get("citizen_feedback"),
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid complaint ID")

# -----------------------------------------------------------------------
# Pothole Detection Endpoints
# -----------------------------------------------------------------------

@app.post("/api/detect-pothole")
async def detect_pothole(image: UploadFile = File(...)):
    """Detect potholes in an uploaded road image."""
    if pothole_detector is None:
        raise HTTPException(status_code=503, detail="Pothole detector not initialised")

    # Read image bytes
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Save uploaded image
    ext = os.path.splitext(image.filename or "img.jpg")[1] or ".jpg"
    saved_filename = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOADS_DIR, saved_filename)
    with open(saved_path, "wb") as f:
        f.write(image_bytes)

    # Run detection
    result = pothole_detector.detect(image_bytes, filename=image.filename)
    result["image_url"] = f"/uploads/{saved_filename}"
    result["original_filename"] = image.filename

    return result


class PotholeReportCreate(BaseModel):
    description: str = ""
    location: str = ""
    category: str = "road"
    image_url: str = ""
    original_filename: str = ""
    detection_result: dict = {}
    author_email: str = ""


@app.post("/api/pothole-reports")
async def create_pothole_report(report: PotholeReportCreate, current_user: dict = Depends(get_current_user)):
    """Store a pothole detection report in the database."""
    if pothole_reports_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    report_dict = report.model_dump() if hasattr(report, "model_dump") else report.dict()
    report_dict["created_at"] = datetime.now(timezone.utc)
    report_dict["status"] = "Pending"
    
    if current_user:
        report_dict["author_email"] = current_user.get("email")

    # Extract priority from detection result
    detection = report_dict.get("detection_result", {})
    report_dict["priority"] = detection.get("priority", "LOW")
    report_dict["detected"] = detection.get("detected", False)
    report_dict["confidence"] = detection.get("confidence", 0)
    report_dict["label"] = detection.get("label", "Unknown")

    # Generate tracking ID
    count = await pothole_reports_collection.count_documents({})
    report_dict["tracking_id"] = f"PH-2024-{(count + 1):03d}"

    result = await pothole_reports_collection.insert_one(report_dict)
    report_dict["_id"] = str(result.inserted_id)

    return report_dict


@app.get("/api/pothole-reports")
async def get_pothole_reports(current_user: dict = Depends(require_current_user)):
    """Get all pothole detection reports."""
    if pothole_reports_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    query = {}
    if current_user.get("role") == "public":
        query["author_email"] = current_user.get("email")
    elif current_user.get("role") == "admin":
        assigned_region = current_user.get("assigned_region")
        if assigned_region:
            query["location"] = assigned_region

    reports = await pothole_reports_collection.find(query).sort("created_at", -1).to_list(100)
    for r in reports:
        r["_id"] = str(r["_id"])
    return reports


@app.get("/api/pothole-stats")
async def get_pothole_stats():
    """Get aggregated pothole detection statistics."""
    if pothole_reports_collection is None:
        return {"total": 0, "high": 0, "medium": 0, "low": 0, "detected": 0}

    total = await pothole_reports_collection.count_documents({})
    high = await pothole_reports_collection.count_documents({"priority": "HIGH"})
    medium = await pothole_reports_collection.count_documents({"priority": "MEDIUM"})
    low = await pothole_reports_collection.count_documents({"priority": "LOW"})
    detected = await pothole_reports_collection.count_documents({"detected": True})

    return {
        "total": total,
        "high": high,
        "medium": medium,
        "low": low,
        "detected": detected,
    }


# -----------------------------------------------------------------------
# Register Governance Routers (must be at module level for FastAPI)
# -----------------------------------------------------------------------
try:
    import register_routers
    register_routers.register(app)
    print("[Governance] All governance routers registered")
except Exception as e:
    print(f"[Governance] Router registration failed: {e}")

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from pydantic import BaseModel
import os

from whisper_service import transcribe_audio
from nlp_component import analyze_complaint
from models import UserCreate, UserLogin, Token

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


@app.on_event("startup")
async def startup_db():
    global client, db, users_collection, complaints_collection
    try:
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=3000)
        # Test the connection
        await client.admin.command("ping")
        db = client.janvaani_db
        users_collection = db.users
        complaints_collection = db.complaints
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"⚠️  MongoDB not available ({e}). Auth endpoints will return errors.")
        client = None
        db = None
        users_collection = None
        complaints_collection = None

    # Ensure temp directory exists for voice uploads
    os.makedirs("temp", exist_ok=True)


# Auth utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password[:72])


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


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
        print(f"❌ SIGNUP ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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

@app.post("/api/voice-report")
async def voice_report(audio: UploadFile = File(...)):
    file_location = f"temp/{audio.filename}"

    with open(file_location, "wb") as f:
        f.write(await audio.read())

    transcript = transcribe_audio(file_location)
    nlp_result = analyze_complaint(transcript["text"])

    # Clean up temp file
    try:
        os.remove(file_location)
    except OSError:
        pass

    return {
        "transcript": transcript,
        "analysis": nlp_result,
    }


# -----------------------------------------------------------------------
# Complaints Storage Endpoints
# -----------------------------------------------------------------------

class ComplaintCreate(BaseModel):
    description: str
    location: str
    category: str
    analysis: dict


@app.post("/api/complaints")
async def create_complaint(complaint: ComplaintCreate):
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    complaint_dict = complaint.model_dump() if hasattr(complaint, "model_dump") else complaint.dict()
    complaint_dict["created_at"] = datetime.now(timezone.utc)
    complaint_dict["status"] = "Pending"
    
    # Generate a sequential tracking ID simply using current count
    count = await complaints_collection.count_documents({})
    complaint_dict["tracking_id"] = f"JV-2024-{(count + 1):03d}"

    result = await complaints_collection.insert_one(complaint_dict)
    complaint_dict["_id"] = str(result.inserted_id)
    
    return complaint_dict


@app.get("/api/complaints")
async def get_complaints():
    if complaints_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")

    complaints = await complaints_collection.find().sort("created_at", -1).to_list(100)
    for c in complaints:
        c["_id"] = str(c["_id"])
    return complaints
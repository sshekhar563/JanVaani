from pydantic import BaseModel, Field
from typing import Optional, List, Literal

# -----------------------------
# Auth Models
# -----------------------------

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str
    role: Literal["public", "admin"] = "public"
    registration_key: Optional[str] = None  # For admin

class UserLogin(BaseModel):
    email: str
    password: str

class UserInDB(UserBase):
    hashed_password: str
    role: Literal["public", "admin"] = "public"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# ... (rest of the models)


# -----------------------------
# Request Model
# -----------------------------

class ComplaintRequest(BaseModel):
    text: Optional[str] = Field(None, description="Citizen complaint text")
    location: Optional[str] = None
    category: Optional[str] = None

    input_mode: Literal["text", "voice", "image"] = "text"

    dialect: Optional[str] = None
    language: Optional[str] = None

    image_url: Optional[str] = None

    timestamp: Optional[str] = None


# -----------------------------
# Entity Extraction
# -----------------------------

class ExtractedEntities(BaseModel):
    locations: List[str] = []
    organizations: List[str] = []
    infrastructure: List[str] = []


# -----------------------------
# Sentiment Analysis
# -----------------------------

class SentimentResult(BaseModel):
    label: Literal["POSITIVE", "NEGATIVE", "NEUTRAL"]
    confidence: float


# -----------------------------
# Categorization
# -----------------------------

class CategoryResult(BaseModel):
    category: str
    confidence: float


# -----------------------------
# Risk / Misinformation Detection
# -----------------------------

class RiskFlags(BaseModel):
    misinformation_risk: bool = False
    abusive_language: bool = False
    spam_risk: bool = False


# -----------------------------
# Priority Scoring
# -----------------------------

class PriorityScore(BaseModel):
    urgency: float
    impact: float
    final_score: float


# -----------------------------
# Response Model
# -----------------------------

class NLPAnalysis(BaseModel):

    category: CategoryResult

    sentiment: SentimentResult

    entities: ExtractedEntities

    priority: PriorityScore

    risk_flags: RiskFlags

    detected_location: Optional[str] = None

    summary: Optional[str] = None

    recommended_action: Optional[str] = None
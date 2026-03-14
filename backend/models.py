from pydantic import BaseModel, Field
from typing import Optional, List, Literal


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

    detected_location: Optional[str]

    risk_flags: RiskFlags

    summary: Optional[str]

    recommended_action: Optional[str]
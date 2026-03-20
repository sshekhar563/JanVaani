import re
from typing import Dict, List, Optional

CATEGORY_KEYWORDS = {
    "road": ["pothole", "road", "traffic", "bridge", "flyover"],
    "water": ["water", "pipeline", "supply", "leak", "tanker"],
    "electricity": ["power", "electricity", "outage", "transformer", "meter"],
    "sanitation": ["garbage", "waste", "drain", "sewage", "cleanliness"],
    "health": ["clinic", "hospital", "doctor", "ambulance", "medicine"],
    "transport": ["bus", "metro", "station", "traffic", "signals"],
}

HIGH_IMPACT_CATEGORIES = {"water", "electricity", "health", "transport"}

SENTIMENT_LEXICON = {
    "en": {
        "positive": ["thank", "resolved", "good", "safe", "improved", "smooth"],
        "negative": ["delay", "bad", "angry", "danger", "urgent", "failed", "broken"],
    },
    "hi": {
        "positive": ["achha", "saf", "sukoon", "thik", "santusht", "khush"],
        "negative": ["der", "kharab", "nuksan", "vedna", "bhay", "turant", "band", "gira"],
    },
}

LOCATION_PATTERNS = [
    r"Sector\s*\d+",
    r"MG\s*Road",
    r"Tamboli\s*Road",
    r"(Aurangabad|Delhi|Bengaluru|Hyderabad|Lucknow|Jaipur|Mumbai|Kolkata|Chandigarh)",
]

LANGUAGE_OVERRIDES = {
    "hindi": "hi",
    "english": "en",
    "marathi": "mr",
    "punjabi": "pa",
    "bengali": "bn",
    "urdu": "ur",
    "tamil": "ta",
    "kannada": "kn",
    "telugu": "te",
    "gujarati": "gu",
    "malayalam": "ml",
    "odia": "or",
    "assamese": "as",
    "sanskrit": "sa",
    "sindhi": "sd",
    "dogri": "doi",
    "bhojpuri": "bh",
    "rajasthani": "raj",
    "haryanvi": "hi",
    "kashmiri": "ks",
    "bodo": "brx",
    "manipuri": "mni",
    "santali": "sat",
}

NEGATION_WORDS = {"not", "no", "nahi", "nahin", "without", "kabhi", "bina"}


def detect_language(text: str, language_hint: Optional[str] = None) -> str:
    if language_hint:
        normalized = language_hint.strip().lower()
        if normalized in LANGUAGE_OVERRIDES:
            return LANGUAGE_OVERRIDES[normalized]
        return normalized[:2]

    if re.search(r"[\u0900-\u097F]", text):
        return "hi"

    return "en"


def clean_tokens(text: str) -> List[str]:
    return re.findall(r"[a-zA-Z\u0900-\u097F]+", text.lower())


def analyze_sentiment(text: str, language: str) -> Dict[str, float]:
    tokens = clean_tokens(text)
    lexicon = SENTIMENT_LEXICON.get(language, SENTIMENT_LEXICON["en"])
    positive = lexicon["positive"]
    negative = lexicon["negative"]

    posit = sum(1 for token in tokens if token in positive)
    negat = sum(1 for token in tokens if token in negative)
    negation = sum(1 for token in tokens if token in NEGATION_WORDS)

    score = max(-1.0, min(1.0, (posit - negat) / max(len(tokens), 1)))
    if negation % 2 == 1:
        score = -score

    label = "POSITIVE" if score >= 0 else "NEGATIVE"
    confidence = round(0.4 + abs(score) * 0.6, 2)
    return {"label": label, "confidence": min(0.99, confidence)}


def categorize_issue(text: str) -> Dict[str, float]:
    text_lower = text.lower()

    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text_lower for keyword in keywords):
            return {"category": category.capitalize(), "confidence": 0.78}

    return {"category": "General", "confidence": 0.55}


def extract_location(text: str) -> Optional[str]:
    for pattern in LOCATION_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)
    return None


def summarize(text: str) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    if not sentences:
        return ""
    first = sentences[0].strip()
    return first[:120] + ("..." if len(first) > 120 else "")


def build_priority_score(urgency_bias: float, category: str, length: int) -> Dict[str, float]:
    category_weight = 0.2 if category.lower() in (name.lower() for name in HIGH_IMPACT_CATEGORIES) else 0.1
    urgency = min(1.0, max(0.2, urgency_bias + category_weight))
    impact = min(1.0, 0.4 + category_weight)
    final_score = min(1.0, (urgency + impact) / 2 + min(length, 400) / 800)

    return {"urgency": round(urgency, 2), "impact": round(impact, 2), "final_score": round(final_score, 2)}


def detect_risk_flags(text: str) -> Dict[str, bool]:
    text_lower = text.lower()
    return {
        "misinformation_risk": any(keyword in text_lower for keyword in ["fake", "rumor", "propaganda", "lies"]),
        "abusive_language": any(keyword in text_lower for keyword in ["stupid", "idiot", "chutiya", "bewakoof"]),
        "spam_risk": len(text_lower.split()) < 5,
    }


def score_from_label(label: str, confidence: float) -> float:
    base = 0.6 if label == "NEGATIVE" else 0.3
    return base + confidence * 0.2


def analyze_complaint(text: str, language_hint: Optional[str] = None) -> Dict[str, object]:
    normalized_text = (text or "").strip()
    if not normalized_text:
        return {}

    detected_language = detect_language(normalized_text, language_hint)
    sentiment = analyze_sentiment(normalized_text, detected_language)
    category_meta = categorize_issue(normalized_text)
    priority = build_priority_score(
        score_from_label(sentiment["label"], sentiment["confidence"]),
        category_meta["category"],
        len(normalized_text),
    )
    location = extract_location(normalized_text)
    summary = summarize(normalized_text)
    risk_flags = detect_risk_flags(normalized_text)

    recommended_action = f"Notify {category_meta['category']} team and share verified updates within 24 hours."

    return {
        "category": category_meta["category"],
        "category_confidence": category_meta["confidence"],
        "sentiment": sentiment["label"],
        "sentiment_confidence": sentiment["confidence"],
        "urgency": priority["urgency"],
        "impact": priority["impact"],
        "final_score": priority["final_score"],
        "location": location,
        "entities": {"locations": [location] if location else [], "organizations": [], "infrastructure": []},
        "risk_flags": risk_flags,
        "summary": summary,
        "recommended_action": recommended_action,
        "language": detected_language,
    }

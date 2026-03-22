"""
NLP analysis component for citizen complaints.
Gracefully falls back to keyword-based analysis when transformers/spacy are unavailable.
"""

# --- Sentiment Analysis -------------------------------------------------
try:
    from transformers import pipeline as _hf_pipeline
    _sentiment_model = _hf_pipeline("sentiment-analysis")
    HF_AVAILABLE = True
except Exception:
    _sentiment_model = None
    HF_AVAILABLE = False

# --- Named-Entity Recognition ------------------------------------------
try:
    import spacy
    _nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
except Exception:
    _nlp = None
    SPACY_AVAILABLE = False


# -----------------------------------------------------------------------
# Category keywords
# -----------------------------------------------------------------------
CATEGORIES = {
    "road": ["pothole", "road", "traffic", "bridge", "highway", "footpath"],
    "water": ["water", "pipeline", "supply", "leak", "tap", "borewell", "tanker"],
    "electricity": ["power", "electricity", "outage", "transformer", "streetlight", "voltage"],
    "sanitation": ["garbage", "waste", "drain", "sewage", "cleaning", "dump"],
    "education": ["school", "college", "teacher", "classroom", "building"],
    "healthcare": ["hospital", "clinic", "doctor", "medicine", "ambulance"],
    "safety": ["crime", "theft", "accident", "fire", "police"],
}


def categorize_issue(text):
    """Keyword-based issue categorization."""
    text_lower = text.lower()
    for category, keywords in CATEGORIES.items():
        for k in keywords:
            if k in text_lower:
                return category
    return "general"


def extract_location(text):
    """Extract location entities from text."""
    if SPACY_AVAILABLE and _nlp is not None:
        doc = _nlp(text)
        for ent in doc.ents:
            if ent.label_ in ["GPE", "LOC"]:
                return ent.text
    # Fallback: look for common location patterns
    location_hints = ["road", "sector", "block", "colony", "nagar", "ward", "lane", "market", "chowk"]
    words = text.split()
    for i, word in enumerate(words):
        if word.lower() in location_hints and i > 0:
            return " ".join(words[max(0, i - 1):i + 1])
    return None


def _get_sentiment(text):
    """Get sentiment label."""
    if HF_AVAILABLE and _sentiment_model is not None:
        return _sentiment_model(text)[0]["label"]
    # Simple keyword-based fallback
    negative_words = ["broken", "damaged", "bad", "worst", "terrible", "dangerous",
                      "unsafe", "dirty", "problem", "issue", "complaint", "pothole",
                      "leak", "overflow", "delay", "no supply", "failing"]
    text_lower = text.lower()
    neg_count = sum(1 for w in negative_words if w in text_lower)
    if neg_count >= 2:
        return "NEGATIVE"
    elif neg_count == 1:
        return "NEGATIVE"
    return "NEUTRAL"


def urgency_score(sentiment):
    """Map sentiment to an urgency score."""
    if sentiment == "NEGATIVE":
        return 0.85
    elif sentiment == "NEUTRAL":
        return 0.50
    return 0.30


def analyze_complaint(text, language_hint=None):
    """Full NLP analysis of a citizen complaint. Returns a result dict."""
    sentiment = _get_sentiment(text)
    category = categorize_issue(text)
    location = extract_location(text)
    urgency = urgency_score(sentiment)

    return {
        "sentiment": sentiment,
        "category": category,
        "location": location,
        "urgency": urgency,
    }
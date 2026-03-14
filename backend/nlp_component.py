from transformers import pipeline
import spacy

nlp = spacy.load("en_core_web_sm")

sentiment_model = pipeline("sentiment-analysis")

CATEGORIES = {
"road":["pothole","road","traffic","bridge"],
"water":["water","pipeline","supply","leak"],
"electricity":["power","electricity","outage"],
"sanitation":["garbage","waste","drain"]
}

def categorize_issue(text):

    text_lower = text.lower()

    for category,keywords in CATEGORIES.items():
        for k in keywords:
            if k in text_lower:
                return category

    return "general"


def extract_location(text):

    doc = nlp(text)

    for ent in doc.ents:
        if ent.label_ in ["GPE","LOC"]:
            return ent.text

    return None


def urgency_score(sentiment):

    if sentiment == "NEGATIVE":
        return 0.85
    return 0.4


def analyze_complaint(text):

    sentiment = sentiment_model(text)[0]["label"]

    category = categorize_issue(text)

    location = extract_location(text)

    urgency = urgency_score(sentiment)

    return {
        "sentiment": sentiment,
        "category": category,
        "location": location,
        "urgency": urgency
    }
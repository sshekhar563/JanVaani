"""
Predictive Governance Service.

Uses historical 311 complaint data to forecast:
- Future complaint volume
- Pothole predictions
- High-risk areas
- Resource requirements

Uses simple linear regression / trend analysis (works without heavy ML deps).
"""

import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

from utils.dataset_loader import load_csv_dataset

def _load_dataset():
    return load_csv_dataset("311_small.csv")


def _linear_forecast(series, periods=6):
    """Simple linear trend forecast on a time series (monthly counts)."""
    y = series.values.astype(float)
    x = np.arange(len(y))

    if len(x) < 2:
        return [float(y[-1])] * periods if len(y) else [0] * periods

    coeffs = np.polyfit(x, y, 1)
    future_x = np.arange(len(y), len(y) + periods)
    forecast = np.polyval(coeffs, future_x)
    return [max(0, round(float(v))) for v in forecast]


# ── Predict complaints ────────────────────────────────────────────────

def predict_complaints(months_ahead: int = 6):
    """Forecast total complaint count per month for the next N months."""
    df = _load_dataset()
    if df.empty:
        return {"forecast": [], "message": "No data available"}

    df["Created Date"] = pd.to_datetime(df["Created Date"], errors="coerce")
    df = df.dropna(subset=["Created Date"])
    df["month"] = df["Created Date"].dt.to_period("M")
    monthly = df.groupby("month").size()

    forecast = _linear_forecast(monthly, months_ahead)

    # Build labels for future months
    if len(monthly) > 0:
        last_period = monthly.index[-1]
        labels = [(last_period + i + 1).strftime("%Y-%m") for i in range(months_ahead)]
    else:
        base = datetime.now()
        labels = [(base + timedelta(days=30 * (i + 1))).strftime("%Y-%m") for i in range(months_ahead)]

    history = [{"month": str(p), "count": int(v)} for p, v in monthly.tail(12).items()]

    return {
        "history": history,
        "forecast": [{"month": l, "predicted_count": c} for l, c in zip(labels, forecast)],
        "trend": "increasing" if forecast[-1] > forecast[0] else "decreasing",
    }


# ── Predict potholes ──────────────────────────────────────────────────

def predict_potholes(months_ahead: int = 6):
    """Forecast pothole-specific complaints."""
    df = _load_dataset()
    if df.empty:
        return {"forecast": [], "message": "No data available"}

    df["Created Date"] = pd.to_datetime(df["Created Date"], errors="coerce")
    df = df.dropna(subset=["Created Date"])

    if "Complaint Type" in df.columns:
        pothole_df = df[df["Complaint Type"].str.contains("Pothole|pothole|Street Condition", case=False, na=False)]
    else:
        pothole_df = df.sample(frac=0.1)

    pothole_df["month"] = pothole_df["Created Date"].dt.to_period("M")
    monthly = pothole_df.groupby("month").size()

    forecast = _linear_forecast(monthly, months_ahead)

    if len(monthly) > 0:
        last_period = monthly.index[-1]
        labels = [(last_period + i + 1).strftime("%Y-%m") for i in range(months_ahead)]
    else:
        base = datetime.now()
        labels = [(base + timedelta(days=30 * (i + 1))).strftime("%Y-%m") for i in range(months_ahead)]

    history = [{"month": str(p), "count": int(v)} for p, v in monthly.tail(12).items()]

    return {
        "history": history,
        "forecast": [{"month": l, "predicted_count": c} for l, c in zip(labels, forecast)],
        "trend": "increasing" if len(forecast) >= 2 and forecast[-1] > forecast[0] else "stable",
    }


# ── High-risk areas ──────────────────────────────────────────────────

def predict_high_risk_areas(top_n: int = 5):
    """Identify areas with increasing complaint density."""
    df = _load_dataset()
    if df.empty:
        return {"areas": [], "message": "No data available"}

    if "Borough" not in df.columns:
        return {"areas": [], "message": "Borough column not found"}

    df["Created Date"] = pd.to_datetime(df["Created Date"], errors="coerce")
    df = df.dropna(subset=["Created Date"])
    df["month"] = df["Created Date"].dt.to_period("M")

    risk_scores = []
    for borough, grp in df.groupby("Borough"):
        monthly = grp.groupby("month").size()
        if len(monthly) < 2:
            trend = 0
        else:
            y = monthly.values.astype(float)
            x = np.arange(len(y))
            trend = float(np.polyfit(x, y, 1)[0])  # slope

        pothole_pct = 0
        if "Complaint Type" in grp.columns:
            pothole_pct = grp["Complaint Type"].str.contains("Pothole|Street", case=False, na=False).mean() * 100

        risk_scores.append({
            "area": str(borough),
            "total_complaints": int(len(grp)),
            "monthly_trend_slope": round(trend, 2),
            "pothole_percentage": round(pothole_pct, 2),
            "risk_level": "high" if trend > 50 else ("medium" if trend > 10 else "low"),
        })

    risk_scores.sort(key=lambda r: r["monthly_trend_slope"], reverse=True)
    return {"areas": risk_scores[:top_n]}

# ── Save Predictions to DB ──────────────────────────────────────────

async def generate_and_save_predictions(db):
    """Generate all predictions and save them to the predictions collection."""
    if db is None:
        return

    comp = predict_complaints(6)
    potholes = predict_potholes(6)
    risk = predict_high_risk_areas(5)

    doc = {
        "timestamp": datetime.now().isoformat(),
        "complaints_forecast": comp,
        "potholes_forecast": potholes,
        "high_risk_areas": risk
    }

    # Keep a single latest prediction doc for quick dashboard reads, or append
    await db.predictions.update_one(
        {"_id": "latest_predictions"},
        {"$set": doc},
        upsert=True
    )
    return doc

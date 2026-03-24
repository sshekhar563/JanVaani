"""
Digital Twin Simulation Engine.

Models a virtual city where each area has:
- complaints_count, pothole_count, avg_resolution_time, trust_score, population

Simulation rules:
- Potholes increase  → trust decreases
- Fast resolution    → trust increases
- Complaints increase → priority increases
"""

import os
import random
from datetime import datetime, timezone

import pandas as pd

from utils.dataset_loader import load_csv_dataset

def _default_areas():
    """Generate initial area models from the 311 dataset or defaults."""
    areas = {}
    df = load_csv_dataset("311_small.csv", usecols=["Borough", "Complaint Type", "Status"])

    if not df.empty:
        for borough, grp in df.groupby("Borough"):
            b = str(borough)
            pothole_count = int(grp["Complaint Type"].str.contains("Pothole|pothole", case=False, na=False).sum())
            areas[b] = {
                "area": b,
                "complaints_count": int(len(grp)),
                "pothole_count": pothole_count,
                "avg_resolution_time": round(random.uniform(12, 96), 2),
                "trust_score": round(random.uniform(50, 90), 2),
                "population": random.randint(200_000, 2_500_000),
                "priority": "medium",
            }
    else:
        for b in ["MANHATTAN", "BROOKLYN", "QUEENS", "BRONX", "STATEN ISLAND"]:
            areas[b] = {
                "area": b,
                "complaints_count": random.randint(5000, 30000),
                "pothole_count": random.randint(500, 5000),
                "avg_resolution_time": round(random.uniform(12, 96), 2),
                "trust_score": round(random.uniform(50, 90), 2),
                "population": random.randint(200_000, 2_500_000),
                "priority": "medium",
            }

    return areas


# ── State management ──────────────────────────────────────────────────

async def get_state(db):
    """Return the current digital twin state from MongoDB, or initialise it."""
    if db is None:
        return {"areas": _default_areas(), "tick": 0, "source": "default"}

    doc = await db.digital_twin_state.find_one({"_id": "city"})
    if doc:
        doc.pop("_id", None)
        return doc

    # First run — seed state
    state = {"_id": "city", "areas": _default_areas(), "tick": 0, "updated_at": datetime.now(timezone.utc)}
    await db.digital_twin_state.insert_one(state)
    state.pop("_id", None)
    return state


async def simulate(db, params: dict | None = None):
    """
    Run one simulation tick.

    Optional params:
      - pothole_delta: dict of area → change in pothole count
      - resolution_speed: dict of area → avg hours improvement
    """
    state = await get_state(db)
    areas = state.get("areas", {})
    tick = state.get("tick", 0) + 1

    pothole_delta = (params or {}).get("pothole_delta") or {}
    resolution_speed = (params or {}).get("resolution_speed") or {}

    for name, area in areas.items():
        # Apply pothole delta
        dp = pothole_delta.get(name, random.randint(-50, 100))
        area["pothole_count"] = max(0, area["pothole_count"] + dp)

        # Trust adjustments
        if dp > 0:
            area["trust_score"] = max(0, area["trust_score"] - dp * 0.02)
        elif dp < 0:
            area["trust_score"] = min(100, area["trust_score"] + abs(dp) * 0.03)

        # Resolution speed improvement
        speed_improve = resolution_speed.get(name, random.uniform(-2, 5))
        area["avg_resolution_time"] = max(1, area["avg_resolution_time"] - speed_improve)
        if speed_improve > 0:
            area["trust_score"] = min(100, area["trust_score"] + speed_improve * 0.5)

        # Complaints-driven priority
        if area["complaints_count"] > 20000:
            area["priority"] = "high"
        elif area["complaints_count"] > 10000:
            area["priority"] = "medium"
        else:
            area["priority"] = "low"

        # Simulate minor complaint fluctuations
        area["complaints_count"] += random.randint(-100, 200)
        area["trust_score"] = round(max(0, min(100, area["trust_score"])), 2)

    new_state = {
        "areas": areas,
        "tick": tick,
        "updated_at": datetime.now(timezone.utc),
    }

    if db is not None:
        await db.digital_twin_state.update_one(
            {"_id": "city"},
            {"$set": new_state},
            upsert=True,
        )

    return new_state

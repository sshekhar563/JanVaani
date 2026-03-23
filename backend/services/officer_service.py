"""
Officer Performance Intelligence Service.

Tracks and computes from COMPLAINTS collection (not pothole_reports):
- Cases handled / resolved
- Average resolution time
- Fraud cases
- Citizen rating (REAL from feedback)
- Efficiency score & ranking

Efficiency = 0.4*resolved_ratio + 0.3*speed_score + 0.2*citizen_rating - 0.1*fraud_ratio
"""

from datetime import datetime, timezone


# ── Compute performance for one officer ───────────────────────────────

async def compute_officer_performance(db, officer_email: str):
    """Aggregate metrics for an officer from complaints collection."""
    if db is None:
        return {"error": "Database not available"}

    # All complaints assigned to this officer
    total = await db.complaints.count_documents({"assigned_officer": officer_email})
    if total == 0:
        return {
            "officer_email": officer_email,
            "total_cases": 0,
            "resolved_cases": 0,
            "avg_resolution_hours": 0,
            "fraud_cases": 0,
            "citizen_rating": 0,
            "efficiency_score": 0,
            "updated_at": datetime.now(timezone.utc),
        }

    resolved = await db.complaints.count_documents({
        "assigned_officer": officer_email,
        "status": {"$in": ["Verified", "Resolved", "Closed"]},
    })

    # Average resolution time in hours (from assigned_at to proof_uploaded_at or updated_at)
    pipeline = [
        {"$match": {
            "assigned_officer": officer_email,
            "assigned_at": {"$exists": True},
            "updated_at": {"$exists": True},
            "status": {"$in": ["Verified", "Resolved", "Closed"]},
        }},
        {"$project": {
            "delta": {"$subtract": ["$updated_at", "$assigned_at"]},
        }},
        {"$group": {"_id": None, "avg_delta_ms": {"$avg": "$delta"}}},
    ]
    agg = await db.complaints.aggregate(pipeline).to_list(1)
    avg_hours = (agg[0]["avg_delta_ms"] / 3_600_000) if agg and agg[0].get("avg_delta_ms") else 48.0

    # Fraud cases linked to this officer's complaints
    fraud_count = 0
    try:
        officer_complaint_ids = []
        async for r in db.complaints.find({"assigned_officer": officer_email}, {"_id": 1}):
            officer_complaint_ids.append(str(r["_id"]))
        if officer_complaint_ids:
            fraud_count = await db.fraud_reports.count_documents({
                "report_id": {"$in": officer_complaint_ids},
                "flagged": True,
            })
    except Exception:
        fraud_count = 0

    # REAL citizen rating from feedback (not hardcoded)
    rating_pipeline = [
        {"$match": {
            "assigned_officer": officer_email,
            "citizen_feedback.rating": {"$exists": True},
        }},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$citizen_feedback.rating"}}},
    ]
    rating_agg = await db.complaints.aggregate(rating_pipeline).to_list(1)
    citizen_rating = rating_agg[0]["avg_rating"] if rating_agg and rating_agg[0].get("avg_rating") else 3.5

    # Compute efficiency score (0–100 scale)
    resolved_ratio = (resolved / total * 100) if total > 0 else 0
    speed_score = max(0, 100 - avg_hours)  # faster → higher
    fraud_ratio = (fraud_count / total * 100) if total > 0 else 0

    efficiency = round(
        0.4 * resolved_ratio +
        0.3 * min(speed_score, 100) +
        0.2 * (citizen_rating / 5 * 100) -
        0.1 * fraud_ratio,
        2,
    )

    record = {
        "officer_email": officer_email,
        "total_cases": total,
        "resolved_cases": resolved,
        "avg_resolution_hours": round(avg_hours, 2),
        "fraud_cases": fraud_count,
        "citizen_rating": round(citizen_rating, 2),
        "efficiency_score": efficiency,
        "updated_at": datetime.now(timezone.utc),
    }

    await db.officer_performance.update_one(
        {"officer_email": officer_email},
        {"$set": record},
        upsert=True,
    )

    return record


# ── Ranking ───────────────────────────────────────────────────────────

async def get_officer_ranking(db, limit: int = 20):
    """Return officers ranked by efficiency score."""
    if db is None:
        return []

    cursor = db.officer_performance.find().sort("efficiency_score", -1).limit(limit)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results


# ── Stats summary ─────────────────────────────────────────────────────

async def get_officer_stats(db):
    """Return aggregate officer statistics."""
    if db is None:
        return {}

    total_officers = await db.officer_performance.count_documents({})
    pipeline = [
        {"$group": {
            "_id": None,
            "avg_efficiency": {"$avg": "$efficiency_score"},
            "avg_resolution_hours": {"$avg": "$avg_resolution_hours"},
            "total_resolved": {"$sum": "$resolved_cases"},
            "total_fraud": {"$sum": "$fraud_cases"},
            "avg_rating": {"$avg": "$citizen_rating"},
        }},
    ]
    agg = await db.officer_performance.aggregate(pipeline).to_list(1)
    summary = agg[0] if agg else {}
    summary.pop("_id", None)
    summary["total_officers"] = total_officers
    return summary

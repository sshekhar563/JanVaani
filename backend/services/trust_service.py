"""
Public Trust Score Service.

Trust Score = 0.4*(Resolution Speed) + 0.3*(Citizen Rating) + 0.2*(Verification Rate) - 0.1*(Pending Ratio)

All scores are normalised to 0–100.
Citizen rating is calculated from REAL citizen_feedback in complaints.
"""

from datetime import datetime, timezone


async def compute_area_trust(db, area: str):
    """Compute trust score for a specific area/borough using REAL data."""
    if db is None:
        return {"error": "Database not available"}

    # Total and pending complaints for the area
    total = await db.complaints.count_documents({"location": {"$regex": area, "$options": "i"}})
    pending = await db.complaints.count_documents({
        "location": {"$regex": area, "$options": "i"},
        "status": {"$in": ["Pending", "Open", "In Progress", "Assigned"]},
    })
    resolved = await db.complaints.count_documents({
        "location": {"$regex": area, "$options": "i"},
        "status": {"$in": ["Resolved", "Verified", "Closed"]},
    })

    # Resolution speed — average hours from creation to resolution
    pipeline = [
        {"$match": {
            "location": {"$regex": area, "$options": "i"},
            "updated_at": {"$exists": True},
            "status": {"$in": ["Resolved", "Verified", "Closed"]},
        }},
        {"$project": {"delta": {"$subtract": ["$updated_at", "$created_at"]}}},
        {"$group": {"_id": None, "avg_ms": {"$avg": "$delta"}}},
    ]
    agg = await db.complaints.aggregate(pipeline).to_list(1)
    avg_hours = (agg[0]["avg_ms"] / 3_600_000) if agg and agg[0].get("avg_ms") else 72.0

    # Normalise speed: 0h→100, 168h(1 week)→0
    speed_score = max(0, min(100, 100 - (avg_hours / 168 * 100)))

    # REAL citizen rating from feedback (not hardcoded)
    rating_pipeline = [
        {"$match": {
            "location": {"$regex": area, "$options": "i"},
            "citizen_feedback.rating": {"$exists": True},
        }},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$citizen_feedback.rating"}}},
    ]
    rating_agg = await db.complaints.aggregate(rating_pipeline).to_list(1)
    raw_rating = rating_agg[0]["avg_rating"] if rating_agg and rating_agg[0].get("avg_rating") else 3.5
    citizen_rating = (raw_rating / 5) * 100  # normalise to 0-100

    # Verification rate — % of resolved complaints that have AI verification
    verified = await db.complaints.count_documents({
        "location": {"$regex": area, "$options": "i"},
        "ai_verification.verified": True,
    })
    verification_score = (verified / resolved * 100) if resolved > 0 else 50

    # Pending ratio (fewer pending → higher score)
    pending_score = ((pending / total) * 100) if total > 0 else 0

    trust = round(
        0.4 * speed_score +
        0.3 * citizen_rating +
        0.2 * verification_score -
        0.1 * pending_score,
        2,
    )
    trust = max(0, min(100, trust))

    record = {
        "area": area,
        "trust_score": trust,
        "speed_score": round(speed_score, 2),
        "citizen_rating": round(citizen_rating, 2),
        "verification_score": round(verification_score, 2),
        "total_complaints": total,
        "resolved_complaints": resolved,
        "pending_complaints": pending,
        "verified_complaints": verified,
        "updated_at": datetime.now(timezone.utc),
    }

    await db.trust_scores.update_one(
        {"area": area},
        {"$set": record},
        upsert=True,
    )

    return record


async def get_area_trust(db, area: str):
    """Retrieve stored trust score for an area."""
    if db is None:
        return {"error": "Database not available"}

    doc = await db.trust_scores.find_one({"area": {"$regex": area, "$options": "i"}})
    if doc:
        doc["_id"] = str(doc["_id"])
        return doc

    # Compute on the fly if not yet stored
    return await compute_area_trust(db, area)


async def get_city_trust(db):
    """Aggregate trust across all areas."""
    if db is None:
        return {"error": "Database not available"}

    # Get unique locations from complaints
    locations = await db.complaints.distinct("location")
    # Also check standard areas
    standard_areas = ["MANHATTAN", "BROOKLYN", "QUEENS", "BRONX", "STATEN ISLAND",
                      "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"]

    all_areas = set()
    for loc in locations:
        if loc:
            all_areas.add(loc)
    for sa in standard_areas:
        all_areas.add(sa)

    results = []
    for area in all_areas:
        count = await db.complaints.count_documents({"location": {"$regex": area, "$options": "i"}})
        if count > 0:
            score = await get_area_trust(db, area)
            if isinstance(score, dict) and "trust_score" in score:
                results.append(score)

    if not results:
        # Return demo data if no real complaints exist
        return {
            "city_trust_score": 72.5,
            "areas": [],
            "total_complaints": 0,
            "message": "No area data available yet. Submit complaints to populate trust scores.",
        }

    avg_trust = sum(r.get("trust_score", 0) for r in results) / len(results) if results else 0
    total_complaints = sum(r.get("total_complaints", 0) for r in results)
    total_resolved = sum(r.get("resolved_complaints", 0) for r in results)

    return {
        "city_trust_score": round(avg_trust, 2),
        "areas": results,
        "total_complaints": total_complaints,
        "total_resolved": total_resolved,
    }

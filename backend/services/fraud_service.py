"""
Fraud Detection Service.

Detects:
- duplicate_image   — same image hash reused across reports
- unresolved_damage — after-image still shows damage
- suspicious_time   — resolution completed unrealistically fast
- geo_mismatch      — before/after locations too far apart
"""

import hashlib
from datetime import datetime, timezone

# Thresholds
MIN_RESOLUTION_MINUTES = 15          # faster than this → suspicious
MAX_GEO_DISTANCE_KM = 5.0           # further than this → mismatch


def _haversine(lat1, lon1, lat2, lon2):
    """Approximate distance in km between two lat/lng points."""
    import math
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ── Run fraud checks on a report ─────────────────────────────────────

async def check_fraud(db, report_id: str):
    """Run all fraud checks against a pothole report and store flags."""
    from bson import ObjectId

    if db is None:
        return {"error": "Database not available"}

    report = await db.pothole_reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        return {"error": "Report not found"}

    flags = []
    details = {}

    # 1. Duplicate image check
    verification = report.get("verification", {})
    after_hash = verification.get("after_image_hash")
    if after_hash:
        dup_count = await db.pothole_reports.count_documents({
            "verification.after_image_hash": after_hash,
            "_id": {"$ne": ObjectId(report_id)},
        })
        if dup_count > 0:
            flags.append("duplicate_image")
            details["duplicate_image"] = f"Same image found in {dup_count} other report(s)"

    # 2. Unresolved damage
    if verification.get("after_detected"):
        flags.append("unresolved_damage")
        details["unresolved_damage"] = f"After-image confidence: {verification.get('after_confidence', 0)}"

    # 3. Suspicious time
    created = report.get("created_at")
    verified_at = verification.get("verified_at")
    if created and verified_at:
        if isinstance(created, str):
            try:
                created = datetime.fromisoformat(created)
            except Exception:
                created = None
        if created:
            delta_min = (verified_at - created).total_seconds() / 60
            if delta_min < MIN_RESOLUTION_MINUTES:
                flags.append("suspicious_time")
                details["suspicious_time"] = f"Resolved in {delta_min:.1f} minutes"

    # 4. Geo mismatch (placeholder — requires GPS on after image)
    # In production, extract EXIF GPS from after image and compare with report location.

    fraud_record = {
        "report_id": report_id,
        "flags": flags,
        "details": details,
        "flagged": len(flags) > 0,
        "checked_at": datetime.now(timezone.utc),
    }

    # Upsert into fraud_reports collection
    await db.fraud_reports.update_one(
        {"report_id": report_id},
        {"$set": fraud_record},
        upsert=True,
    )

    return fraud_record


# ── Get all fraud reports ─────────────────────────────────────────────

async def get_fraud_reports(db, limit: int = 100):
    """Return list of flagged fraud reports."""
    if db is None:
        return []

    cursor = db.fraud_reports.find({"flagged": True}).sort("checked_at", -1).limit(limit)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

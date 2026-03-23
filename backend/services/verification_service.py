"""
Proof-of-Work Verification Service.

Compares before vs after images using pothole detection logic to determine
whether a repair was actually completed.
"""

import hashlib
from datetime import datetime, timezone


# ── Core verification ─────────────────────────────────────────────────

async def verify_repair(db, report_id: str, after_image_bytes: bytes,
                        pothole_detector=None):
    """
    Run pothole detection on the *after* image.
    - If pothole still detected → mark as **incomplete**
    - If no pothole → mark as **verified**

    Returns a dict with the verification result.
    """
    from bson import ObjectId

    if db is None:
        return {"error": "Database not available"}

    # Fetch original report
    report = await db.pothole_reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        return {"error": "Report not found"}

    # Run detection on after image
    after_result = {"detected": False, "confidence": 0}
    if pothole_detector is not None:
        after_result = pothole_detector.detect(after_image_bytes, filename="after.jpg")

    pothole_still_present = after_result.get("detected", False)
    status = "incomplete" if pothole_still_present else "verified"

    # Compute before/after image hash for fraud service
    after_hash = hashlib.md5(after_image_bytes).hexdigest()

    verification_record = {
        "report_id": report_id,
        "status": status,
        "before_detected": report.get("detected", False),
        "before_confidence": report.get("confidence", 0),
        "after_detected": after_result.get("detected", False),
        "after_confidence": after_result.get("confidence", 0),
        "after_image_hash": after_hash,
        "verified_at": datetime.now(timezone.utc),
    }

    # Update the original report
    await db.pothole_reports.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": {
            "verification": verification_record,
            "status": "Verified" if status == "verified" else "Incomplete",
        }},
    )

    return verification_record


# ── Work status lookup ────────────────────────────────────────────────

async def get_work_status(db, report_id: str):
    """Return verification status for a given report."""
    from bson import ObjectId

    if db is None:
        return {"error": "Database not available"}

    report = await db.pothole_reports.find_one({"_id": ObjectId(report_id)})
    if not report:
        return {"error": "Report not found"}

    report["_id"] = str(report["_id"])
    return {
        "report_id": str(report["_id"]),
        "status": report.get("status", "Pending"),
        "verification": report.get("verification"),
    }

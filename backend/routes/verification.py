"""
Proof-of-Work Verification Routes — /api/verify-work, /api/work-status
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from db import get_db
from services.verification_service import verify_repair, get_work_status

router = APIRouter(tags=["Verification"])


@router.post("/api/verify-work")
async def verify_work(
    report_id: str = Form(...),
    after_image: UploadFile = File(...),
):
    """Upload an after-image and verify repair completion."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    image_bytes = await after_image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Try to get pothole detector from main module
    pothole_detector = None
    try:
        import main as _main
        pothole_detector = _main.pothole_detector
    except Exception:
        pass

    result = await verify_repair(db, report_id, image_bytes, pothole_detector)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.get("/api/work-status")
async def work_status(report_id: str):
    """Get verification status for a report."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    result = await get_work_status(db, report_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result

"""
Fraud Detection Routes — /api/fraud/*
Admin-only access.
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from db import get_db
from services.fraud_service import check_fraud, get_fraud_reports
from routes.rbac import require_admin

router = APIRouter(prefix="/api/fraud", tags=["Fraud Detection"])


@router.post("/check/{report_id}")
async def run_fraud_check(report_id: str, _user: dict = Depends(require_admin)):
    """Run fraud analysis on a specific report. Admin only."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    result = await check_fraud(db, report_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.get("/reports")
async def fraud_reports(limit: int = Query(100, le=500), _user: dict = Depends(require_admin)):
    """Get all flagged fraud reports. Admin only."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    return {"reports": await get_fraud_reports(db, limit=limit)}

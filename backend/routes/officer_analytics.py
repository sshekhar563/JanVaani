"""
Officer Performance Routes — /api/officer/*
Admin-only access.
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from db import get_db
from services.officer_service import (
    compute_officer_performance,
    get_officer_ranking,
    get_officer_stats,
)
from routes.rbac import require_admin

router = APIRouter(prefix="/api/officer", tags=["Officer Performance"])


@router.get("/performance")
async def officer_performance(email: str = Query(...), _user: dict = Depends(require_admin)):
    """Get or compute performance for a specific officer. Admin only."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    result = await compute_officer_performance(db, email)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.get("/ranking")
async def officer_ranking(limit: int = Query(20, le=100), _user: dict = Depends(require_admin)):
    """Get officers ranked by efficiency score. Admin only."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    return {"ranking": await get_officer_ranking(db, limit=limit)}


@router.get("/stats")
async def officer_stats(_user: dict = Depends(require_admin)):
    """Get aggregate officer statistics. Admin only."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    return await get_officer_stats(db)

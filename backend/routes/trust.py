"""
Public Trust Score Routes — /api/trust/*
"""

from fastapi import APIRouter, HTTPException, Query
from db import get_db
from services.trust_service import get_area_trust, get_city_trust

router = APIRouter(prefix="/api/trust", tags=["Trust Score"])


@router.get("/area")
async def trust_area(area: str = Query(...)):
    """Get trust score for a specific area."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    result = await get_area_trust(db, area)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result


@router.get("/city")
async def trust_city():
    """Get city-wide aggregate trust score."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    return await get_city_trust(db)

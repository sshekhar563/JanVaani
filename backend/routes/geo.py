"""
Geo Intelligence Routes — /api/geo/*
Admin-only access.
"""

from fastapi import APIRouter, Query, Depends
from services.geo_service import get_heatmap_data, get_clusters, get_area_stats
from routes.rbac import require_admin

router = APIRouter(prefix="/api/geo", tags=["Geo Intelligence"])


@router.get("/heatmap")
async def heatmap(limit: int = Query(5000, le=20000), _user: dict = Depends(require_admin)):
    """Get lat/lng points for complaint heatmap. Admin only."""
    return {"points": get_heatmap_data(limit=limit)}


@router.get("/clusters")
async def clusters(n: int = Query(10, ge=2, le=50), _user: dict = Depends(require_admin)):
    """Get KMeans complaint clusters. Admin only."""
    return get_clusters(n_clusters=n)


@router.get("/area-stats")
async def area_stats(borough: str | None = Query(None), _user: dict = Depends(require_admin)):
    """Get per-borough complaint statistics. Admin only."""
    return {"stats": get_area_stats(borough=borough)}

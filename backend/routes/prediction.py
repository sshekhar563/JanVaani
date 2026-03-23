"""
Predictive Governance Routes — /api/predict/*
Admin-only access.
"""

from fastapi import APIRouter, Query, Depends
from services.prediction_service import (
    predict_complaints,
    predict_potholes,
    predict_high_risk_areas,
)
from routes.rbac import require_admin

router = APIRouter(prefix="/api/predict", tags=["Prediction"])


@router.get("/complaints")
async def forecast_complaints(months: int = Query(6, ge=1, le=24), _user: dict = Depends(require_admin)):
    """Forecast total complaints for the next N months. Admin only."""
    return predict_complaints(months_ahead=months)


@router.get("/potholes")
async def forecast_potholes(months: int = Query(6, ge=1, le=24), _user: dict = Depends(require_admin)):
    """Forecast pothole-specific complaints. Admin only."""
    return predict_potholes(months_ahead=months)


@router.get("/high-risk-areas")
async def high_risk_areas(top: int = Query(5, ge=1, le=20), _user: dict = Depends(require_admin)):
    """Identify high-risk areas. Admin only."""
    return predict_high_risk_areas(top_n=top)

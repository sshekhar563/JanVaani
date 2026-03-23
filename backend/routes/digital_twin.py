"""
Digital Twin Simulation Routes — /api/digital-twin/*
Admin-only access.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from db import get_db
from services.digital_twin_service import get_state, simulate
from routes.rbac import require_admin

router = APIRouter(prefix="/api/digital-twin", tags=["Digital Twin"])


class SimulateRequest(BaseModel):
    pothole_delta: Optional[dict] = None
    resolution_speed: Optional[dict] = None


@router.get("/state")
async def twin_state(_user: dict = Depends(require_admin)):
    """Get current digital twin city state. Admin only."""
    db = get_db()
    result = await get_state(db)
    return result


@router.post("/simulate")
async def twin_simulate(params: SimulateRequest = SimulateRequest(), _user: dict = Depends(require_admin)):
    """Run one simulation tick. Admin only."""
    db = get_db()
    result = await simulate(db, params.model_dump() if hasattr(params, "model_dump") else params.dict())
    return result

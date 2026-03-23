"""
Register all new governance routers with the FastAPI app.

Called from app.py — keeps main.py completely untouched.
"""

from routes.geo import router as geo_router
from routes.verification import router as verification_router
from routes.fraud import router as fraud_router
from routes.officer_analytics import router as officer_router
from routes.trust import router as trust_router
from routes.digital_twin import router as digital_twin_router
from routes.prediction import router as prediction_router
from routes.workflow import router as workflow_router

ALL_ROUTERS = [
    geo_router,
    verification_router,
    fraud_router,
    officer_router,
    trust_router,
    digital_twin_router,
    prediction_router,
    workflow_router,
]


def register(app):
    """Include every governance router into the FastAPI app."""
    for r in ALL_ROUTERS:
        app.include_router(r)

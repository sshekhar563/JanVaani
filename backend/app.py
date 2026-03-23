"""
Extended App Launcher — re-exports the FastAPI app from main.py.

Governance routers are now directly registered inside main.py at module level,
so this file simply provides an alternate entry point.

Start with:
    uvicorn app:app --reload --port 8000
  OR
    uvicorn main:app --reload --port 8000
"""

from main import app  # noqa: F401 — re-export for uvicorn

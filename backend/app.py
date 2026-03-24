"""
Extended App Launcher — re-exports the FastAPI app from main.py.

Governance routers are now directly registered inside main.py at module level,
so this file simply provides an alternate entry point.

Start with:
    uvicorn app:app --reload --port 8000
  OR
    uvicorn main:app --reload --port 8000
"""

import os
import sys

# Add the 'backend' directory to sys.path so internal imports resolve correctly
# when the application is launched from the project root.
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from main import app  # noqa: F401 — re-export for uvicorn

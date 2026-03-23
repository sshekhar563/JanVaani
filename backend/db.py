"""
Shared database access for new modules.

New routers import `get_db()` from here instead of reaching into main.py globals.
The database handle is set once during app startup via `set_db()`.
"""

from motor.motor_asyncio import AsyncIOMotorDatabase

_db: AsyncIOMotorDatabase | None = None


def set_db(database: AsyncIOMotorDatabase):
    global _db
    _db = database


def get_db() -> AsyncIOMotorDatabase | None:
    return _db

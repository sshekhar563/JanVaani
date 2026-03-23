"""
RBAC helpers for governance routes.

Imports `require_current_user` from main.py and provides role-checking
dependency factories that governance routes can use.
"""

from fastapi import Depends, HTTPException, status


def _get_require_current_user():
    """Late import to avoid circular dependency."""
    from main import require_current_user
    return require_current_user


async def require_admin(current_user: dict = Depends(_get_require_current_user())):
    """Only admin users can access this endpoint."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def require_department(current_user: dict = Depends(_get_require_current_user())):
    """Only department (officer) users can access this endpoint."""
    if current_user.get("role") not in ("admin", "department"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Officer or admin access required",
        )
    return current_user


async def require_authenticated(current_user: dict = Depends(_get_require_current_user())):
    """Any authenticated user can access."""
    return current_user

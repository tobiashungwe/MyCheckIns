# auth.py
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

API_KEY_NAME = "X-API-Key"
API_KEY_HEADER = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key():
    """Read the key from env at startup (or .env)."""
    key = os.getenv("BLOG_API_KEY")
    if not key:
        raise RuntimeError("BLOG_API_KEY env var is not set")
    return key

EXPECTED_KEY = get_api_key()

def require_api_key(api_key: str | None = Depends(API_KEY_HEADER)):
    if api_key != EXPECTED_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )

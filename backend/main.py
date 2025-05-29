from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from infrastructure.adapters.http.endpoints import router
from infrastructure.persistence.database import create_tables
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = BASE_DIR / "media" 
MEDIA_DIR.mkdir(exist_ok=True)

create_tables()

app = FastAPI(title="Blog API")

app.include_router(router, prefix="/api")
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")


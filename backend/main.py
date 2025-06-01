from infrastructure.adapters.http.endpoints import router
from infrastructure.persistence.database import create_tables
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from settings import MEDIA_DIR  


create_tables()

app = FastAPI(title="Blog API")

app.include_router(router, prefix="/api")
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")


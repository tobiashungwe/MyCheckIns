from fastapi import FastAPI
from infrastructure.adapters.http.endpoints import router
from infrastructure.persistence.database import create_tables



create_tables()

app = FastAPI(title="Blog API")

app.include_router(router, prefix="/api")


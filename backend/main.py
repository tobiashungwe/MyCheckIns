from fastapi import FastAPI
from infrastructure.adapters.http.endpoints import router as http_router
from infrastructure.persistence.database import engine, Base


Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include HTTP endpoints under the /api prefix
app.include_router(http_router, prefix="/api")

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from domain.models import VisitCreate, Visit, VisitRequirement, VisitRequirementCreate
from infrastructure.persistence.database import SessionLocal, DBVisit, DBVisitRequirement

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/visits/", response_model=Visit)
def create_visit(visit: VisitCreate, db: Session = Depends(get_db)):
    db_visit = DBVisit(**visit.dict())
    db.add(db_visit)
    db.commit()
    db.refresh(db_visit)
    return db_visit

@router.post("/visits/{visit_id}/requirements", response_model=VisitRequirement)
def add_requirements(visit_id: int, requirement: VisitRequirementCreate, db: Session = Depends(get_db)):
    db_requirement = DBVisitRequirement(**requirement.dict())
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    return db_requirement

@router.get("/visits/", response_model=list[Visit])
def get_visits(db: Session = Depends(get_db)):
    return db.query(DBVisit).all()

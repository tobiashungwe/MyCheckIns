from datetime import date
from pydantic import BaseModel
from typing import Optional

class VisitBase(BaseModel):
    visitor_name: str
    start_date: date
    end_date: date
    notes: Optional[str] = None

class VisitCreate(VisitBase):
    pass

class Visit(VisitBase):
    id: int
    class Config:
        orm_mode = True

class VisitRequirementBase(BaseModel):
    visit_id: int
    meal_request: Optional[str] = None
    special_notes: Optional[str] = None

class VisitRequirementCreate(VisitRequirementBase):
    pass

class VisitRequirement(VisitRequirementBase):
    id: int
    class Config:
        orm_mode = True
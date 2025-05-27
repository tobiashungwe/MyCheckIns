from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class DBVisit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True, index=True)
    visitor_name = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    notes = Column(String(500), nullable=True)

class DBVisitRequirement(Base):
    __tablename__ = "visit_requirements"
    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, ForeignKey('visits.id'))
    meal_request = Column(String(200), nullable=True)
    special_notes = Column(String(500), nullable=True)

DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/main_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)
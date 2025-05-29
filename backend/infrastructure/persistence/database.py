# database.py
from datetime import date
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    Text,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# ─────────────── NEW ───────────────
class DBPost(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250), nullable=False)
    publish_date = Column(Date, default=date.today, nullable=False)
    body_md = Column(Text, nullable=False)          # raw Markdown
# ────────────────────────────────────

# (keep your old Visit tables here or remove if unused)

DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/main_db"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

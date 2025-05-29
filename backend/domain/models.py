# models.py
from datetime import date
from pydantic import BaseModel, Field

# ───────────── Posts ─────────────
class PostBase(BaseModel):
    title: str = Field(..., max_length=250)
    publish_date: date | None = None                # optional → defaults today

class PostCreate(PostBase):
    pass                                            # body comes from upload file

class PostUpdate(PostBase):
    body_md: str                                    # full Markdown in body

class Post(PostBase):
    id: int
    body_md: str
    class Config:
        orm_mode = True

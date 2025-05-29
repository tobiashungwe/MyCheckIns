from datetime import date
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    Request
)
from sqlalchemy.orm import Session
from domain.models import Post, PostCreate, PostUpdate
from infrastructure.persistence.database import SessionLocal, DBPost
from infrastructure.auth.auth import require_api_key
import os, uuid
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = BASE_DIR / "media"  

router = APIRouter()

# ───────── helper ─────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ───────── CRUD ─────────
@router.post(
    "/posts/",
    response_model=Post,
    status_code=201,
    dependencies=[Depends(require_api_key)],
)
async def create_post(
    meta: PostCreate = Depends(),                   # title & optional date
    md_file: UploadFile = File(...),               # Markdown upload
    db: Session = Depends(get_db),
):
    md_text = (await md_file.read()).decode()
    db_post = DBPost(
        title=meta.title,
        publish_date=meta.publish_date or date.today(),
        body_md=md_text,
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.get("/posts/", response_model=list[Post])
def list_posts(db: Session = Depends(get_db)):
    return db.query(DBPost).order_by(DBPost.publish_date.desc()).all()


@router.get("/posts/{post_id}", response_model=Post)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(DBPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    return post


@router.put(
    "/posts/{post_id}",
    response_model=Post,
    dependencies=[Depends(require_api_key)],
)
def update_post(
    post_id: int,
    patch: PostUpdate,
    db: Session = Depends(get_db),
):
    post = db.get(DBPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    for k, v in patch.dict().items():
        setattr(post, k, v)
    db.commit()
    db.refresh(post)
    return post


@router.delete(
    "/posts/{post_id}",
    status_code=204,
    dependencies=[Depends(require_api_key)],
)
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(DBPost, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    db.delete(post)
    db.commit()



@router.post(
    "/images/",
    status_code=201,
    dependencies=[Depends(require_api_key)],
)
async def upload_image(
    request: Request,
    file: UploadFile = File(...)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".png", ".jpg", ".jpeg", ".gif", ".webp"}:
        raise HTTPException(400, "Unsupported file type")

    filename = f"{uuid.uuid4().hex}{ext}"
    dest = MEDIA_DIR / filename
    dest.write_bytes(await file.read())

    base = str(request.base_url).rstrip("/")      # http://localhost:8000
    return {"url": f"{base}/media/{filename}"}
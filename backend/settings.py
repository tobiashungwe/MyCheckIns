from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent      # backend/
MEDIA_DIR = PROJECT_ROOT / "media"
MEDIA_DIR.mkdir(exist_ok=True)

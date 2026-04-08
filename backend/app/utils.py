import io
import uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

ALLOWED_IMAGE_FORMATS = frozenset({"JPEG", "PNG", "GIF", "WEBP", "BMP"})


def validate_image_upload(file: UploadFile) -> None:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser una imagen (Content-Type image/*).",
        )


def validate_image_bytes(data: bytes) -> None:
    if not data:
        raise HTTPException(status_code=400, detail="Archivo vacío.")
    try:
        with Image.open(io.BytesIO(data)) as im:
            im.load()
            fmt = im.format
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(
            status_code=400,
            detail="No es una imagen válida o está corrupta.",
        ) from exc
    if fmt not in ALLOWED_IMAGE_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Formato no permitido: {fmt}. Use JPEG, PNG, GIF, WebP o BMP.",
        )


def extension_from_upload(filename: str, data: bytes) -> str:
    suffix = Path(filename or "").suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}:
        return suffix
    try:
        with Image.open(io.BytesIO(data)) as im:
            fmt = (im.format or "").upper()
    except (UnidentifiedImageError, OSError):
        return ".jpg"
    mapping = {
        "JPEG": ".jpg",
        "PNG": ".png",
        "GIF": ".gif",
        "WEBP": ".webp",
        "BMP": ".bmp",
    }
    return mapping.get(fmt, ".jpg")


def save_upload(data: bytes, uploads_dir: Path, original_name: str) -> Path:
    uploads_dir.mkdir(parents=True, exist_ok=True)
    ext = extension_from_upload(original_name, data)
    name = f"{uuid.uuid4().hex}{ext}"
    path = uploads_dir / name
    path.write_bytes(data)
    return path

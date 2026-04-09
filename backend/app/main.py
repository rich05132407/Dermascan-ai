from __future__ import annotations

import os

# Render (y otros PaaS) suelen tener FS de solo lectura en $HOME.
# Ultralytics intenta escribir configuración/caché; forzamos un dir escribible.
os.environ["YOLO_CONFIG_DIR"] = "/tmp/Ultralytics"

import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.clinical_policy import build_predict_response
from app.predictor import SkinLesionPredictor
from app.schemas import PredictResponse
from app.utils import save_upload, validate_image_bytes, validate_image_upload

logger = logging.getLogger("app")

BACKEND_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BACKEND_DIR / "uploads"
RESULTS_DIR = BACKEND_DIR / "results"

# StaticFiles exige que el directorio exista en el momento del mount (import-time),
# no en lifespan. Creamos las carpetas aquí para evitar el RuntimeError en Render.
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

predictor: Optional[SkinLesionPredictor] = None


def resolve_model_path() -> Path:
    """
    Resuelve la ruta del modelo de forma robusta para entornos tipo Render:
    - Permite override con $MODEL_PATH
    - Intenta localizar ../model o ./model según dónde esté el "root directory"
    - Si hay múltiples .pt, prioriza best.pt
    """
    env_path = os.getenv("MODEL_PATH")
    if env_path:
        return Path(env_path).expanduser().resolve()

    # En local normalmente: repo_root/backend/app/main.py  => BACKEND_DIR = repo_root/backend
    # En Render con root_directory=backend, el "repo root" efectivo puede ser BACKEND_DIR.
    repo_root_candidates = [BACKEND_DIR.parent, BACKEND_DIR]

    model_dirs = []
    for repo_root in repo_root_candidates:
        model_dirs.append(repo_root / "model")
        model_dirs.append(repo_root.parent / "model")

    # de-dup conservando orden
    seen = set()
    unique_model_dirs = []
    for d in model_dirs:
        rp = str(d)
        if rp not in seen:
            unique_model_dirs.append(d)
            seen.add(rp)

    best_candidates = [d / "best.pt" for d in unique_model_dirs]
    for p in best_candidates:
        if p.is_file():
            return p.resolve()

    for d in unique_model_dirs:
        if d.is_dir():
            pts = sorted(d.glob("*.pt"))
            if pts:
                return pts[0].resolve()

    # Ruta “esperada” por defecto (aunque no exista), útil para logs.
    return (BACKEND_DIR.parent / "model" / "best.pt").resolve()


@asynccontextmanager
async def lifespan(app: FastAPI):
    global predictor
    model_path = resolve_model_path()
    logger.info("YOLO_CONFIG_DIR=%s", os.environ.get("YOLO_CONFIG_DIR"))
    logger.info("Ruta modelo resuelta: %s", model_path)
    logger.info("¿Existe el archivo del modelo?: %s", model_path.is_file())

    try:
        predictor = SkinLesionPredictor(model_path)
        predictor.load()
        logger.info("Modelo cargado correctamente.")
    except Exception:
        # No rompemos el arranque: Render debe poder levantar el servidor.
        # El endpoint /predict devolverá 503 hasta que el modelo esté disponible.
        logger.exception("Fallo cargando el modelo en startup (traceback completo).")
        predictor = None

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    yield
    predictor = None


app = FastAPI(title="Detección lesiones piel", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/results",
    StaticFiles(directory=str(RESULTS_DIR)),
    name="results",
)


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)) -> PredictResponse:
    if predictor is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible.")

    validate_image_upload(file)
    data = await file.read()
    validate_image_bytes(data)

    upload_path = save_upload(data, UPLOADS_DIR, file.filename or "")

    try:
        detections, primary, out_name = predictor.predict_and_save_annotated(
            upload_path,
            RESULTS_DIR,
        )
    except Exception as exc:
        # Mensaje genérico al cliente; el detalle técnico no debe exponerse en producción/demo.
        raise HTTPException(
            status_code=500,
            detail="No se pudo completar la evaluación de la imagen. Comprueba que sea una imagen válida e inténtalo de nuevo.",
        ) from exc

    rel = f"results/{out_name}"
    return build_predict_response(
        detections=detections,
        primary=primary,
        result_image_rel=rel,
    )

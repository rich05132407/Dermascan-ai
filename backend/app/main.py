from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.predictor import SkinLesionPredictor
from app.schemas import PredictResponse
from app.utils import save_upload, validate_image_bytes, validate_image_upload

BACKEND_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BACKEND_DIR.parent / "model" / "best.pt"
UPLOADS_DIR = BACKEND_DIR / "uploads"
RESULTS_DIR = BACKEND_DIR / "results"

predictor: Optional[SkinLesionPredictor] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global predictor
    predictor = SkinLesionPredictor(MODEL_PATH)
    predictor.load()
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

    if not detections:
        return PredictResponse(
            has_detections=False,
            message="No se detectaron lesiones en la imagen.",
            primary_class=None,
            primary_confidence=None,
            detections=[],
            result_image=rel,
        )

    return PredictResponse(
        has_detections=True,
        message="Detección completada.",
        primary_class=primary.class_name if primary else None,
        primary_confidence=primary.confidence if primary else None,
        detections=detections,
        result_image=rel,
    )

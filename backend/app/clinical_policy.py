"""
Política conservadora para interpretación de salidas del modelo (sin reentrenamiento).

El umbral puede ajustarse con la variable de entorno MIN_CONFIDENCE_FOR_CONCLUSIVE.
"""

from __future__ import annotations

import os
from typing import List, Optional

from app.schemas import DetectionItem, PredictResponse

# Umbral mínimo de confianza para mostrar una etiqueta clínica orientativa (benigno/maligno).
MIN_CONFIDENCE_FOR_CONCLUSIVE = float(os.getenv("MIN_CONFIDENCE_FOR_CONCLUSIVE", "0.60"))

INCONCLUSIVE_CLASS_NAME = "sin hallazgos concluyentes"
INCONCLUSIVE_MESSAGE = (
    "No se identificaron hallazgos concluyentes con suficiente confianza en esta imagen."
)


def _confidence_level_for_ui(conf: float) -> str:
    """Nivel cualitativo cuando la conclusión es concluyente (conf >= MIN_CONFIDENCE_FOR_CONCLUSIVE)."""
    if conf < 0.7:
        return "medio"
    return "alto"


def build_predict_response(
    *,
    detections: List[DetectionItem],
    primary: Optional[DetectionItem],
    result_image_rel: str,
) -> PredictResponse:
    """
    Separa detecciones crudas (`detections`) de la interpretación final mostrada al usuario.

    - Si no hay cajas del modelo: resultado neutro.
    - Si la mejor confianza < MIN_CONFIDENCE_FOR_CONCLUSIVE: no se muestran benigno/maligno como conclusión.
    - Si la clase sugiere malignidad pero la confianza es baja: se degrada a inconcluso.
    """
    raw_primary_class = primary.class_name if primary else None
    raw_primary_confidence = primary.confidence if primary else None

    if not detections or primary is None:
        return PredictResponse(
            has_detections=False,
            message=INCONCLUSIVE_MESSAGE,
            primary_class=INCONCLUSIVE_CLASS_NAME,
            primary_confidence=None,
            confidence_level="bajo",
            detections=list(detections),
            result_image=result_image_rel,
            raw_primary_class=raw_primary_class,
            raw_primary_confidence=raw_primary_confidence,
            interpretation_inconclusive=True,
        )

    conf = float(primary.confidence)
    label = primary.class_name

    # Por debajo del umbral: no se muestra benigno/maligno como conclusión (incluye "maligno" débil).
    if conf < MIN_CONFIDENCE_FOR_CONCLUSIVE:
        return PredictResponse(
            has_detections=True,
            message=INCONCLUSIVE_MESSAGE,
            primary_class=INCONCLUSIVE_CLASS_NAME,
            primary_confidence=None,
            confidence_level="bajo",
            detections=list(detections),
            result_image=result_image_rel,
            raw_primary_class=raw_primary_class,
            raw_primary_confidence=raw_primary_confidence,
            interpretation_inconclusive=True,
        )

    # Conclusión orientativa cuando la confianza alcanza el umbral
    level = _confidence_level_for_ui(conf)
    return PredictResponse(
        has_detections=True,
        message="Detección completada.",
        primary_class=label,
        primary_confidence=conf,
        confidence_level=level,
        detections=list(detections),
        result_image=result_image_rel,
        raw_primary_class=raw_primary_class,
        raw_primary_confidence=raw_primary_confidence,
        interpretation_inconclusive=False,
    )

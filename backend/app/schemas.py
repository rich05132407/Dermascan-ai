from typing import List, Optional

from pydantic import BaseModel, Field


class DetectionItem(BaseModel):
    class_id: int
    class_name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    bbox_xyxy: List[float] = Field(
        ...,
        description="Caja [x1, y1, x2, y2] en píxeles.",
        min_length=4,
        max_length=4,
    )


class PredictResponse(BaseModel):
    has_detections: bool
    message: str
    primary_class: Optional[str] = None
    primary_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    confidence_level: Optional[str] = Field(
        None,
        description='Nivel cualitativo de la interpretación final: "bajo", "medio" o "alto".',
    )
    detections: List[DetectionItem]
    result_image: Optional[str] = Field(
        None,
        description="Ruta relativa servida bajo /results/...",
    )
    raw_primary_class: Optional[str] = Field(
        None,
        description="Clase de la mejor detección del modelo antes de aplicar la política conservadora.",
    )
    raw_primary_confidence: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Confianza de la mejor detección cruda antes de la política conservadora.",
    )
    interpretation_inconclusive: bool = Field(
        False,
        description="True si la conclusión mostrada fue degradada por baja confianza (umbral MIN_CONFIDENCE_FOR_CONCLUSIVE).",
    )

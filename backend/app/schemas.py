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
    detections: List[DetectionItem]
    result_image: Optional[str] = Field(
        None,
        description="Ruta relativa servida bajo /results/...",
    )

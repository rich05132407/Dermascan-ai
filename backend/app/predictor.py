import os
import logging
import uuid
from pathlib import Path
from typing import List, Optional, Tuple

import cv2

from app.schemas import DetectionItem

logger = logging.getLogger("app")


class SkinLesionPredictor:
    def __init__(self, weights_path: Path) -> None:
        self._weights = weights_path
        self._model = None

    def load(self) -> None:
        # Lazy import: evita romper el arranque si Ultralytics/PyTorch fallan al importar.
        try:
            from ultralytics import YOLO  # type: ignore
        except Exception:
            logger.exception("Fallo importando Ultralytics (traceback completo).")
            raise

        if not self._weights.is_file():
            raise FileNotFoundError(f"No se encontró el modelo: {self._weights}")

        # Render típicamente no tiene GPU. Forzamos CPU salvo override explícito.
        device = os.getenv("YOLO_DEVICE", "cpu").strip() or "cpu"
        if device.lower() == "cpu":
            os.environ.setdefault("CUDA_VISIBLE_DEVICES", "")

        self._device = device
        self._model = YOLO(str(self._weights))

    @property
    def model(self):
        if self._model is None:
            # Intentamos cargar on-demand para no depender del startup.
            self.load()
        return self._model

    def predict_and_save_annotated(
        self,
        image_path: Path,
        results_dir: Path,
    ) -> Tuple[List[DetectionItem], Optional[DetectionItem], str]:
        """
        Ejecuta inferencia, guarda imagen anotada en results_dir.
        Devuelve (todas las detecciones, principal por confianza, nombre archivo resultado).
        """
        results_dir.mkdir(parents=True, exist_ok=True)
        out_name = f"{uuid.uuid4().hex}_annotated.jpg"
        out_path = results_dir / out_name

        yolo_results = self.model.predict(
            source=str(image_path),
            device=getattr(self, "_device", os.getenv("YOLO_DEVICE", "cpu") or "cpu"),
            verbose=False,
        )
        if not yolo_results:
            self._save_copy_without_boxes(image_path, out_path)
            return [], None, out_name

        r = yolo_results[0]
        detections: List[DetectionItem] = []
        names = r.names or {}

        if r.boxes is not None and len(r.boxes) > 0:
            for b in r.boxes:
                cls_id = int(b.cls[0].item())
                conf = float(b.conf[0].item())
                xyxy = [float(x) for x in b.xyxy[0].tolist()]
                detections.append(
                    DetectionItem(
                        class_id=cls_id,
                        class_name=str(names.get(cls_id, str(cls_id))),
                        confidence=conf,
                        bbox_xyxy=xyxy,
                    )
                )

        annotated = r.plot()
        cv2.imwrite(str(out_path), annotated)

        primary: Optional[DetectionItem] = None
        if detections:
            primary = max(detections, key=lambda d: d.confidence)

        return detections, primary, out_name

    @staticmethod
    def _save_copy_without_boxes(image_path: Path, out_path: Path) -> None:
        img = cv2.imread(str(image_path))
        if img is None:
            raise RuntimeError(f"No se pudo leer la imagen: {image_path}")
        cv2.imwrite(str(out_path), img)

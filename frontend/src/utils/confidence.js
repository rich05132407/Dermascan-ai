/**
 * Normaliza confianza a escala 0–1.
 * Acepta el valor típico del backend en [0, 1] o un porcentaje en [0, 100].
 */
function normalizeToUnitInterval(confidence) {
  if (confidence == null || Number.isNaN(confidence)) return null;
  let p = Number(confidence);
  if (p > 1 && p <= 100) p = p / 100;
  if (Number.isNaN(p)) return null;
  return Math.min(1, Math.max(0, p));
}

/**
 * Convierte la confianza numérica del modelo en un nivel cualitativo (solo presentación UI).
 *
 * Reglas: [0, 0.5) BAJO · [0.5, 0.7) MEDIO · [0.7, 0.85) ALTO · [0.85, 1] MUY ALTO
 *
 * @param {number|null|undefined} confidence - 0–1 o 0–100
 * @returns {"BAJO"|"MEDIO"|"ALTO"|"MUY ALTO"|null}
 */
export function getConfidenceLevel(confidence) {
  const p = normalizeToUnitInterval(confidence);
  if (p === null) return null;
  if (p < 0.5) return "BAJO";
  if (p < 0.7) return "MEDIO";
  if (p < 0.85) return "ALTO";
  return "MUY ALTO";
}

/** Sufijo para clases CSS: `prediction__conf-badge--${key}` */
export function getConfidenceLevelClassKey(confidence) {
  const level = getConfidenceLevel(confidence);
  if (!level) return null;
  return level === "MUY ALTO" ? "muy-alto" : level.toLowerCase();
}

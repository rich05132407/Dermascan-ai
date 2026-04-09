import { getConfidenceLevel, getConfidenceLevelClassKey } from "../utils/confidence.js";
import "./PredictionResult.css";

/** Debe coincidir con la política conservadora del backend (`clinical_policy`). */
const INCONCLUSIVE_PRIMARY_CLASS = "sin hallazgos concluyentes";

function SampleReviewIcon() {
  return (
    <svg className="prediction__sample-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M3 16l5.5-5.5 3 3L21 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PredictionResult({ loading, error, data, sourceImageUrl, hasPending = false }) {
  if (loading) {
    return (
      <div
        className={`prediction prediction--state ${sourceImageUrl ? "prediction--state--with-sample" : ""}`}
        role="status"
        aria-live="polite"
      >
        {sourceImageUrl && (
          <div className="prediction__state-sample">
            <div className="prediction__state-sample-frame">
              <img src={sourceImageUrl} alt="" className="prediction__state-sample-img" decoding="async" />
              <div className="prediction__state-sample-scrim" aria-hidden="true" />
            </div>
            <p className="prediction__state-sample-caption">Muestra recibida · evaluando…</p>
          </div>
        )}
        <div className="prediction__loader">
          <div className="prediction__loader-ring" aria-hidden="true" />
          <div className="prediction__loader-core" aria-hidden="true" />
        </div>
        <p className="prediction__state-title">Procesando la imagen</p>
        <p className="prediction__state-text">
          Generando un resultado orientativo. Esto puede tardar unos segundos según la conexión y la carga del
          servidor.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prediction prediction--error" role="alert">
        <div className="prediction__error-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
        <div className="prediction__error-body">
          <h3 className="prediction__heading">No fue posible completar el análisis</h3>
          <p className="prediction__error-msg">
            Inténtalo nuevamente en unos segundos o prueba con otra imagen más nítida y bien iluminada.
          </p>
          <p className="prediction__error-hint">
            Si el problema persiste, revisa tu conexión y vuelve a cargar la página.
          </p>
          <details className="prediction__error-details">
            <summary className="prediction__error-summary">Ver detalle técnico</summary>
            <pre className="prediction__error-pre">{String(error)}</pre>
          </details>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="prediction prediction--empty">
        <div className="prediction__empty-visual" aria-hidden="true">
          <div className="prediction__empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11V9a3 3 0 116 0v2M5 11h14v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <p className="prediction__empty-title">{hasPending ? "Listo para analizar" : "Esperando imagen"}</p>
        <p className="prediction__empty-text">
          {hasPending
            ? "Pulsa «Analizar imagen» para generar el resumen. El resultado orientativo aparecerá en esta sección."
            : "Selecciona o captura una imagen arriba. Tras revisar la vista previa, inicia el análisis para ver el resumen aquí."}
        </p>
      </div>
    );
  }

  const inconclusive =
    data.interpretation_inconclusive === true ||
    (typeof data.primary_class === "string" &&
      data.primary_class.trim().toLowerCase() === INCONCLUSIVE_PRIMARY_CLASS);

  let confLevel;
  let confClassKey;
  if (inconclusive) {
    confLevel = "No concluyente";
    confClassKey = "inconclusive";
  } else {
    confLevel = getConfidenceLevel(data.primary_confidence);
    confClassKey = getConfidenceLevelClassKey(data.primary_confidence);
  }

  const hasList = data.detections?.length > 0;
  const hallazgosCount = data.has_detections ? data.detections?.length ?? 0 : 0;

  return (
    <div className="prediction prediction--result">
      <div className="prediction__dashboard-top">
        <div className="prediction__dashboard-title-block">
          <span className="prediction__dashboard-label">Análisis asistido por IA</span>
          <h3 className="prediction__dashboard-title">Resumen del análisis</h3>
        </div>
        <div className="prediction__header-badges">
          <span className={`prediction__chip ${inconclusive ? "prediction__chip--neutral" : "prediction__chip--done"}`}>
            {inconclusive ? "No concluyente" : "Completado"}
          </span>
        </div>
      </div>

      <div className="prediction__dashboard-body prediction__dashboard-body--final">
        <figure className="prediction__sample-card">
          <div className="prediction__sample-card-head">
            <SampleReviewIcon />
            <div>
              <span className="prediction__sample-card-kicker">Muestra evaluada</span>
              <p className="prediction__sample-card-title">Imagen analizada</p>
            </div>
          </div>
          <div className="prediction__sample-card-body">
            {sourceImageUrl ? (
              <div className="prediction__sample-frame">
                <img
                  src={sourceImageUrl}
                  alt="Imagen enviada por el usuario para el análisis asistido"
                  className="prediction__sample-img"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="prediction__sample-fallback" role="img" aria-label="Vista no disponible">
                <span className="prediction__sample-fallback-icon" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="4"
                      y="5"
                      width="16"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      opacity="0.35"
                    />
                    <circle cx="9" cy="10" r="1.5" fill="currentColor" opacity="0.35" />
                    <path
                      d="M4 17l5-5 3 3 4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.35"
                    />
                  </svg>
                </span>
                <span className="prediction__sample-fallback-text">Vista de la muestra no disponible</span>
              </div>
            )}
          </div>
          <figcaption className="prediction__sample-foot">
            <p className="prediction__sample-note">
              La imagen fue evaluada por el sistema y se generó un resultado orientativo con base en el modelo
              entrenado. No constituye diagnóstico.
            </p>
          </figcaption>
        </figure>

        <aside className="prediction__summary" aria-label="Resumen del análisis">
          <div className="prediction__result-card">
            <div className="prediction__status-row">
              <span className="prediction__status-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4M12 3l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <span className="prediction__result-label">Estado del análisis</span>
                <p className="prediction__status-value">{inconclusive ? "Resultado prudente" : "Análisis completado"}</p>
                <p className="prediction__status-sub">
                  {inconclusive
                    ? "No se identificaron hallazgos concluyentes con suficiente confianza en esta imagen."
                    : data.has_detections
                      ? "El sistema identificó hallazgos candidatos en la muestra."
                      : "Sin hallazgos automáticos destacados en esta muestra."}
                </p>
              </div>
            </div>

            <div className="prediction__result-sep" role="presentation" />

            <div className="prediction__result-block">
              <span className="prediction__result-label">Clase detectada</span>
              <p className="prediction__result-class">
                {inconclusive ? "Sin hallazgos concluyentes" : data.primary_class ?? "Sin clase predominante"}
              </p>
            </div>

            <div className="prediction__result-sep" role="presentation" />

            <div className="prediction__result-block">
              <span className="prediction__result-label">Nivel de confianza</span>
              <div className="prediction__result-badge-wrap">
                {confLevel && confClassKey ? (
                  <>
                    <span className={`prediction__conf-badge prediction__conf-badge--${confClassKey}`}>
                      {confLevel}
                    </span>
                    <p className="prediction__conf-hint">
                      {inconclusive
                        ? "Este resultado no sustituye una valoración clínica."
                        : "Clasificación orientativa basada en el modelo"}
                    </p>
                  </>
                ) : (
                  <span className="prediction__conf-badge prediction__conf-badge--na">No disponible</span>
                )}
              </div>
            </div>

            <div className="prediction__result-sep" role="presentation" />

            <div className="prediction__result-block prediction__result-block--inline prediction__result-block--hallazgos">
              <span className="prediction__result-label">Hallazgos señalados</span>
              <p className="prediction__result-count" aria-live="polite">
                {hallazgosCount === 0 ? "Ninguno" : hallazgosCount === 1 ? "1 región" : `${hallazgosCount} regiones`}
              </p>
            </div>

            <div className="prediction__result-sep" role="presentation" />

            <div className="prediction__result-block prediction__result-block--note">
              <span className="prediction__result-label">{inconclusive ? "Interpretación" : "Resultado orientativo"}</span>
              <p className="prediction__result-note">
                {inconclusive
                  ? "No se identificaron hallazgos concluyentes con suficiente confianza en esta imagen. Este resultado no sustituye una valoración clínica."
                  : data.message}
              </p>
              {inconclusive && (
                <p className="prediction__result-note prediction__result-note--recommend">
                  Si existe una lesión visible, cambios recientes o preocupación clínica, se recomienda revisión profesional.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {hasList && (
        <details className="prediction__details">
          <summary className="prediction__details-summary">Ver detalles técnicos</summary>
          <div className="prediction__details-body">
            <p className="prediction__details-intro">
              Listado de salida del modelo (referencia académica). No sustituye valoración clínica.
              {inconclusive && data.raw_primary_class != null && (
                <>
                  {" "}
                  Interpretación mostrada arriba es prudente; la mejor detección cruda fue{" "}
                  <strong>{data.raw_primary_class}</strong>
                  {data.raw_primary_confidence != null && (
                    <>
                      {" "}
                      (conf. modelo {Math.round(Number(data.raw_primary_confidence) * 1000) / 10}
                      %).
                    </>
                  )}
                </>
              )}
            </p>
            <div className="prediction__table-scroll">
              <table className="prediction__table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Clase</th>
                    <th scope="col">Nivel de confianza</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detections.map((d, i) => {
                    const rowLevel = getConfidenceLevel(d.confidence);
                    const rowKey = getConfidenceLevelClassKey(d.confidence);
                    return (
                      <tr key={`${d.class_id}-${i}`}>
                        <td>{i + 1}</td>
                        <td>{d.class_name}</td>
                        <td>
                          {rowLevel && rowKey ? (
                            <span
                              className={`prediction__conf-badge prediction__conf-badge--compact prediction__conf-badge--${rowKey}`}
                            >
                              {rowLevel}
                            </span>
                          ) : (
                            <span className="prediction__conf-na-inline">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

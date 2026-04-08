import "./MedicalDisclaimer.css";

export function MedicalDisclaimer() {
  return (
    <aside className="disclaimer" aria-labelledby="disclaimer-title">
      <div className="disclaimer__inner">
        <div className="disclaimer__card">
          <div className="disclaimer__icon-wrap" aria-hidden="true">
            <svg className="disclaimer__icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <h2 id="disclaimer-title" className="disclaimer__title">
            Aviso médico importante
          </h2>
          <p className="disclaimer__intro">
            Lea este apartado antes de interpretar cualquier resultado en pantalla.
          </p>
          <ul className="disclaimer__list">
            <li>Esta herramienta no sustituye una consulta médica ni una exploración presencial.</li>
            <li>No reemplaza el diagnóstico ni el tratamiento indicado por un dermatólogo u otro especialista.</li>
            <li>Ante cualquier lesión nueva, cambiante o sospechosa, acuda a un profesional de la salud.</li>
            <li>Los resultados mostrados son orientativos y de apoyo; pueden contener errores.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

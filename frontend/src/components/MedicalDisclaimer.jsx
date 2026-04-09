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
            Aviso clínico y uso responsable
          </h2>
          <p className="disclaimer__intro">
            La información mostrada es orientativa. Interprete el resultado en contexto y priorice la valoración
            clínica.
          </p>
          <div className="disclaimer__chips" aria-label="Puntos clave">
            <span className="disclaimer__chip">No es diagnóstico</span>
            <span className="disclaimer__chip">Depende de la imagen</span>
            <span className="disclaimer__chip">Puede fallar</span>
          </div>
          <ul className="disclaimer__list">
            <li>Esta herramienta no sustituye una consulta médica ni una exploración presencial.</li>
            <li>No reemplaza el diagnóstico, seguimiento o tratamiento indicado por un dermatólogo u otro especialista.</li>
            <li>La calidad de la imagen (luz, enfoque, distancia y encuadre) influye de forma importante en el resultado.</li>
            <li>Si existe una lesión visible, cambios recientes o preocupación clínica, se recomienda revisión profesional.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

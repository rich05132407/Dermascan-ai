import "./InfoSection.css";

export function InfoSection() {
  return (
    <section id="informacion" className="info" aria-labelledby="info-title">
      <div className="info__inner">
        <header className="info__header">
          <span className="info__eyebrow">Contexto clínico</span>
          <h2 id="info-title" className="info__title">
            Información de apoyo (cáncer de piel)
          </h2>
          <p className="info__lead">
            Este contenido es informativo y busca dar contexto. La evaluación clínica debe realizarla un profesional
            sanitario.
          </p>
        </header>
        <div className="info__grid">
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              01
            </span>
            <h3 className="info__card-title">¿Qué es el cáncer de piel?</h3>
            <p>
              Es un crecimiento anormal de células de la piel. Incluye, entre otros, melanoma y carcinomas
              (basocelular y espinocelular). El riesgo se relaciona con exposición a radiación UV y factores individuales.
            </p>
          </article>
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              02
            </span>
            <h3 className="info__card-title">¿Por qué es importante detectarlo a tiempo?</h3>
            <p>
              La detección precoz suele mejorar el pronóstico y ampliar opciones terapéuticas. Observar cambios en
              lunares o lesiones y consultar a tiempo puede ser clave.
            </p>
          </article>
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              03
            </span>
            <h3 className="info__card-title">Signos de alerta generales</h3>
            <ul className="info__list">
              <li>Cambios de tamaño, forma o color en un lunar o lesión.</li>
              <li>Asimetría, bordes irregulares o varios tonos en la misma lesión.</li>
              <li>Sangrado, costras persistentes, dolor o picor que no cede.</li>
              <li>Herida que no cicatriza en semanas.</li>
            </ul>
          </article>
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              04
            </span>
            <h3 className="info__card-title">Limitaciones de esta herramienta</h3>
            <ul className="info__list">
              <li>El resultado es orientativo: puede haber falsos positivos y falsos negativos.</li>
              <li>Depende de la calidad de la imagen (luz, enfoque, distancia y encuadre).</li>
              <li>El modelo aprende de datos de entrenamiento: no cubre todos los escenarios clínicos.</li>
            </ul>
          </article>
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              05
            </span>
            <h3 className="info__card-title">¿Cuándo buscar valoración profesional?</h3>
            <p>
              Si notas una lesión nueva, cambios recientes, sangrado, dolor, o si tienes preocupación clínica, lo más
              prudente es una revisión con un dermatólogo u otro profesional sanitario.
            </p>
          </article>
          <article className="info__card info__card--tool">
            <span className="info__num" aria-hidden="true">
              06
            </span>
            <h3 className="info__card-title">Qué hace DermaScan AI</h3>
            <p>
              DermaScan AI envía tu imagen a un modelo YOLOv8 entrenado que intenta localizar y
              clasificar lesiones de interés. Es un apoyo tecnológico para visualizar hallazgos
              automáticos, no un sustituto del criterio clínico.
            </p>
          </article>
        </div>
        <div className="info__note" role="note" aria-label="Aviso">
          <strong>Importante:</strong> DermaScan AI es una herramienta de apoyo educativo. No constituye diagnóstico,
          no reemplaza exploración presencial y no debe usarse como única base para decisiones clínicas.
        </div>
      </div>
    </section>
  );
}

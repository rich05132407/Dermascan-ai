import "./InfoSection.css";

export function InfoSection() {
  return (
    <section id="informacion" className="info" aria-labelledby="info-title">
      <div className="info__inner">
        <header className="info__header">
          <span className="info__eyebrow">Contexto clínico</span>
          <h2 id="info-title" className="info__title">
            Cáncer de piel e información
          </h2>
          <p className="info__lead">
            Comprender el marco ayuda a interpretar mejor lo que hace esta herramienta tecnológica.
          </p>
        </header>
        <div className="info__grid">
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              01
            </span>
            <h3 className="info__card-title">Qué es</h3>
            <p>
              El cáncer de piel es el crecimiento anormal de células en la epidermis, a menudo
              relacionado con la exposición solar y otros factores. Incluye melanoma y carcinomas
              no melanoma, entre otros.
            </p>
          </article>
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              02
            </span>
            <h3 className="info__card-title">Por qué importa detectarlo</h3>
            <p>
              La detección temprana mejora las opciones de tratamiento y el pronóstico. Observar
              cambios en lunares o lesiones y consultar a tiempo con un especialista es
              fundamental.
            </p>
          </article>
          <article className="info__card">
            <span className="info__num" aria-hidden="true">
              03
            </span>
            <h3 className="info__card-title">Qué hace esta herramienta</h3>
            <p>
              DermaScan AI envía tu imagen a un modelo YOLOv8 entrenado que intenta localizar y
              clasificar lesiones de interés. Es un apoyo tecnológico para visualizar hallazgos
              automáticos, no un sustituto del criterio clínico.
            </p>
          </article>
        </div>
        <p className="info__note">
          Esta aplicación es solo apoyo y educación; no constituye diagnóstico médico ni sustituye
          la valoración de un profesional sanitario.
        </p>
      </div>
    </section>
  );
}

import "./HeroSection.css";

export function HeroSection({ onCtaClick }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__grid" />
      </div>
      <div className="hero__content">
        <div className="hero__inner">
          <p className="hero__badge">
            <span className="hero__badge-dot" />
            Apoyo clínico · visión por computador
          </p>
          <h1 id="hero-title" className="hero__title">
            DermaScan AI
          </h1>
          <p className="hero__subtitle">
            Detección asistida de lesiones cutáneas con inteligencia artificial
          </p>
          <p className="hero__text">
            Sube una imagen o usa la cámara para obtener un análisis orientativo. La herramienta
            resalta regiones de interés y estima la clase más probable según el modelo entrenado —
            pensada como apoyo, no como diagnóstico.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={onCtaClick}>
              Iniciar análisis
            </button>
            <a href="#informacion" className="btn btn--ghost">
              Conocer el contexto
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card">
            <div className="hero__card-header">
              <span className="hero__card-pill">Inferencia en tiempo real</span>
            </div>
            <div className="hero__card-body">
              <span className="hero__card-label">Confianza estimada</span>
              <div className="hero__card-bars">
                <span />
                <span />
                <span />
              </div>
              <div className="hero__card-footer">
                <span className="hero__card-tag">YOLOv8</span>
                <span className="hero__card-tag hero__card-tag--muted">Bounding boxes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import "./ContactSection.css";

const DEFAULT_EMAIL = "contacto@dermascan-ai.local";

export function ContactSection() {
  const email = import.meta.env.VITE_CONTACT_EMAIL || DEFAULT_EMAIL;

  return (
    <section id="contacto" className="contact" aria-labelledby="contact-title">
      <div className="contact__inner">
        <h2 id="contact-title" className="contact__title">
          Contacto
        </h2>
        <p className="contact__project">DermaScan AI</p>
        <p className="contact__desc">Canal de consulta para el proyecto académico o demo.</p>
        <a href={`mailto:${email}`} className="contact__card">
          <span className="contact__card-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16v12H4V6zm0 0l8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="contact__card-text">{email}</span>
        </a>
      </div>
    </section>
  );
}

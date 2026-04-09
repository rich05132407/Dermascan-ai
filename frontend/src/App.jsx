import { useCallback, useRef } from "react";
import { HeroSection } from "./components/HeroSection.jsx";
import { UploadImage } from "./components/UploadImage.jsx";
import { CameraCapture } from "./components/CameraCapture.jsx";
import { PredictionResult } from "./components/PredictionResult.jsx";
import { InfoSection } from "./components/InfoSection.jsx";
import { MedicalDisclaimer } from "./components/MedicalDisclaimer.jsx";
import { ContactSection } from "./components/ContactSection.jsx";
import { usePrediction } from "./hooks/usePrediction.js";
import { useIsMobileLayout } from "./hooks/useIsMobileLayout.js";
import "./App.css";

export default function App() {
  const detectionRef = useRef(null);
  const isMobileLayout = useIsMobileLayout();
  const {
    data,
    loading,
    error,
    sourceImageUrl,
    pendingPreviewUrl,
    canAnalyze,
    hasPending,
    selectImage,
    analyzeSelected,
    clearStagedImage,
  } = usePrediction();

  const scrollToDetection = useCallback(() => {
    detectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__inner">
          <span className="site-header__brand">
            <span className="site-header__brand-mark" aria-hidden="true" />
            DermaScan AI
          </span>
          <nav className="site-header__nav" aria-label="Principal">
            <a href="#deteccion">Análisis</a>
            <a href="#informacion">Información</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection onCtaClick={scrollToDetection} />

        <section
          id="deteccion"
          ref={detectionRef}
          className="detection"
          aria-labelledby="detection-title"
        >
          <div className="detection__inner">
            <span className="detection__eyebrow">Análisis asistido</span>
            <h2 id="detection-title" className="detection__title">
              Evaluación por imagen
            </h2>
            <p className="detection__intro">
              Selecciona una imagen clara, revisa la vista previa y pulsa <strong>Analizar imagen</strong> para
              obtener un resultado orientativo. Esta herramienta no sustituye la valoración clínica ni el diagnóstico
              médico.
            </p>

            <div className={`detection__grid ${isMobileLayout ? "detection__grid--mobile" : ""}`}>
              <UploadImage
                onFileChosen={selectImage}
                onAnalyze={analyzeSelected}
                onClearStaged={clearStagedImage}
                pendingPreviewUrl={pendingPreviewUrl}
                canAnalyze={canAnalyze}
                loading={loading}
                disabled={loading}
                mobileMode={isMobileLayout}
              />
              {!isMobileLayout && (
                <CameraCapture onCapture={selectImage} disabled={loading} />
              )}
            </div>

            <PredictionResult
              loading={loading}
              error={error}
              data={data}
              sourceImageUrl={sourceImageUrl}
              hasPending={hasPending}
            />
          </div>
        </section>

        <InfoSection />
        <MedicalDisclaimer />
        <ContactSection />
      </main>

      <footer className="site-footer">
        <p>DermaScan AI · Herramienta de apoyo · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import "./CameraCapture.css";

export function CameraCapture({ onCapture, disabled }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);

  const stopCamera = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  async function startCamera() {
    setError(null);
    stopCamera();
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tu navegador no permite acceso a la cámara desde aquí.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (e) {
      const msg =
        e?.name === "NotAllowedError"
          ? "Permiso denegado. Permite el acceso a la cámara en la barra del navegador."
          : "No se pudo acceder a la cámara.";
      setError(msg);
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "captura.jpg", { type: "image/jpeg" });
        onCapture(file);
      },
      "image/jpeg",
      0.92
    );
  }

  return (
    <div className={`camera ${disabled ? "camera--disabled" : ""}`}>
      <div className="camera__head">
        <span className="camera__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 7h2l1.5-2h7L16 7h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        </span>
        <div>
          <h3 className="camera__title">Cámara en vivo</h3>
          <p className="camera__hint">Captura desde el navegador; la vista previa y el análisis se gestionan en el panel izquierdo.</p>
        </div>
      </div>

      <div className={`camera__frame ${active ? "camera__frame--live" : ""}`}>
        <div className="camera__corners" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="camera__preview-wrap">
          <video
            ref={videoRef}
            className="camera__video"
            playsInline
            muted
            aria-label="Vista previa de la cámara"
          />
          {!active && (
            <div className="camera__placeholder">
              <span className="camera__placeholder-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h2l1.5-2h7L16 7h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    opacity="0.35"
                  />
                  <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                </svg>
              </span>
              <span>Vista previa</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="camera__error" role="alert">
          {error}
        </p>
      )}

      <div className="camera__actions">
        {!active ? (
          <button
            type="button"
            className="camera__btn camera__btn--primary"
            onClick={startCamera}
            disabled={disabled}
          >
            Activar cámara
          </button>
        ) : (
          <>
            <button
              type="button"
              className="camera__btn camera__btn--primary"
              onClick={takePhoto}
              disabled={disabled}
            >
              Capturar foto
            </button>
            <button
              type="button"
              className="camera__btn camera__btn--secondary"
              onClick={stopCamera}
              disabled={disabled}
            >
              Detener
            </button>
          </>
        )}
      </div>
    </div>
  );
}

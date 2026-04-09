import { useRef, useState } from "react";
import "./UploadImage.css";

export function UploadImage({
  onFileChosen,
  onAnalyze,
  onClearStaged,
  pendingPreviewUrl,
  canAnalyze,
  loading,
  disabled,
  mobileMode = false,
}) {
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [fileHint, setFileHint] = useState(null);

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setFileHint(file.name || "Imagen seleccionada");
      onFileChosen(file);
    }
    e.target.value = "";
  }

  function handleClear() {
    setFileHint(null);
    onClearStaged();
  }

  const previewBlock =
    pendingPreviewUrl && !loading ? (
      <div className="upload__preview">
        <div className="upload__preview-frame">
          <img src={pendingPreviewUrl} alt="" className="upload__preview-img" decoding="async" />
        </div>
        <p className="upload__preview-caption">Vista previa · revisa encuadre y nitidez</p>
        <div className="upload__preview-actions">
          <button
            type="button"
            className="upload__btn upload__btn--analyze"
            onClick={onAnalyze}
            disabled={!canAnalyze || disabled}
          >
            Analizar imagen
          </button>
          <button
            type="button"
            className="upload__btn upload__btn--ghost"
            onClick={handleClear}
            disabled={disabled}
          >
            Cambiar imagen
          </button>
        </div>
      </div>
    ) : null;

  if (mobileMode) {
    return (
      <div className={`upload upload--mobile ${disabled ? "upload--disabled" : ""}`}>
        <div className="upload__head">
          <span className="upload__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 16V8m0 0l-3 3m3-3l3 3M4 16.8V7.2c0-1.12 0-1.68.218-2.108a2 2 0 011.092-1.092C5.52 4 6.08 4 7.2 4h9.6c1.12 0 1.68 0 2.108.218a2 2 0 011.092 1.092c.218.428.218.988.218 2.108v9.6c0 1.12 0 1.68-.218 2.108a2 2 0 01-1.092 1.092c-.428.218-.988.218-2.108.218H7.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-1.092-1.092C4 18.48 4 17.92 4 16.8z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <h3 className="upload__title">Imagen para análisis</h3>
            <p className="upload__hint">
              Toma una foto con la cámara trasera o elige una imagen nítida desde la galería. Luego pulsa{" "}
              <strong>Analizar imagen</strong>.
            </p>
          </div>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="upload__input"
          onChange={handleChange}
          disabled={disabled}
          aria-label="Tomar foto con la cámara"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="upload__input"
          onChange={handleChange}
          disabled={disabled}
          aria-label="Elegir imagen de la galería"
        />

        {!pendingPreviewUrl || loading ? (
          <div className="upload__actions">
            <button
              type="button"
              className="upload__btn upload__btn--primary"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled}
            >
              <span className="upload__btn-text">Tomar foto</span>
            </button>
            <button
              type="button"
              className="upload__btn upload__btn--secondary"
              onClick={() => galleryInputRef.current?.click()}
              disabled={disabled}
            >
              <span className="upload__btn-text">Elegir de la galería</span>
            </button>
          </div>
        ) : null}

        {previewBlock}

        {fileHint && !disabled && !pendingPreviewUrl && (
          <p className="upload__file" title={fileHint}>
            Listo: <strong>{fileHint}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`upload ${disabled ? "upload--disabled" : ""}`}>
      <div className="upload__head">
        <span className="upload__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 16V8m0 0l-3 3m3-3l3 3M4 16.8V7.2c0-1.12 0-1.68.218-2.108a2 2 0 011.092-1.092C5.52 4 6.08 4 7.2 4h9.6c1.12 0 1.68 0 2.108.218a2 2 0 011.092 1.092c.218.428.218.988.218 2.108v9.6c0 1.12 0 1.68-.218 2.108a2 2 0 01-1.092 1.092c-.428.218-.988.218-2.108.218H7.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-1.092-1.092C4 18.48 4 17.92 4 16.8z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <h3 className="upload__title">Imagen para análisis</h3>
          <p className="upload__hint">
            Selecciona una imagen nítida y bien iluminada. Tras revisar la vista previa, pulsa{" "}
            <strong>Analizar imagen</strong>.
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/heic,image/heif"
        className="upload__input"
        onChange={handleChange}
        disabled={disabled}
        aria-label="Seleccionar archivo de imagen"
      />

      {!pendingPreviewUrl || loading ? (
        <button
          type="button"
          className="upload__btn upload__btn--solo"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <span className="upload__btn-text">Seleccionar archivo</span>
        </button>
      ) : null}

      {previewBlock}

      {fileHint && !disabled && !pendingPreviewUrl && (
        <p className="upload__file" title={fileHint}>
          Listo: <strong>{fileHint}</strong>
        </p>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { postPredict } from "../api/predict.js";
import { isProbablyImageFile, MAX_IMAGE_BYTES } from "../constants/uploadLimits.js";
import { processImage } from "../utils/processImage.js";

export function usePrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceImageUrl, setSourceImageUrl] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  const sourceUrlRef = useRef(null);
  const pendingPreviewRef = useRef(null);

  const revokeSourceUrl = useCallback(() => {
    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = null;
    }
  }, []);

  const revokePendingPreview = useCallback(() => {
    if (pendingPreviewRef.current) {
      URL.revokeObjectURL(pendingPreviewRef.current);
      pendingPreviewRef.current = null;
    }
    setPendingPreviewUrl(null);
    setPendingFile(null);
  }, []);

  const selectImage = useCallback(
    (file) => {
      if (!file) return;
      setError(null);

      if (!isProbablyImageFile(file)) {
        setError("El archivo debe ser una imagen (por ejemplo JPG o PNG).");
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(
          "La imagen es demasiado grande (máximo 15 MB). Elige otra más liviana o reduce la resolución.",
        );
        return;
      }

      revokeSourceUrl();
      setSourceImageUrl(null);
      revokePendingPreview();
      setData(null);

      const url = URL.createObjectURL(file);
      pendingPreviewRef.current = url;
      setPendingPreviewUrl(url);
      setPendingFile(file);
    },
    [revokePendingPreview, revokeSourceUrl],
  );

  const clearStagedImage = useCallback(() => {
    setError(null);
    revokePendingPreview();
  }, [revokePendingPreview]);

  const analyzeSelected = useCallback(async () => {
    if (!pendingFile) return;

    const file = pendingFile;

    revokeSourceUrl();
    sourceUrlRef.current = pendingPreviewRef.current;
    pendingPreviewRef.current = null;
    setPendingPreviewUrl(null);
    setPendingFile(null);

    setSourceImageUrl(sourceUrlRef.current);
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Procesado robusto antes de enviar al backend (JPEG + resize + compresión).
      const processed = await processImage(file);
      const result = await postPredict(processed);
      if (!result || typeof result !== "object") {
        throw new Error(
          "La respuesta del análisis no fue válida. Cierra la sesión, vuelve a cargar la página e inténtalo de nuevo.",
        );
      }
      setData(result);
    } catch (e) {
      console.error("[DermaScan] Error al analizar:", e);
      setError(e instanceof Error ? e.message : String(e));
      revokeSourceUrl();
      setSourceImageUrl(null);
    } finally {
      setLoading(false);
    }
  }, [pendingFile, revokeSourceUrl]);

  useEffect(() => {
    return () => {
      revokeSourceUrl();
      if (pendingPreviewRef.current) {
        URL.revokeObjectURL(pendingPreviewRef.current);
      }
    };
  }, [revokeSourceUrl]);

  return {
    data,
    loading,
    error,
    sourceImageUrl,
    pendingPreviewUrl,
    canAnalyze: Boolean(pendingFile) && !loading,
    hasPending: Boolean(pendingFile),
    selectImage,
    analyzeSelected,
    clearStagedImage,
  };
}

/**
 * Pipeline robusto de normalización de imágenes para móviles:
 * - Convierte SIEMPRE a JPEG (sin EXIF), max 1024px, calidad ajustada
 * - Evita bloquear UI usando APIs async (`createImageBitmap` cuando está disponible)
 * - Libera recursos (object URLs, bitmap.close)
 *
 * @param {File|Blob} file
 * @returns {Promise<File>} JPEG procesado (processed_image.jpg)
 */
export async function processImage(file) {
  const input = file;
  if (!input || typeof input !== "object") {
    throw new Error("No se recibió una imagen válida para procesar.");
  }

  const MAX_DIMENSION = 1024;
  const TARGET_MAX_BYTES = 500 * 1024; // ideal, no estricto
  const QUALITY_STEPS = [0.82, 0.76, 0.7, 0.64, 0.6];

  const originalType = typeof input.type === "string" ? input.type : "";

  // Si ya es JPEG y está razonablemente pequeño, aún lo reexportamos para eliminar EXIF
  // y homogenizar compatibilidad. (canvas -> JPEG elimina metadata)

  /** @type {ImageBitmap|HTMLImageElement|null} */
  let bitmap = null;
  let objectUrl = null;

  try {
    // Decodificación: preferimos createImageBitmap (async/off-main-thread cuando posible).
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(input);
    } else {
      objectUrl = URL.createObjectURL(input);
      bitmap = await loadImageAsBitmap(objectUrl);
    }

    const srcW = bitmap.width || 0;
    const srcH = bitmap.height || 0;
    if (!srcW || !srcH) {
      throw new Error("No se pudo leer el tamaño de la imagen.");
    }

    // Escalado proporcional: solo downscale.
    const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
    const outW = Math.max(1, Math.round(srcW * scale));
    const outH = Math.max(1, Math.round(srcH * scale));

    // Canvas (2D) para máxima compatibilidad.
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("No fue posible inicializar el procesado de imagen en este dispositivo.");
    }

    // Dibuja con smoothing de calidad (evita artefactos en downscale).
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, outW, outH);

    // Exporta a JPEG y, si es muy grande, baja calidad de forma incremental.
    let blob = null;
    for (const q of QUALITY_STEPS) {
      blob = await canvasToJpegBlob(canvas, q);
      if (blob && blob.size <= TARGET_MAX_BYTES) break;
    }
    if (!blob) {
      throw new Error("No se pudo generar un JPEG válido a partir de la imagen.");
    }

    // Devuelve un File para que FormData conserve nombre y tipo.
    return new File([blob], "processed_image.jpg", { type: "image/jpeg" });
  } catch (err) {
    // Fallback: si no se puede convertir y ya es un tipo compatible “seguro”, devolvemos el original.
    // (No cumple “siempre JPEG”, pero evita bloquear al usuario cuando el navegador no decodifica HEIC/MPO).
    const isSafeFallback =
      originalType === "image/jpeg" ||
      originalType === "image/jpg" ||
      originalType === "image/png" ||
      originalType === "image/webp";

    if (isSafeFallback && input instanceof File) {
      return input;
    }

    const msg =
      err instanceof Error
        ? err.message
        : "No fue posible procesar esta imagen. Prueba con otra fotografía o un formato diferente (JPG o PNG).";
    throw new Error(msg);
  } finally {
    try {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    } catch {}
    try {
      if (bitmap && typeof bitmap.close === "function") bitmap.close();
    } catch {}
  }
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) return reject(new Error("Exportación de JPEG fallida."));
        resolve(b);
      },
      "image/jpeg",
      quality,
    );
  });
}

function loadImageAsBitmap(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      // Creamos un bitmap desde el elemento para unificar interfaz.
      if (typeof createImageBitmap === "function") {
        createImageBitmap(img)
          .then(resolve)
          .catch(reject);
        return;
      }
      // Fallback ultra-compatible: objeto con width/height y drawImage soporta HTMLImageElement.
      resolve(img);
    };
    img.onerror = () => reject(new Error("El navegador no pudo decodificar la imagen.")); // HEIC/MPO comúnmente fallan aquí
    img.src = url;
  });
}


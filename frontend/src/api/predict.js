import { API_BASE_URL, getApiBaseUrl } from "../config/api.js";

export function getResultImageUrl(resultImage) {
  if (!resultImage) return null;
  const base = getApiBaseUrl();
  const path = resultImage.startsWith("/") ? resultImage : `/${resultImage}`;
  return `${base}${path}`;
}

function formatDetail(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item === "object" && item?.msg ? item.msg : String(item)))
      .join(" ");
  }
  if (detail && typeof detail === "object" && detail.message) return detail.message;
  try {
    return JSON.stringify(detail);
  } catch {
    return "Error desconocido";
  }
}

function friendlyHttpMessage(status, detailText) {
  if (status === 413) {
    return "La imagen es demasiado grande. Prueba con otra más liviana o de menor resolución.";
  }
  if (status === 503) {
    return "El servicio de análisis no está disponible en este momento. Intenta de nuevo en unos minutos.";
  }
  if (status >= 500) {
    return "No se pudo procesar la imagen. Intenta nuevamente con otra fotografía.";
  }
  if (status === 400 || status === 422) {
    return detailText || "No se pudo validar la imagen. Prueba con otro archivo (JPG o PNG).";
  }
  if (detailText) return detailText;
  return "No se pudo completar el análisis. Verifica tu conexión e inténtalo de nuevo.";
}

export async function postPredict(file) {
  // Mantengo getApiBaseUrl por compatibilidad, pero la fuente de verdad es API_BASE_URL.
  const base = getApiBaseUrl() || API_BASE_URL;
  const url = `${base}/predict`;

  console.log("[DermaScan] Enviando a:", url);
  console.log("[DermaScan] Archivo:", file?.name, file?.type, file?.size, "bytes");

  const formData = new FormData();
  formData.append("file", file);
  console.log("[DermaScan] FormData contiene campo file:", formData.has("file"));

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.error("[DermaScan] Error de red o CORS:", err);
    throw new Error(
      "No se pudo conectar con el servicio de análisis. Comprueba la conexión de red, que la aplicación esté configurada con la dirección correcta del análisis e inténtalo de nuevo.",
    );
  }

  console.log("[DermaScan] Respuesta HTTP:", res.status, res.statusText);

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const detailRaw = body?.detail ?? text ?? "";
    const detailText = typeof detailRaw === "string" ? detailRaw : formatDetail(detailRaw);
    const message = friendlyHttpMessage(res.status, sanitizeServerDetail(detailText, res.status));
    console.error("[DermaScan] Error API:", res.status, message, body ?? text);
    throw new Error(message);
  }

  if (body == null || typeof body !== "object") {
    console.error("[DermaScan] Respuesta vacía o inválida:", text?.slice(0, 200));
    throw new Error(
      "La respuesta del análisis no fue reconocida. Recarga la página, vuelve a enviar la imagen o inténtalo más tarde.",
    );
  }

  return body;
}

/** Evita mostrar trazas o JSON crudo al usuario en mensajes derivados del servidor. */
function sanitizeServerDetail(text, status) {
  if (!text || typeof text !== "string") return "";
  const t = text.trim();
  if (t.length > 280) return "";
  if (/traceback|file "|error en inferencia:/i.test(t) && status >= 500) return "";
  return t;
}

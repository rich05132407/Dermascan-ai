/**
 * URL base del API (sin barra final).
 *
 * Configuración: variable `VITE_API_URL` en `.env` o `.env.local` (Vite la inyecta en build).
 * - Desarrollo: http://localhost:8000 (o tu IP LAN)
 * - Producción: URL pública HTTPS del backend (por ejemplo Render)
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || "https://dermascan-api-ifh7.onrender.com"
).replace(/\/$/, "");

// Log temporal para validar qué base URL está usando el build (dev/prod).
if (import.meta.env.DEV) {
  console.log(
    `[DermaScan] API_BASE_URL=${API_BASE_URL} (mode=${import.meta.env.MODE}, dev=${import.meta.env.DEV}, prod=${import.meta.env.PROD})`,
  );
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

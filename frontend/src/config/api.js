/**
 * URL base del API (sin barra final).
 *
 * Configuración: variable `VITE_API_URL` en `.env` o `.env.local` (Vite la inyecta en build).
 * - Misma máquina: http://127.0.0.1:8000
 * - Móvil en la misma red: http://<IP-LAN-de-tu-PC>:8000
 * - Producción: URL pública HTTPS del backend
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
  return String(raw).replace(/\/$/, "");
}

import { useSyncExternalStore } from "react";

/** Vista móvil: pantallas estrechas o tablet táctil en modo retrato. */
const MOBILE_QUERY = "(max-width: 767px), (max-width: 900px) and (pointer: coarse)";

function subscribe(onChange) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Prioriza flujo nativo de archivo/cámara (`input type="file"`) frente a getUserMedia,
 * más estable en smartphones y redes locales.
 */
export function useIsMobileLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

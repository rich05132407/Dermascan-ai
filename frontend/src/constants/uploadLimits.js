/** Tamaño máximo de imagen antes de enviar (validación en cliente). */
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export function isProbablyImageFile(file) {
  if (!file || !file.type) return false;
  return file.type.startsWith("image/");
}

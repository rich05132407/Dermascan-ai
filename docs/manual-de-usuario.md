# Manual de usuario — DermaScan AI

Guía para usar la aplicación web de detección asistida de lesiones cutáneas. Basada en el comportamiento actual de la interfaz y del backend.

---

## 1. Cómo abrir la app

1. **Arranca el backend** (servidor de la API) en tu equipo; debe quedar escuchando en la dirección que uses en la configuración (por defecto `http://127.0.0.1:8000`).
2. **Arranca el frontend** y abre en el navegador la URL que indique la consola (en desarrollo suele ser `http://127.0.0.1:5173` u otra similar).
3. Si la predicción falla al conectar, comprueba que el backend sigue en marcha y que la variable `VITE_API_URL` (si la usas) apunta al mismo host y puerto del servidor FastAPI.

---

## 2. Cómo subir una imagen

1. Desplázate hasta la sección de **detección** (también puedes usar el botón de la pantalla principal que lleva a esa zona).
2. En la tarjeta **Subir imagen**, pulsa **Seleccionar archivo**.
3. Elige un archivo de imagen desde tu dispositivo. Los formatos aceptados por el servidor incluyen **JPEG, PNG, GIF, WebP y BMP** (el navegador debe enviar un tipo `image/*` coherente).
4. Tras la selección, la aplicación envía la imagen automáticamente y verás un indicador de **carga** mientras se procesa.

---

## 3. Cómo usar la cámara

1. En la tarjeta **Cámara**, pulsa **Activar cámara**.
2. Cuando el navegador lo pida, **concede permiso** para usar la cámara (en móvil suele usarse la cámara trasera si el sistema lo permite).
3. Comprueba la vista previa en el recuadro de video.
4. Pulsa **Capturar foto** para enviar esa imagen al análisis.
5. Puedes pulsar **Detener** para apagar la cámara y liberar el dispositivo.

**Nota:** Si deniegas el permiso o el navegador no soporta acceso a la cámara, verás un mensaje de error en la propia tarjeta.

---

## 4. Cómo interpretar el resultado

Cuando el análisis termina correctamente, la pantalla muestra, entre otros:

- **Imagen anotada:** versión de tu imagen con las cajas (bounding boxes) que el modelo ha dibujado.
- **Clase principal:** etiqueta textual asociada a la detección con **mayor confianza** (si hubo detecciones).
- **Confianza estimada:** porcentaje derivado del valor numérico devuelto por el modelo para esa detección principal.
- **Mensaje del sistema:** texto breve indicando si la detección se completó o si no se encontraron lesiones automáticamente.
- **Regiones / tabla de detecciones:** si hay varias cajas, se listan todas con su clase y confianza.

Esto es un **resumen automático**; no incluye explicación clínica personalizada.

---

## 5. Qué significa la clase principal

**Clase principal** es el **nombre de categoría** que el modelo YOLOv8 asigna a la detección con **mayor puntuación de confianza** entre todas las encontradas en la imagen.

Los nombres concretos dependen de **cómo se entrenó** tu archivo `best.pt` (por ejemplo etiquetas personalizadas en el dataset). La aplicación **no define** por sí misma nombres médicos oficiales: muestra lo que el modelo devuelve en su mapa de clases.

---

## 6. Qué significa la confianza

**Confianza** (mostrada como porcentaje en la interfaz) es la salida del modelo para la detección principal: un valor entre **0 % y 100 %** que indica cuán seguro está el modelo de esa predicción **dentro de su entrenamiento**.

- **No** es una probabilidad clínica de enfermedad.
- **No** sustituye una prueba diagnóstica.
- Un valor alto no garantiza acierto; un valor bajo no sustituye valoración médica.

---

## 7. Advertencias de uso

- La herramienta es **orientativa y educativa**; **no es un diagnóstico médico**.
- **No sustituye** la consulta con un dermatólogo u otro profesional sanitario.
- Los resultados pueden ser **incorrectos** o **incompletos**.
- No uses la app como única base para decisiones sobre tu salud.

---

## 8. Qué hacer si hay errores

| Situación | Qué puedes hacer |
|-----------|-------------------|
| Mensaje de error al analizar (después de enviar imagen) | Revisa que el backend esté ejecutándose; revisa la red y la URL en `VITE_API_URL`. |
| Error de tipo de archivo / imagen no válida | Usa un archivo que sea realmente una imagen en formato permitido; prueba con otra exportación (p. ej. JPG). |
| La imagen anotada no se ve | Comprueba que la URL del backend sea accesible desde el navegador y que no haya bloqueo mixto de contenido; revisa que `result_image` en la respuesta sea coherente. |
| Cámara no funciona | Comprueba permisos del navegador; en escritorio asegúrate de tener cámara disponible; prueba otro navegador. |
| El servidor no arranca | Verifica que exista `model/best.pt` en la ruta correcta respecto a la carpeta del proyecto. |

Si el problema persiste, consulta la documentación técnica o el código de error en la respuesta del servidor (desde las herramientas de desarrollo del navegador o los logs del backend).

---

*Recuerde siempre buscar consejo médico ante cualquier duda sobre su piel.*

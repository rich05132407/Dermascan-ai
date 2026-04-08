# Guion de exposición — DermaScan AI

Guion breve para presentación oral (5–10 minutos, ajustable). Tono profesional y claro.

---

## 1. Introducción del problema

"Buenos días / tardes. El **cáncer de piel** es un problema de salud pública relevante, y la **detección temprana** mejora el pronóstico. En muchos contextos, la tecnología puede **apoyar** la revisión de imágenes, pero nunca sustituye al especialista.

Nuestro proyecto, **DermaScan AI**, aborda la parte técnica de **localizar y clasificar** lesiones en una imagen usando **visión por computador**, con un enfoque transparente sobre sus **límites** y su uso solo como **herramienta de apoyo**."

---

## 2. Solución propuesta

"Hemos construido una **aplicación web** dividida en dos partes:

- Un **backend** en **FastAPI** que carga un modelo **YOLOv8** previamente entrenado —archivo `best.pt`— y expone un endpoint que recibe una imagen y devuelve un **JSON** con detecciones y la ruta de una **imagen anotada** con las cajas del modelo.

- Un **frontend** en **React con Vite**, responsive, donde el usuario puede **subir una imagen** o **usar la cámara** —especialmente útil en móvil—, ver el resultado y leer **información** y **avisos médicos** integrados en la misma página.

El flujo es directo: **imagen → inferencia → respuesta estructurada + visualización**."

---

## 3. Tecnologías usadas

"A nivel de stack: **Python** con **FastAPI** y **Ultralytics YOLOv8**, **OpenCV** para el guardado de la imagen anotada, validación de imágenes con **Pillow**; en el cliente, **React 18**, **Vite**, comunicación por **fetch** y **multipart/form-data**. No usamos base de datos ni autenticación en esta versión: es un **MVP** pensado para demo y laboratorio."

---

## 4. Demostración del funcionamiento

"Sugerencia de demo en vivo:

1. Mostrar la **pantalla principal** y la sección de detección.
2. **Subir** una imagen de prueba o **capturar** con la cámara.
3. Mientras carga, mencionar que el servidor ejecuta la inferencia sobre el archivo recibido.
4. Al obtener respuesta, señalar: **imagen con cajas**, **clase principal**, **confianza** y, si hay varias detecciones, la **tabla** resumen.
5. Bajar a la sección de **aviso médico** y remarcar que es **apoyo**, no diagnóstico.

Si no hay detecciones, explicar que el modelo puede no ver lesiones en esa imagen y que eso **no** equivale a un 'todo está bien' clínico."

---

## 5. Limitaciones

"Las limitaciones son importantes de mencionar:

- El modelo depende totalmente del **entrenamiento** y de los **datos** con los que se creó `best.pt`.
- No hay historial de usuarios ni despliegue clínico certificado.
- La confianza del modelo **no** es una probabilidad médica.
- El proyecto corre en **entorno local** con CORS abierto para desarrollo."

---

## 6. Mejoras futuras

"A futuro se podría plantear: despliegue seguro con HTTPS, restricción de CORS, tests automatizados, optimización de inferencia según hardware, o integración con sistemas de archivo clínico **siempre** bajo supervisión profesional y normativa aplicable."

---

## 7. Cierre final

"En resumen: **DermaScan AI** integra un modelo YOLOv8 en una API moderna y una interfaz usable, para **visualizar** detecciones automáticas de forma educativa. Insisto: es una **herramienta técnica de apoyo**; la decisión clínica sigue siendo siempre del **profesional sanitario**.

Gracias; abrimos a preguntas."

---

*Ajuste tiempos y nivel de detalle según el público (técnico vs. general).*

# Preguntas frecuentes (FAQ) — DermaScan AI

Respuestas alineadas con el funcionamiento actual del proyecto.

---

## ¿Qué hace la aplicación?

Es una **demo web** que envía una imagen de piel a un servidor con un modelo **YOLOv8**. El servidor devuelve una lista de **detecciones** (cajas, clase y confianza para cada una), una **clase principal** (la de mayor confianza) y una **imagen anotada** con las cajas dibujadas. La interfaz también incluye texto informativo y avisos médicos.

---

## ¿Esta app reemplaza a un médico?

**No.** El aviso en la propia aplicación y la documentación lo dejan claro: la herramienta **no sustituye** la valoración de un **dermatólogo** u otro profesional. No es un dispositivo médico certificado para diagnóstico.

---

## ¿Qué significa el porcentaje de confianza?

Es la **confianza del modelo de aprendizaje automático** respecto a la detección que muestra como principal (la de mayor puntuación entre las cajas). **No** interpreta riesgo clínico personal ni probabilidad de cáncer en el sentido epidemiológico. Es una métrica **interna del modelo**.

---

## ¿Por qué a veces aparecen varias cajas (varias detecciones)?

El modelo puede predecir **varias regiones** en la misma imagen, cada una con su clase y confianza. La interfaz puede mostrar todas en una tabla; la **clase principal** corresponde a la detección con **mayor confianza** entre ellas.

---

## ¿Qué pasa si no detecta nada?

El backend puede responder con `has_detections: false`, mensaje indicando que no se detectaron lesiones, y `primary_class` / `primary_confidence` en **null**. Aun así puede devolver una **imagen de resultado** (según la lógica del servidor). **No** interpretes “cero detecciones” como certificado de ausencia de problema médico: puede deberse a la imagen, al modelo o al umbral interno del detector.

---

## ¿Qué se necesita para correrla localmente?

- **Python** con el entorno del backend instalado (`pip install -r backend/requirements.txt`).
- Archivo de pesos **`model/best.pt`** en la raíz del proyecto (junto a `backend` y `frontend`).
- **Node.js** y **npm** para instalar y ejecutar el frontend (`npm install` y `npm run dev` en `frontend`).
- Arrancar el **backend** con Uvicorn (por ejemplo en `http://127.0.0.1:8000`) y el **frontend** (por defecto Vite suele usar el puerto **5173**).
- Opcional: archivo `.env` o `.env.development` en el frontend con `VITE_API_URL` apuntando al backend.

---

## ¿Dónde se guardan las imágenes?

El servidor guarda la subida en `backend/uploads/` y la imagen anotada en `backend/results/` con nombres generados (UUID). No hay panel de administración para borrarlas desde la app.

---

## ¿Puedo cambiar el modelo?

Sustituyendo `model/best.pt` por otro compatible con Ultralytics YOLOv8 **en la misma ruta**, el backend cargará ese archivo al reiniciar. Cambiar nombres de clases o número de clases afectará lo que veas en pantalla según el entrenamiento del nuevo modelo.

---

## ¿Funciona sin internet?

El **frontend** puede servirse en local sin internet si ya tienes las dependencias instaladas. El **backend** necesita las librerías Python; la primera instalación de `ultralytics` suele descargar dependencias. La **inferencia** corre en tu máquina una vez instalado todo. Si usas fuentes de Google Fonts desde `index.html`, la tipografía puede depender de conexión salvo que se empaquetuen de otra forma.

---

*Para detalles de API y flujo técnico, véase `docs/descripcion-tecnica.md`.*

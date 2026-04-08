# Descripción técnica del sistema

Documento orientado a desarrolladores y evaluadores académicos. Se basa en el código del repositorio en su estado actual.

---

## 1. Visión técnica del sistema

La aplicación es un **cliente web** (React) que consume una **API REST** (FastAPI). El núcleo de inteligencia artificial es un modelo **YOLOv8** cargado desde el archivo `model/best.pt` en la raíz del proyecto (hermano de las carpetas `backend/` y `frontend/`).

No hay capa de persistencia relacional: las imágenes recibidas y los resultados anotados se escriben como archivos en disco (`backend/uploads/` y `backend/results/`).

---

## 2. Integración del modelo con FastAPI

### 2.1 Ubicación y carga del modelo

En `backend/app/main.py`:

- `MODEL_PATH = BACKEND_DIR.parent / "model" / "best.pt"`  
  Es decir: **`<raíz_del_proyecto>/model/best.pt`**.

- En el **lifespan** de la aplicación se instancia `SkinLesionPredictor(MODEL_PATH)` y se llama a `load()`, que ejecuta `YOLO(str(weights_path))` de Ultralytics (`backend/app/predictor.py`).

Si el archivo no existe, el constructor de `SkinLesionPredictor` lanza `FileNotFoundError` y el servidor no arranca correctamente.

### 2.2 Inferencia y salida gráfica

`SkinLesionPredictor.predict_and_save_annotated()`:

1. Llama a `self.model.predict(source=ruta_imagen, verbose=False)`.
2. Toma el primer elemento de la lista de resultados (`yolo_results[0]`).
3. Recorre `r.boxes` (si existe) y construye objetos `DetectionItem` con:
   - `class_id`, `class_name` (desde `r.names`), `confidence`, `bbox_xyxy` (cuatro floats `[x1,y1,x2,y2]` en píxeles).
4. Genera la imagen anotada con `r.plot()` (array BGR) y la guarda con OpenCV como **JPEG** en `results/` con nombre `{uuid}_annotated.jpg`.
5. La **detección principal** es la de **mayor confianza** entre todas las detecciones (`max` por `confidence`).

Casos límite implementados:

- Si `predict` no devuelve resultados: se copia la imagen original a un JPG en `results/` sin cajas (vía `_save_copy_without_boxes`).
- Si hay resultados pero **cero cajas**: el código actual aún usa `r.plot()` y guarda (comportamiento según Ultralytics para esa imagen).

---

## 3. Conexión del frontend con el backend

### 3.1 URL base

En `frontend/src/api/predict.js`:

- Se usa `import.meta.env.VITE_API_URL` o, si no está definida, **`http://127.0.0.1:8000`**.
- Se elimina una barra final opcional en la base.

### 3.2 Petición HTTP

- **Método:** `POST`
- **Ruta:** `{base}/predict`
- **Cuerpo:** `FormData` con un único campo **`file`** que contiene el `File` (subida o captura JPEG desde canvas).

No se envían cabeceras de autenticación; el backend no implementa login.

### 3.3 CORS

En `main.py`, `CORSMiddleware` permite `allow_origins=["*"]` para facilitar el desarrollo local con el frontend en otro puerto.

### 3.4 Imagen anotada en pantalla

El JSON devuelve `result_image` con forma relativa, por ejemplo `results/abc123_annotated.jpg`.

La URL absoluta se construye así:

`getResultImageUrl(result_image)` → `{base}/results/abc123_annotated.jpg`

Esto coincide con el montaje de `StaticFiles` en FastAPI bajo el prefijo **`/results`**, que sirve el directorio `backend/results/`.

---

## 4. Flujo completo: del usuario al resultado

1. El usuario elige archivo (`UploadImage`) o captura desde `<video>` + canvas (`CameraCapture`) y se obtiene un objeto `File`.
2. `usePrediction` pone `loading=true`, limpia error y datos previos, y llama a `postPredict(file)`.
3. `postPredict` hace `fetch` POST; si la respuesta no es OK, parsea el cuerpo de error de FastAPI (`detail`) y lanza `Error` con mensaje legible.
4. Con éxito, el JSON se guarda en estado React y `PredictionResult` renderiza imagen (si hay URL), métricas y tabla de detecciones cuando corresponde.
5. El navegador solicita la imagen anotada por URL GET al mismo host del backend (debe estar accesible; mismo origen lógico vía URL absoluta al puerto 8000).

---

## 5. Formato del JSON de respuesta

Definido en `backend/app/schemas.py` como `PredictResponse`:

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `has_detections` | `boolean` | `true` si hubo al menos una caja detectada. |
| `message` | `string` | Texto fijo en código: éxito con detecciones vs. mensaje de ausencia de lesiones. |
| `primary_class` | `string` o `null` | Nombre de la clase de la detección con mayor confianza; `null` si no hay detecciones. |
| `primary_confidence` | `float` o `null` | Entre 0 y 1; `null` si no hay detecciones. |
| `detections` | `array` | Lista de `DetectionItem`. |
| `result_image` | `string` o `null` | Ruta relativa tipo `results/<archivo>.jpg` para montar la URL de la imagen anotada. |

Cada **`DetectionItem`** incluye:

- `class_id` (entero)
- `class_name` (cadena)
- `confidence` (0–1)
- `bbox_xyxy` (cuatro números: esquinas de la caja en píxeles)

Errores HTTP habituales (no forman parte del JSON de éxito):

- **400**: tipo de archivo no imagen, vacío, corrupto o formato no permitido.
- **500**: fallo en inferencia (mensaje en `detail`).
- **503**: modelo no disponible (no debería ocurrir si el arranque fue correcto).

---

## 6. Imagen anotada

- Se genera en el servidor como **JPEG** en `backend/results/`.
- Proviene de `result.plot()` de Ultralytics (cajas y etiquetas según el modelo).
- El frontend la muestra en un elemento `<img>` apuntando a la URL bajo `/results/...`.

Si no hay detecciones, el backend aún devuelve `result_image` apuntando a un archivo generado (copia o salida de `plot()` según el caso), de modo que la UI puede mostrar siempre una imagen de referencia cuando el campo viene informado.

---

## 7. Componentes principales del frontend

| Componente | Rol |
|------------|-----|
| `App.jsx` | Layout: cabecera con anclas, hero, sección de detección, pie. Usa `usePrediction` y pasa `predict` a subida y cámara. |
| `HeroSection` | Portada, CTAs (scroll a detección, enlace a información). |
| `UploadImage` | `<input type="file">` oculto, botón que dispara clic; formatos acotados por `accept`. |
| `CameraCapture` | `getUserMedia`, `<video>`, captura a canvas → `File` JPEG; botones activar / capturar / detener. |
| `PredictionResult` | Estados: carga, error, vacío (sin datos), resultado con dashboard visual y tabla de detecciones. |
| `InfoSection` | Texto informativo sobre cáncer de piel y alcance de la herramienta. |
| `MedicalDisclaimer` | Aviso legal/sanitario. |
| `ContactSection` | Muestra correo desde `VITE_CONTACT_EMAIL` o valor por defecto en código. |

Estado de predicción centralizado en `hooks/usePrediction.js` (`data`, `loading`, `error`, `predict`).

---

## 8. Endpoint `POST /predict`

- **Handler:** `predict` en `backend/app/main.py`.
- **Parámetro:** `file: UploadFile = File(...)` — el nombre del campo en multipart debe ser **`file`** (coincide con `formData.append("file", file)` en el frontend).
- **Respuesta:** cuerpo JSON conforme a `PredictResponse`.
- **Estáticos:** rutas bajo `/results` no interceptan POST; solo sirven GET de archivos generados.

---

## 9. Consideraciones técnicas importantes

- **Seguridad en producción:** CORS abierto y API sin autenticación son aceptables solo en entorno local o demo aislada; en despliegue real convendría restringir orígenes y valorar autenticación o rate limiting.
- **Privacidad:** Las imágenes quedan en disco en `uploads/` y `results/`; conviene política de borrado manual o automatizado si se usa con datos sensibles.
- **Requisitos de red:** El frontend asume que el navegador puede llamar al puerto 8000; firewalls o mezcla HTTP/HTTPS pueden bloquear la carga de la imagen anotada si la política de contenido no lo permite.
- **Dependencias pesadas:** `ultralytics` arrastra PyTorch; la instalación puede ser grande y lenta.

---

*Última revisión alineada con el código fuente del proyecto.*

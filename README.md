# DermaScan AI

Aplicación web de **detección asistida de lesiones cutáneas** orientada a demostración académica y prototipo profesional. Combina un modelo de visión (YOLO vía backend) con una interfaz React clara y mensajes prudentes para el usuario final.

**Aviso:** la herramienta es **solo de apoyo** y **no sustituye** diagnóstico ni valoración médica.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite 6, CSS modular por componente |
| Backend | FastAPI, Ultralytics YOLO, PyTorch |
| Comunicación | `multipart/form-data` (`POST /predict`) |

## Estructura del repositorio

```
proyecto deteccion de cancer app/
├── backend/           # API FastAPI, modelo, uploads y resultados
│   ├── app/           # main, predictor, schemas, utils
│   └── requirements.txt
├── frontend/          # SPA React + Vite
│   ├── src/
│   │   ├── api/       # Cliente HTTP (predict)
│   │   ├── config/    # URL base del API
│   │   ├── constants/ # Límites de subida, etc.
│   │   ├── components/
│   │   └── hooks/
│   └── package.json
├── model/             # Pesos del modelo (p. ej. best.pt)
├── iniciar_backend.bat
├── iniciar_frontend.bat
└── iniciar_app.bat
```

## Requisitos previos

- **Python 3.10+** con entorno virtual en `backend/.venv` y dependencias instaladas (`pip install -r requirements.txt`).
- **Node.js 18+** y npm en el `frontend/`.
- Archivo de modelo en `model/best.pt` (o la ruta que use tu `main.py`).

## Cómo ejecutar (Windows)

### Opción rápida

1. Doble clic en **`iniciar_app.bat`** (raíz del proyecto).  
   Se abren dos consolas: API en el puerto **8000** e interfaz en **5173**.

### Por separado

1. **`iniciar_backend.bat`** — activa `.venv`, ejecuta Uvicorn en `0.0.0.0:8000` (accesible desde la LAN).
2. **`iniciar_frontend.bat`** — `npm install` si hace falta, luego `npm run dev` (host `0.0.0.0`, puerto **5173**).

### Configurar la URL del backend (importante en móvil)

En `frontend/.env` o `.env.local` (copia de `.env.example`):

```env
VITE_API_URL=http://127.0.0.1:8000
```

- **Mismo ordenador:** `http://127.0.0.1:8000` está bien.
- **Teléfono en la misma Wi-Fi:** usa la **IP local del PC** donde corre la API, por ejemplo `http://192.168.0.161:8000`. En el móvil, `localhost` apunta al propio teléfono, no a tu PC.

Tras cambiar `.env`, **reinicia** `npm run dev`.

## Uso de la aplicación

1. Abre la web (por defecto `http://localhost:5173` o `http://<IP-PC>:5173` desde el móvil).
2. **Elige o captura** una imagen (vista previa).
3. Pulsa **Analizar imagen** y espera el resumen.
4. Revisa **clase sugerida**, **nivel de confianza** (cualitativo), **hallazgos** y **mensaje orientativo**.

En pantallas pequeñas el flujo prioriza **archivo nativo** (`input type="file"` con cámara trasera o galería). La cámara en vivo del navegador queda **solo en escritorio** por estabilidad.

## Limitaciones reales

- Resultados **orientativos**; falsos positivos/negativos son posibles.
- Calidad de imagen, iluminación y encuadre afectan mucho al modelo.
- **HEIC** u otros formatos pueden fallar si el backend no los decodifica.
- Tamaño máximo en cliente: **15 MB** (ajustable en `frontend/src/constants/uploadLimits.js`).
- Despliegue en internet exige HTTPS, dominio, CORS acotado y hosting del modelo.

## Mejoras futuras sugeridas

- Autenticación y registro de auditoría.
- Colas o límites de tasa en la API.
- Tests e2e (Playwright) para flujo subida → resultado.
- Docker Compose para un único comando de arranque.
- Internacionalización (i18n).

## Licencia y uso

Proyecto académico / portfolio. Revisa dependencias de terceros (PyTorch, Ultralytics, etc.) para uso comercial.

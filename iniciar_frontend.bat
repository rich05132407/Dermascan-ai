@echo off
setlocal
cd /d "%~dp0frontend"

if not exist "node_modules\" (
  echo [DermaScan] Instalando dependencias npm...
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

echo.
echo [DermaScan] Iniciando interfaz en 0.0.0.0:5173
echo En el movil use http://^<IP-de-esta-PC^>:5173 y configure VITE_API_URL con la IP del backend.
echo.
call npm run dev
pause

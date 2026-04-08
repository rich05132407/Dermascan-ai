@echo off
setlocal
cd /d "%~dp0backend"

if not exist ".venv\Scripts\python.exe" (
  echo [DermaScan] No se encontro backend\.venv
  echo Cree el entorno: python -m venv .venv
  echo Luego: .venv\Scripts\pip install -r requirements.txt
  pause
  exit /b 1
)

call .venv\Scripts\activate.bat
echo.
echo [DermaScan] Iniciando API en 0.0.0.0:8000
echo Desde otro dispositivo en la misma red use: http://^<IP-de-esta-PC^>:8000
echo.
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause

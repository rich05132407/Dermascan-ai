@echo off
setlocal
set "ROOT=%~dp0"

echo [DermaScan] Abriendo API y frontend en ventanas separadas...
start "DermaScan — API (8000)" /D "%ROOT%backend" cmd /k "call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul
start "DermaScan — Web (5173)" /D "%ROOT%frontend" cmd /k "npm run dev"

echo.
echo Listo. Puede cerrar esta ventana; las otras dos siguen abiertas.
echo Backend: puerto 8000  ^|  Frontend: puerto 5173
pause

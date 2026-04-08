cd /d "E:\proyecto deteccion de cancer app\backend"
start cmd /k "python main.py"

timeout /t 3

cd /d "E:\proyecto deteccion de cancer app\frontend"
start cmd /k "npm run dev"

timeout /t 3

start http://localhost:5173
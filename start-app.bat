@echo off
echo ========================================
echo  💩 Starting Poop Scanner App 💩
echo ========================================
echo.

echo [1/2] Starting FastAPI Backend...
start cmd /k "cd /d %~dp0 && echo Starting Backend on http://localhost:8000 && venv\Scripts\activate && uvicorn main:app --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Frontend...
start cmd /k "cd /d %~dp0frontend && echo Starting Frontend on http://localhost:5175 && npm run dev"

echo.
echo ========================================
echo  ✅ Both servers are starting!
echo ========================================
echo.
echo  Backend: http://localhost:8000
echo  Frontend: http://localhost:5175
echo.
echo  Press any key to exit this window
echo  (The servers will keep running)
echo ========================================
pause >nul

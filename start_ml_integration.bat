@echo off
echo ========================================
echo    TrustChain ML Integration Startup
echo ========================================
echo.

echo Starting ML Service...
start "ML Service" cmd /k "cd backend\ml && pip install -r requirements.txt && python ml_service.py"

echo Waiting for ML service to start...
timeout /t 10 /nobreak > nul

echo Starting Backend...
start "Backend" cmd /k "cd backend && npm install && npm run dev"

echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo    All services are starting...
echo ========================================
echo.
echo ML Service: http://localhost:5001
echo Backend:    http://localhost:3001
echo Frontend:   http://localhost:5173
echo ML Dashboard: http://localhost:5173/ml-dashboard
echo.
echo Press any key to close this window...
pause > nul

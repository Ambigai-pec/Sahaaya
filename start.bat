@echo off
title Sahaaya Health Companion Launcher
echo ======================================================================
echo           SAHAAYA - AI-Driven Mobile Health Companion
echo             Medication Adherence ^& Mental Well-Being
echo ======================================================================
echo.

echo [1/3] Checking Backend Database & Dependencies...
cd /d "%~dp0backend"
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    call .\venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call .\venv\Scripts\activate.bat
)

echo Seeding SQLite database with demo data (Radha, Meena)...
python seed_data.py
echo Database ready!

echo.
echo [2/3] Launching FastAPI Backend on http://localhost:8000 ...
start "Sahaaya Backend (FastAPI)" cmd /k ".\venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo.
echo [3/3] Launching React Native Expo Mobile App...
cd /d "%~dp0frontend"
start "Sahaaya Mobile App (Expo)" cmd /k "npx expo start"

echo.
echo ======================================================================
echo Both Sahaaya servers have been launched!
echo.
echo * Backend Swagger Docs: http://localhost:8000/docs
echo * Frontend Expo Server: Running in separate terminal.
echo   - Press 'w' in that terminal to open web preview in browser
echo   - Scan QR code with Expo Go app on your mobile phone
echo.
echo Demo Users:
echo   - Patient:   Radha (radha)
echo   - Caregiver: Meena (meena)
echo   - Admin:     Admin (admin)
echo ======================================================================
pause

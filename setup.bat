@echo off
echo ===================================================
echo     MEDICA AI - Project Setup Script (Windows)
echo ===================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js and try again.
    pause
    exit /b 1
)

:: Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python (and add it to PATH) and try again.
    pause
    exit /b 1
)

echo [1/3] Setting up Client (Frontend)...
cd client
call npm install
cd ..
echo [OK] Client setup complete!
echo.

echo [2/3] Setting up Server (Backend)...
cd server
call npm install
cd ..
echo [OK] Server setup complete!
echo.

echo [3/3] Setting up ML Model (Python Environment)...
cd ml-model
if not exist "venv\" (
    echo Creating Python virtual environment (venv)...
    python -m venv venv
)
echo Activating virtual environment and installing requirements...
call venv\Scripts\activate.bat
pip install -r requirements.txt
call deactivate
cd ..
echo [OK] ML Model setup complete!
echo.

echo ===================================================
echo     Setup Completed Successfully!
echo     Please remember to configure your server/.env 
echo     file before starting the application.
echo ===================================================
pause

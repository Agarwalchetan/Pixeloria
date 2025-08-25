@echo off
title Pixeloria Backend Server
echo ========================================
echo    PIXELORIA BACKEND SERVER STARTUP
echo ========================================
echo.
cd /d "d:\Projects\Pixeloria\backend"
echo Current directory: %CD%
echo.
echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo.
echo Starting simple backend server...
echo Server will run on: http://localhost:5000
echo Health check: http://localhost:5000/health
echo Upload endpoint: http://localhost:5000/admin/dashboard/about-settings/team
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
node simple-server.js
echo.
echo Server stopped.
pause

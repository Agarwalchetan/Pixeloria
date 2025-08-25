@echo off
echo Starting Pixeloria Backend Server...
cd /d "d:\Projects\Pixeloria\backend"
echo Current directory: %CD%
echo.
echo Checking Node.js version...
node --version
echo.
echo Starting server...
node src/server.js
pause

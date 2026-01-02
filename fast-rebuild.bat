@echo off
setlocal enabledelayedexpansion

echo.
echo ===== AS DANCE - Fast Rebuild (Styles Updated) =====
echo.

REM Fast rebuild - only rebuild, no npm install
echo [1/2] Rebuilding frontend with updated styles...
cd frontend
call npm run build:backend
if errorlevel 1 (
    echo ERROR: Build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [✓] Frontend rebuilt and synced

REM Run Backend
echo.
echo [2/2] Starting Backend on http://localhost:8085
echo.
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

pause

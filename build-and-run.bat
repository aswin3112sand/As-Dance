@echo off
setlocal enabledelayedexpansion

echo.
echo ===== AS DANCE - Build & Run (Updated Styles) =====
echo.

REM Step 1: Build Frontend with latest styles
echo [1/3] Building React Frontend with updated styles...
cd frontend
call npm run build:backend
if errorlevel 1 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [✓] Frontend built and synced to backend

REM Step 2: Run Backend
echo.
echo [2/2] Starting Spring Boot Backend on http://localhost:8085
echo.
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

pause

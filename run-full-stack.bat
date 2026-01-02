@echo off
setlocal enabledelayedexpansion

echo.
echo ===== AS DANCE - Full Stack Build & Run =====
echo.

REM Step 1: Build Frontend
echo [1/3] Building React Frontend...
cd frontend
call npm install
call npm run build:backend
if errorlevel 1 (
    echo ERROR: Frontend build failed
    exit /b 1
)
cd ..
echo [✓] Frontend built successfully

REM Step 2: Backend is already compiled (target/classes exists)
echo.
echo [2/3] Backend ready (using pre-compiled classes)

REM Step 3: Run Backend
echo.
echo [3/3] Starting Spring Boot Backend on http://localhost:8085
echo.
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

pause

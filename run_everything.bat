@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo      AS DANCE - RUN EVERYTHING
echo ==========================================
echo.

REM 1. Check Pre-requisites
echo [1/4] Checking environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    pause
    exit /b 1
)
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH.
    pause
    exit /b 1
)
java -version >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH.
    pause
    exit /b 1
)
echo [OK] Environment checks passed.
echo.

REM 2. Install Frontend Dependencies (if needed)
echo [2/4] Checking frontend dependencies...
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm ci
) else (
    echo node_modules exists, skipping install.
)
echo.

REM 3. Build Frontend & Sync
echo [3/4] Building Frontend and Syncing...
call npm run build:backend
if %errorlevel% neq 0 (
    echo ERROR: Frontend build/sync failed.
    echo Please check the error messages above.
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend built and synced to backend/src/main/resources/static
echo.

REM 4. Run Backend
echo [4/4] Starting Backend...
cd backend
REM Use -Dspring-boot.run.jvmArguments to enable hot swapping if supported, though full rebuild is safer for ensuring static files update.
call mvn clean spring-boot:run
if %errorlevel% neq 0 (
    echo ERROR: Backend failed to start.
    cd ..
    pause
    exit /b 1
)

pause

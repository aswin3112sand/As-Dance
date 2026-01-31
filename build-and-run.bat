@echo off
REM AS DANCE - Build and Run Script (Windows)
REM Usage: build-and-run.bat [dev|prod]

setlocal enabledelayedexpansion

set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=dev

echo.
echo ========================================
echo AS DANCE - Build and Run
echo Profile: %PROFILE%
echo ========================================
echo.

REM Step 1: Build Frontend
echo [1/3] Building frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    exit /b 1
)

call npm run build:backend
if errorlevel 1 (
    echo ERROR: npm run build:backend failed
    exit /b 1
)

echo [1/3] Frontend built successfully
echo.

REM Step 2: Build Backend
echo [2/3] Building backend...
cd ..\backend
call mvn clean package -DskipTests
if errorlevel 1 (
    echo ERROR: mvn package failed
    exit /b 1
)

echo [2/3] Backend built successfully
echo.

REM Step 3: Run Backend
echo [3/3] Starting backend (profile: %PROFILE%)...
echo.
echo ========================================
echo Application will be available at:
echo   http://localhost:8080
echo.
echo API Health Check:
echo   http://localhost:8080/api/health
echo.
echo H2 Console (dev only):
echo   http://localhost:8080/h2-console
echo ========================================
echo.

set SPRING_PROFILES_ACTIVE=%PROFILE%
set RAZORPAY_KEY_ID=rzp_test_S9x8v58typ8PLI
set RAZORPAY_KEY_SECRET=K8IYt5e2vDitzVNr3TEbN2HH
set APP_PAYMENT_MOCK=false
call mvn spring-boot:run

endlocal

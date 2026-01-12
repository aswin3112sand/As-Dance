@echo off
echo Building AS Dance Real-time Application...

echo.
echo [1/4] Installing frontend dependencies...
cd frontend
call npm install

echo.
echo [2/4] Building frontend...
call npm run build:backend

echo.
echo [3/4] Building backend...
cd ..\backend
call mvn clean package -DskipTests

echo.
echo [4/4] Starting application...
call mvn spring-boot:run

echo.
echo Real-time application is running at http://localhost:8085
echo WebSocket endpoint: ws://localhost:8085/ws
pause
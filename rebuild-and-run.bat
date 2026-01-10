@echo off
cd frontend
call npm run build:backend
cd ..\backend
taskkill /F /IM java.exe 2>nul
timeout /t 2
call mvn spring-boot:run

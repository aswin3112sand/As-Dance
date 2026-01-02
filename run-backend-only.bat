@echo off
echo.
echo ===== AS DANCE Backend - Starting on http://localhost:8085 =====
echo.
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
pause

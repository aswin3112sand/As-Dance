@echo off
echo.
echo ===== AS DANCE - Starting Backend on http://localhost:8086 =====
echo.
echo Frontend: ✓ Built and synced
echo Cache: ✓ Disabled
echo Dev Mode: ✓ Enabled
echo.
echo Starting Spring Boot...
echo.
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

@echo off
cd frontend
call npm run build:backend
cd ..\backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

@echo off
setlocal
cd backend
call mvn clean package -DskipTests
endlocal

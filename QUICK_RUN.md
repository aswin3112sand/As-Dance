# AS DANCE - Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- Java 17+ installed
- Maven 3.8+ installed

## Option 1: One-Click Run (Recommended)

1. Double-click `run-full-stack.bat` from the project root
2. Wait for the build to complete
3. Open browser: **http://localhost:8085**

## Option 2: Manual Steps

### Build Frontend
```bash
cd frontend
npm install
npm run build:backend
cd ..
```

### Run Backend
```bash
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

Then open: **http://localhost:8085**

## What Happens
- Frontend (React) builds and copies to `backend/src/main/resources/static/`
- Backend (Spring Boot) serves both API and static files on port 8085
- Dev mode enabled (DevTools + no-cache)

## Troubleshooting

**Port 8085 already in use?**
```bash
# Kill process on port 8085
netstat -ano | findstr :8085
taskkill /PID <PID> /F
```

**Maven not found?**
- Install Maven: https://maven.apache.org/download.cgi
- Add to PATH environment variable

**Node modules issue?**
```bash
cd frontend
rm -r node_modules package-lock.json
npm install
npm run build:backend
```

## Features
- ✅ Single localhost:8085 port
- ✅ Hot reload (DevTools enabled)
- ✅ Mock payment mode (no Razorpay keys needed)
- ✅ H2 in-memory database
- ✅ JWT authentication

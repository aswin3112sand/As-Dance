#!/bin/bash

# AS DANCE - Build and Run Script (Linux/Mac)
# Usage: ./build-and-run.sh [dev|prod]

set -e

PROFILE="${1:-dev}"

echo ""
echo "========================================"
echo "AS DANCE - Build and Run"
echo "Profile: $PROFILE"
echo "========================================"
echo ""

# Step 1: Build Frontend
echo "[1/3] Building frontend..."
cd frontend
npm install
npm run build:backend
echo "[1/3] Frontend built successfully"
echo ""

# Step 2: Build Backend
echo "[2/3] Building backend..."
cd ../backend
mvn clean package -DskipTests
echo "[2/3] Backend built successfully"
echo ""

# Step 3: Run Backend
echo "[3/3] Starting backend (profile: $PROFILE)..."
echo ""
echo "========================================"
echo "Application will be available at:"
echo "  http://localhost:8080"
echo ""
echo "API Health Check:"
echo "  http://localhost:8080/api/health"
echo ""
echo "H2 Console (dev only):"
echo "  http://localhost:8080/h2-console"
echo "========================================"
echo ""

export SPRING_PROFILES_ACTIVE=$PROFILE
mvn spring-boot:run

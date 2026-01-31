#!/bin/bash
# AS DANCE - Build and Run Script (Linux/WSL)

PROFILE=${1:-dev}

echo ""
echo "========================================"
echo "AS DANCE - Build and Run"
echo "Profile: $PROFILE"
echo "========================================"
echo ""

# Step 1: Build Frontend
echo "[1/3] Building frontend..."
cd frontend || exit
npm install
npm run build:backend
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend build failed"
    exit 1
fi
echo "[1/3] Frontend built successfully"
echo ""

# Step 2: Build Backend
echo "[2/3] Building backend..."
cd ../backend || exit
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "ERROR: Backend build failed"
    exit 1
fi
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
echo "========================================"
echo ""

export SPRING_PROFILES_ACTIVE=$PROFILE
export RAZORPAY_KEY_ID="rzp_test_S9x8v58typ8PLI"
export RAZORPAY_KEY_SECRET="K8IYt5e2vDitzVNr3TEbN2HH"
export APP_PAYMENT_MOCK="false"

mvn spring-boot:run
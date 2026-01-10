#!/bin/bash
# AS Dance - Upload JAR to VPS
# Run this from your local machine (Windows Git Bash / WSL / Mac / Linux)

VPS_USER="root"
VPS_IP="your-vps-ip-here"
VPS_PATH="/opt/as-dance"
JAR_FILE="backend/target/as-dance-backend-1.0.0.jar"

if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: JAR file not found at $JAR_FILE"
    echo "Please build the backend first:"
    echo "  cd backend && mvn clean package"
    exit 1
fi

echo "Uploading JAR to VPS..."
scp "$JAR_FILE" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"

if [ $? -eq 0 ]; then
    echo "✓ JAR uploaded successfully"
    echo ""
    echo "Next steps:"
    echo "1. SSH into your VPS:"
    echo "   ssh ${VPS_USER}@${VPS_IP}"
    echo ""
    echo "2. Run the deployment script:"
    echo "   bash /opt/as-dance/deploy-to-vps.sh"
else
    echo "✗ Upload failed"
    exit 1
fi

#!/bin/bash
# AS DANCE Backend Deployment Script
# Usage: ./deploy-backend.sh <vps-user> <vps-host> <vps-port>

set -e

VPS_USER=${1:-root}
VPS_HOST=${2:-your-vps-ip}
VPS_PORT=${3:-22}
APP_DIR="/opt/as-dance"
APP_JAR="as-dance-backend-1.0.0.jar"
SERVICE_NAME="as-dance"

echo "🚀 AS DANCE Backend Deployment"
echo "================================"
echo "VPS: $VPS_USER@$VPS_HOST:$VPS_PORT"
echo "App Dir: $APP_DIR"
echo ""

# Step 1: Build backend
echo "📦 Building backend..."
cd backend
mvn clean package -DskipTests
cd ..

# Step 2: Upload JAR
echo "📤 Uploading JAR to VPS..."
scp -P $VPS_PORT backend/target/$APP_JAR $VPS_USER@$VPS_HOST:$APP_DIR/

# Step 3: Setup systemd service
echo "⚙️  Setting up systemd service..."
ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << 'EOF'
sudo mkdir -p /opt/as-dance
sudo mkdir -p /var/log/as-dance

# Create systemd service file
sudo tee /etc/systemd/system/as-dance.service > /dev/null << 'SERVICE'
[Unit]
Description=AS DANCE Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/as-dance
ExecStart=/usr/bin/java -Xmx512m -Xms256m -jar /opt/as-dance/as-dance-backend-1.0.0.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/as-dance/app.log
StandardError=append:/var/log/as-dance/app.log
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="SERVER_PORT=8080"

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl enable as-dance
sudo systemctl restart as-dance
EOF

# Step 4: Verify deployment
echo "✅ Verifying deployment..."
sleep 3
curl -s https://asdancz.in/api/health | jq . || echo "⚠️  Health check pending (SSL may take a moment)"

echo ""
echo "✨ Deployment complete!"
echo "View logs: ssh -p $VPS_PORT $VPS_USER@$VPS_HOST tail -f /var/log/as-dance/app.log"

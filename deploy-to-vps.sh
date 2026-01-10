#!/bin/bash
set -e

# AS Dance VPS Deployment Script for Ubuntu
# Copy-paste this entire script into your Hostinger Ubuntu VPS terminal

APP_DIR="/opt/as-dance"
JAR_FILE="as-dance-backend-1.0.0.jar"
SERVICE_NAME="asdance"
PORT=8085

echo "=== AS Dance VPS Deployment ==="

# 1. Create app directory
echo "Creating app directory..."
sudo mkdir -p $APP_DIR
cd $APP_DIR

# 2. Upload JAR (you'll need to SCP this separately or paste the base64)
# For now, we assume the JAR is already uploaded to $APP_DIR
if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: $JAR_FILE not found in $APP_DIR"
    echo "Please upload the JAR file first using:"
    echo "  scp backend/target/as-dance-backend-1.0.0.jar user@your-vps:/opt/as-dance/"
    exit 1
fi

echo "JAR file found: $JAR_FILE"

# 3. Create systemd service
echo "Creating systemd service..."
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null <<'SYSTEMD_EOF'
[Unit]
Description=AS Dance Spring Boot
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/as-dance
ExecStart=/usr/bin/java -jar /opt/as-dance/as-dance-backend-1.0.0.jar --server.port=8085
SuccessExitStatus=143
Restart=always
RestartSec=5
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SYSTEMD_EOF

# 4. Reload systemd and enable service
echo "Enabling systemd service..."
sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}

# 5. Start service
echo "Starting service..."
sudo systemctl start ${SERVICE_NAME}

# 6. Check status
echo ""
echo "=== Service Status ==="
sudo systemctl status ${SERVICE_NAME} --no-pager

echo ""
echo "=== Deployment Complete ==="
echo "Access your app at: http://your-vps-ip:${PORT}"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status ${SERVICE_NAME}          # Check status"
echo "  sudo systemctl restart ${SERVICE_NAME}         # Restart"
echo "  sudo systemctl stop ${SERVICE_NAME}            # Stop"
echo "  sudo journalctl -u ${SERVICE_NAME} -f          # View logs"

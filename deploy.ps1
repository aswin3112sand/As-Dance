$VPS_IP = "72.61.248.167"
$VPS_USER = "root"
$APP_DIR = "/opt/as-dance"

Write-Host "=== AS Dance VPS Deployment ===" -ForegroundColor Green

# 1. Build JAR
Write-Host "Building JAR..." -ForegroundColor Yellow
Set-Location C:\Users\riote\Downloads\as_dance_full_project
mvn -f backend\pom.xml -U -DskipTests=true clean package
if ($LASTEXITCODE -ne 0) { exit 1 }

# 2. Install Java on VPS
Write-Host "Installing Java on VPS..." -ForegroundColor Yellow
ssh root@$VPS_IP "apt-get update && apt-get install -y openjdk-21-jre-headless openssl"

# 3. Create app directory
Write-Host "Creating app directory..." -ForegroundColor Yellow
ssh root@$VPS_IP "mkdir -p $APP_DIR"

# 4. Upload JAR
Write-Host "Uploading JAR..." -ForegroundColor Yellow
scp backend\target\as-dance-backend-1.0.0.jar "${VPS_USER}@${VPS_IP}:${APP_DIR}/as-dance-backend-1.0.0.jar"

# 5. Generate JWT secret
Write-Host "Generating JWT secret..." -ForegroundColor Yellow
ssh root@$VPS_IP "openssl rand -hex 32 | xargs -I {} sh -c 'echo APP_JWT_SECRET={} > $APP_DIR/asdance.env'"

# 6. Create systemd service
Write-Host "Creating systemd service..." -ForegroundColor Yellow
$serviceContent = @"
[Unit]
Description=AS Dance Spring Boot
After=network.target

[Service]
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/asdance.env
ExecStart=/usr/bin/java -jar $APP_DIR/as-dance-backend-1.0.0.jar --server.port=8085
SuccessExitStatus=143
Restart=always
RestartSec=5
User=root
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
"@
ssh root@$VPS_IP "cat > /etc/systemd/system/asdance.service << 'EOF'`n$serviceContent`nEOF"

# 7. Enable and start service
Write-Host "Starting service..." -ForegroundColor Yellow
ssh root@$VPS_IP "systemctl daemon-reload && systemctl enable asdance && systemctl start asdance"

# 8. Check status
Write-Host "Service Status:" -ForegroundColor Green
ssh root@$VPS_IP "systemctl status asdance --no-pager"

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Access: http://$VPS_IP`:8085" -ForegroundColor Cyan
Write-Host "View logs: ssh root@$VPS_IP `"journalctl -u asdance -f`"" -ForegroundColor Cyan

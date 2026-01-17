# AS DANCE - Production Deployment Guide

## FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    HTTPS (Let's Encrypt)                │
│                   https://asdancz.in:443                │
└────────────────────────┬────────────────────────────────┘
                         │
                    Nginx Reverse Proxy
                    (Optional, recommended)
                         │
┌────────────────────────▼────────────────────────────────┐
│          Spring Boot (Single JAR)                       │
│          Port: 8080                                     │
│          Bind: 0.0.0.0 (public)                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Frontend (React/Vite - Static Files)            │   │
│  │ Served from: src/main/resources/static/         │   │
│  │ Routes: / (SPA forward to index.html)           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Backend APIs                                    │   │
│  │ Routes: /api/* (all public, no auth required)   │   │
│  │ Health: /api/health                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Database (File-based H2)                        │   │
│  │ Location: ./data/asdance.mv.db                  │   │
│  │ Persists across restarts                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## QUICK START (LOCAL DEVELOPMENT)

### 1. Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Sync Frontend to Backend
```bash
npm run build:backend
```
This copies `frontend/dist/` → `backend/src/main/resources/static/`

### 3. Run Backend (Dev Profile)
```bash
cd backend
mvn spring-boot:run
```
Or with explicit profile:
```bash
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run
```

### 4. Access Application
- UI: http://localhost:8080
- API: http://localhost:8080/api/health
- H2 Console: http://localhost:8080/h2-console (dev only)

---

## PRODUCTION DEPLOYMENT

### Prerequisites
- Java 21+
- Maven 3.8+
- Linux VPS (Ubuntu 20.04+)
- Domain: asdancz.in
- SSL Certificate (Let's Encrypt)

### Step 1: Build Production JAR

```bash
# Clean and build
cd backend
mvn clean package -DskipTests

# Output: backend/target/as-dance-backend-1.0.0.jar
```

### Step 2: Prepare VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Create app directory
mkdir -p /opt/as-dance
cd /opt/as-dance

# Create data directory for H2 database
mkdir -p data

# Create logs directory
mkdir -p logs
```

### Step 3: Upload JAR to VPS

```bash
# From local machine
scp backend/target/as-dance-backend-1.0.0.jar root@your-vps-ip:/opt/as-dance/
```

### Step 4: Create Systemd Service

```bash
# On VPS, create service file
sudo nano /etc/systemd/system/as-dance.service
```

Paste:
```ini
[Unit]
Description=AS DANCE Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/as-dance
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="RAZORPAY_KEY_ID=your_key_id"
Environment="RAZORPAY_KEY_SECRET=your_key_secret"
ExecStart=/usr/bin/java -jar as-dance-backend-1.0.0.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/opt/as-dance/logs/app.log
StandardError=append:/opt/as-dance/logs/error.log

[Install]
WantedBy=multi-user.target
```

### Step 5: Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable as-dance
sudo systemctl start as-dance

# Check status
sudo systemctl status as-dance

# View logs
tail -f /opt/as-dance/logs/app.log
```

### Step 6: Configure Nginx (Reverse Proxy + HTTPS)

```bash
sudo nano /etc/nginx/sites-available/asdancz.in
```

Paste:
```nginx
upstream as_dance_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name asdancz.in www.asdancz.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name asdancz.in www.asdancz.in;

    ssl_certificate /etc/letsencrypt/live/asdancz.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/asdancz.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 100M;

    location / {
        proxy_pass http://as_dance_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/asdancz.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d asdancz.in -d www.asdancz.in
```

Auto-renewal:
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## CONFIGURATION FILES

### application.properties (Base)
- Port: 8080
- Bind: 0.0.0.0
- Database: File-based H2 (./data/asdance.mv.db)
- CSRF: Disabled
- CORS: Disabled (same-origin only)
- All endpoints: Public (no auth required)

### application-dev.properties
- DevTools: Enabled (hot reload)
- H2 Console: Enabled
- Logging: DEBUG
- Payment: Mock mode

### application-prod.properties
- DevTools: Disabled
- H2 Console: Disabled
- Logging: WARN
- Payment: Real Razorpay (via env vars)
- Security headers: Enabled

---

## ENVIRONMENT VARIABLES (Production)

```bash
export SPRING_PROFILES_ACTIVE=prod
export RAZORPAY_KEY_ID=rzp_live_xxxxx
export RAZORPAY_KEY_SECRET=xxxxx
export APP_JWT_SECRET=your-secret-key
export APP_ALLOWED_EMAIL=admin@asdance.com
```

---

## FRONTEND API CALLS (Correct Usage)

### ✅ CORRECT (Relative Paths)
```javascript
// api.js
export function apiFetch(url, options = {}) {
  const relativeUrl = url.startsWith('/') ? url : `/${url}`;
  return fetch(relativeUrl, options);
}

// Usage in components
apiFetch('/api/health')
apiFetch('/api/payment/order', { method: 'POST', body: JSON.stringify(data) })
```

### ❌ WRONG (Hardcoded URLs)
```javascript
// DON'T DO THIS
fetch('http://localhost:8080/api/health')
fetch('http://72.61.248.167:8085/api/payment')
fetch('https://asdancz.in:8085/api/checkout')
```

---

## TROUBLESHOOTING

### Issue: Frontend not connecting to backend
**Solution:**
1. Check API calls use relative paths: `/api/...`
2. Verify backend is running: `curl http://localhost:8080/api/health`
3. Check browser console for CORS errors (should be none)
4. Verify frontend is served from `src/main/resources/static/`

### Issue: Mixed content (HTTPS/HTTP)
**Solution:**
1. Ensure Nginx redirects HTTP → HTTPS
2. Frontend never calls HTTP APIs
3. All API calls use relative paths (no protocol specified)

### Issue: Data lost after restart
**Solution:**
1. Verify database file exists: `ls -la /opt/as-dance/data/`
2. Check database URL in application.properties: `jdbc:h2:file:./data/asdance`
3. Ensure working directory is `/opt/as-dance` (systemd service)

### Issue: DevTools enabled in production
**Solution:**
1. Use `SPRING_PROFILES_ACTIVE=prod` environment variable
2. Verify `application-prod.properties` has `spring.devtools.restart.enabled=false`
3. Check systemd service sets correct profile

### Issue: Port 8080 already in use
**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

---

## HEALTH CHECK

```bash
# Local
curl http://localhost:8080/api/health

# Production
curl https://asdancz.in/api/health

# Expected response
{"status":"OK"}
```

---

## MONITORING

### View Logs
```bash
# Real-time
tail -f /opt/as-dance/logs/app.log

# Last 100 lines
tail -100 /opt/as-dance/logs/app.log

# Search for errors
grep ERROR /opt/as-dance/logs/app.log
```

### Check Service Status
```bash
sudo systemctl status as-dance
sudo systemctl restart as-dance
sudo systemctl stop as-dance
```

### Database Backup
```bash
# Backup H2 database
cp /opt/as-dance/data/asdance.mv.db /opt/as-dance/backups/asdance-$(date +%Y%m%d).mv.db
```

---

## PERFORMANCE OPTIMIZATION

1. **Gzip Compression**: Enabled in application.properties
2. **Static Asset Caching**: 1 year cache headers in production
3. **Database Indexing**: Add indexes to frequently queried columns
4. **Connection Pooling**: HikariCP (default in Spring Boot)
5. **CDN**: Optional - serve static assets from CDN

---

## SECURITY CHECKLIST

- [x] CSRF disabled (same-origin only)
- [x] CORS disabled (same-origin only)
- [x] DevTools disabled in production
- [x] H2 Console disabled in production
- [x] HTTPS enforced (Nginx redirect)
- [x] Security headers enabled (HSTS, X-Frame-Options)
- [x] All endpoints public (no sensitive data exposed)
- [x] Database file-based (persists across restarts)

---

## FINAL COMMANDS SUMMARY

```bash
# Local Development
cd frontend && npm install && npm run build:backend
cd ../backend && SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

# Production Build
cd backend && mvn clean package -DskipTests

# Production Deploy
scp backend/target/as-dance-backend-1.0.0.jar root@vps:/opt/as-dance/
ssh root@vps "sudo systemctl restart as-dance"

# Verify
curl https://asdancz.in/api/health
```

---

## SUPPORT

For issues, check:
1. Logs: `/opt/as-dance/logs/app.log`
2. Service status: `sudo systemctl status as-dance`
3. Port binding: `lsof -i :8080`
4. Database: `ls -la /opt/as-dance/data/`

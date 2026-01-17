# AS DANCE - Quick Reference Guide

## ONE-LINER COMMANDS

### Local Development (Full Stack)
```bash
cd frontend && npm install && npm run build:backend && cd ../backend && SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run
```

### Production Build
```bash
cd backend && mvn clean package -DskipTests
```

### Production Deploy to VPS
```bash
scp backend/target/as-dance-backend-1.0.0.jar root@your-vps-ip:/opt/as-dance/ && \
ssh root@your-vps-ip "sudo systemctl restart as-dance"
```

---

## FOLDER STRUCTURE

```
as_dance_full_project/
├── backend/
│   ├── src/main/
│   │   ├── java/com/asdance/
│   │   │   ├── security/SecurityConfig.java (✅ FIXED)
│   │   │   ├── web/HealthController.java (✅ FIXED)
│   │   │   └── ... (other controllers)
│   │   └── resources/
│   │       ├── application.properties (✅ FIXED - port 8080)
│   │       ├── application-dev.properties (✅ NEW)
│   │       ├── application-prod.properties (✅ NEW)
│   │       └── static/ (frontend build output)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── ui/
│   │   │   ├── api.js (✅ FIXED - relative paths)
│   │   │   ├── App.jsx
│   │   │   └── ... (components)
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── scripts/
│       └── sync-to-backend.mjs
└── PRODUCTION_DEPLOYMENT_GUIDE.md (✅ NEW)
```

---

## CONFIGURATION SUMMARY

| Setting | Dev | Prod |
|---------|-----|------|
| Port | 8080 | 8080 |
| Bind | 0.0.0.0 | 0.0.0.0 |
| DevTools | ✅ Enabled | ❌ Disabled |
| H2 Console | ✅ Enabled | ❌ Disabled |
| CSRF | ❌ Disabled | ❌ Disabled |
| CORS | ❌ Disabled | ❌ Disabled |
| Database | File-based H2 | File-based H2 |
| Payment | Mock | Real (env vars) |
| Logging | DEBUG | WARN |

---

## API ENDPOINTS

| Endpoint | Method | Auth | Response |
|----------|--------|------|----------|
| `/api/health` | GET | ❌ | `{"status":"OK"}` |
| `/api/payment/order` | POST | ❌ | Order details |
| `/api/payment/verify` | POST | ❌ | Verification result |
| `/api/payment/status` | GET | ❌ | Payment status |
| `/` | GET | ❌ | React SPA (index.html) |

---

## FRONTEND API CALLS

### Correct Usage (Relative Paths)
```javascript
// ✅ CORRECT
apiFetch('/api/health')
apiFetch('/api/payment/order', { 
  method: 'POST',
  body: JSON.stringify(data)
})

// ✅ ALSO CORRECT
fetch('/api/checkout')
fetch('/api/user/profile')
```

### Wrong Usage (Hardcoded URLs)
```javascript
// ❌ WRONG - Don't use localhost
fetch('http://localhost:8080/api/health')

// ❌ WRONG - Don't use IP
fetch('http://72.61.248.167:8085/api/payment')

// ❌ WRONG - Don't hardcode domain
fetch('https://asdancz.in:8085/api/checkout')

// ❌ WRONG - Don't use HTTP on HTTPS site
fetch('http://asdancz.in/api/data')
```

---

## ENVIRONMENT VARIABLES

### Development
```bash
SPRING_PROFILES_ACTIVE=dev
```

### Production
```bash
SPRING_PROFILES_ACTIVE=prod
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
APP_JWT_SECRET=your-secret-key
```

---

## BUILD COMMANDS

### Frontend Only
```bash
cd frontend
npm install          # Install dependencies
npm run build        # Build for production
npm run build:backend # Build + sync to backend
npm run dev          # Dev server (port 5173)
npm test             # Run tests
```

### Backend Only
```bash
cd backend
mvn clean            # Clean build artifacts
mvn compile          # Compile code
mvn test             # Run tests
mvn package          # Build JAR
mvn spring-boot:run  # Run locally
```

### Full Stack
```bash
# Development
cd frontend && npm run build:backend
cd ../backend && SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

# Production
cd backend && mvn clean package -DskipTests
# JAR: backend/target/as-dance-backend-1.0.0.jar
```

---

## DEPLOYMENT CHECKLIST

- [ ] Frontend built: `npm run build:backend`
- [ ] Backend JAR created: `mvn clean package -DskipTests`
- [ ] JAR uploaded to VPS: `/opt/as-dance/as-dance-backend-1.0.0.jar`
- [ ] Systemd service created: `/etc/systemd/system/as-dance.service`
- [ ] Service enabled: `sudo systemctl enable as-dance`
- [ ] Service started: `sudo systemctl start as-dance`
- [ ] Nginx configured: `/etc/nginx/sites-available/asdancz.in`
- [ ] SSL certificate installed: Let's Encrypt
- [ ] Health check passing: `curl https://asdancz.in/api/health`
- [ ] Frontend loads: `https://asdancz.in`
- [ ] API responds: `https://asdancz.in/api/payment/status`

---

## TROUBLESHOOTING

### Frontend not loading
```bash
# Check if backend is running
curl http://localhost:8080/api/health

# Check if static files exist
ls -la backend/src/main/resources/static/

# Rebuild frontend
cd frontend && npm run build:backend
```

### API calls failing
```bash
# Check API endpoint
curl http://localhost:8080/api/health

# Check browser console for errors
# Verify API calls use relative paths: /api/...
# NOT http://localhost:8080/api/...
```

### Port already in use
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Database not persisting
```bash
# Check database file
ls -la ./data/asdance.mv.db

# Verify database URL
grep "spring.datasource.url" backend/src/main/resources/application.properties
# Should be: jdbc:h2:file:./data/asdance
```

### DevTools enabled in production
```bash
# Check active profile
curl http://localhost:8080/actuator/env | grep spring.profiles.active

# Should show: "prod"
# If not, set: SPRING_PROFILES_ACTIVE=prod
```

---

## MONITORING

### View Logs
```bash
# Real-time
tail -f /opt/as-dance/logs/app.log

# Last 50 lines
tail -50 /opt/as-dance/logs/app.log

# Search for errors
grep ERROR /opt/as-dance/logs/app.log
```

### Service Status
```bash
sudo systemctl status as-dance
sudo systemctl restart as-dance
sudo systemctl stop as-dance
```

### Database Backup
```bash
cp ./data/asdance.mv.db ./backups/asdance-$(date +%Y%m%d).mv.db
```

---

## SECURITY CHECKLIST

- [x] CSRF disabled (same-origin only)
- [x] CORS disabled (same-origin only)
- [x] DevTools disabled in production
- [x] H2 Console disabled in production
- [x] HTTPS enforced (Nginx redirect)
- [x] All endpoints public (no auth required)
- [x] Database file-based (persists)
- [x] No hardcoded credentials in code

---

## USEFUL LINKS

- GitHub: https://github.com/aswin3112/as-dance-full-project
- Domain: https://asdancz.in
- Local Dev: http://localhost:8080
- Health Check: http://localhost:8080/api/health
- H2 Console (dev): http://localhost:8080/h2-console

---

## SUPPORT CONTACTS

- WhatsApp: https://wa.me/918825602356
- Email: businessaswin@gmail.com
- Admin: admin@asdance.com

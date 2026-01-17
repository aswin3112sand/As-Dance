# AS DANCE Production Fixes – Implementation Guide

## Overview
This guide covers all fixes needed to resolve:
1. ✅ Backend API connectivity issues
2. ✅ CORS configuration
3. ✅ HTTPS/SSL setup
4. ✅ Mixed content warnings
5. ✅ Review section UI layout issues
6. ✅ Floating toggle z-index problem
7. ✅ Smooth auto-scroll animation

---

## PART 1: BACKEND FIXES

### Step 1.1: Verify CORS Configuration

Your `SecurityConfig.java` is already correct. It includes:
- ✅ Pattern-based origin matching
- ✅ All required HTTP methods
- ✅ Credentials support
- ✅ Wildcard header support

**No changes needed** – CORS is production-ready.

### Step 1.2: Verify Health Endpoint

Your `HealthController.java` already has `/api/health` endpoint.

Test locally:
```bash
curl http://localhost:8085/api/health
# Response: {"ok":true,"service":"as-dance","port":8085}
```

### Step 1.3: Update application.properties for Production

**File:** `backend/src/main/resources/application.properties`

Change these lines:
```properties
# Change port for production
server.port=8080

# Ensure CORS includes your domain
app.cors.allowedOriginPatterns=https://asdancz.in,https://www.asdancz.in,http://localhost:*

# Enable production profile
spring.profiles.active=prod

# Disable dev tools in production
spring.devtools.restart.enabled=false
spring.devtools.livereload.enabled=false

# Enable caching for static assets
spring.web.resources.cache.period=31536000
spring.web.resources.chain.cache=true

# Payment configuration
app.payment.mock=false
app.razorpay.keyId=YOUR_RAZORPAY_KEY_ID
app.razorpay.keySecret=YOUR_RAZORPAY_KEY_SECRET
```

### Step 1.4: Build Backend JAR

```bash
cd backend
mvn clean package -DskipTests
# Output: target/as-dance-backend-1.0.0.jar
```

---

## PART 2: FRONTEND FIXES

### Step 2.1: Create Environment Configuration

**File:** `frontend/.env`

```env
VITE_API_URL=https://asdancz.in
```

**For local development, create `frontend/.env.local`:**
```env
VITE_API_URL=http://localhost:8085
```

### Step 2.2: Update API Configuration

**File:** `frontend/src/ui/api.js`

Replace entire file with:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://asdancz.in';

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const opts = { credentials: 'include', ...options };
  const method = (opts.method || 'GET').toUpperCase();
  
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      opts.headers = { ...(opts.headers || {}), 'X-XSRF-TOKEN': token };
    }
  }
  
  return fetch(fullUrl, opts);
}

export async function apiCall(url, options = {}) {
  try {
    const response = await apiFetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

**Key improvements:**
- ✅ Uses environment variable for API URL
- ✅ Supports both relative and absolute URLs
- ✅ Includes error handling
- ✅ Maintains XSRF token support

### Step 2.3: Update API Calls in Components

**Example in `frontend/src/ui/pages/Login.jsx`:**

Before:
```javascript
const response = await fetch('http://localhost:8085/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
```

After:
```javascript
import { apiCall } from '../api.js';

const response = await apiCall('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
```

**Apply this pattern to all API calls in:**
- `frontend/src/ui/pages/Login.jsx`
- `frontend/src/ui/pages/Register.jsx`
- `frontend/src/ui/pages/Checkout.jsx`
- `frontend/src/ui/pages/Dashboard.jsx`
- Any other component making API calls

### Step 2.4: Fix Review Section Toggle Button

**File:** `frontend/src/ui/components/ReviewLoop.jsx`

Find the `.review-controls` CSS section (around line 280) and replace with:

```css
.review-controls {
  flex-shrink: 0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  position: relative;
  z-index: 10;
}

.review-control {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(40px, 10vw, 48px);
  height: clamp(40px, 10vw, 48px);
  background: rgba(0, 242, 234, 0.1);
  border: 1.5px solid rgba(0, 242, 234, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), 
              background 0.2s ease, 
              color 0.2s ease;
  color: rgba(0, 242, 234, 0.8);
  font-size: clamp(0.95rem, 2.5vw, 1.2rem);
  font-weight: 700;
  box-shadow: 0 0 16px rgba(0, 242, 234, 0.1);
  will-change: transform, box-shadow, background;
  padding: 0;
  position: relative;
  z-index: 10;
}

.review-control:hover {
  background: rgba(0, 242, 234, 0.2);
  border-color: rgba(0, 242, 234, 0.6);
  color: rgba(0, 242, 234, 1);
  box-shadow: 0 0 24px rgba(0, 242, 234, 0.3);
  transform: translateY(-1px);
}

.review-control:active {
  transform: translateY(1px);
}

.review-control.active {
  background: rgba(0, 242, 234, 0.25);
  border-color: rgba(0, 242, 234, 0.8);
  color: rgba(0, 242, 234, 1);
  box-shadow: 0 0 32px rgba(0, 242, 234, 0.4);
}
```

**What this fixes:**
- ✅ Adds `z-index: 10` to prevent floating
- ✅ Adds `position: relative` for proper stacking context
- ✅ Ensures button stays visible and clickable

### Step 2.5: Add Smooth Auto-Scroll Animation

**In the same ReviewLoop.jsx file, find the `@keyframes reviewMarquee` section and update:**

```css
@keyframes reviewMarquee {
  from { 
    transform: translateX(0); 
  }
  to { 
    transform: translateX(-50%); 
  }
}

.review-track.is-animating {
  animation: reviewMarquee 70s linear infinite;
  animation-timing-function: linear;
}

/* Pause on hover for premium feel */
.review-scroller:hover .review-track.is-animating {
  animation-play-state: paused;
}
```

**What this adds:**
- ✅ Smooth linear animation (70s duration)
- ✅ Pause on hover for better UX
- ✅ Premium feel with consistent motion

### Step 2.6: Build Frontend

```bash
cd frontend
npm install
npm run build
# Output: dist/ folder ready for deployment
```

---

## PART 3: HTTPS & NGINX SETUP

### Step 3.1: Install Nginx & Certbot on VPS

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 3.2: Create Nginx Configuration

**File:** `/etc/nginx/sites-available/asdancz.in`

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name asdancz.in www.asdancz.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name asdancz.in www.asdancz.in;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/asdancz.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/asdancz.in/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/json;

    # Logging
    access_log /var/log/nginx/asdancz.in_access.log;
    error_log /var/log/nginx/asdancz.in_error.log;

    # Proxy to backend
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

### Step 3.3: Enable Nginx Configuration

```bash
sudo ln -s /etc/nginx/sites-available/asdancz.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 3.4: Get SSL Certificate

```bash
sudo certbot certonly --nginx -d asdancz.in -d www.asdancz.in
sudo systemctl restart nginx
```

### Step 3.5: Auto-Renew SSL

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## PART 4: FIREWALL CONFIGURATION

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

---

## PART 5: DEPLOYMENT

### Backend Deployment

```bash
# Build
cd backend
mvn clean package -DskipTests

# Upload to VPS
scp target/as-dance-backend-1.0.0.jar user@vps:/opt/as-dance/

# SSH into VPS and setup systemd
ssh user@vps

# Create systemd service
sudo tee /etc/systemd/system/as-dance.service > /dev/null << 'EOF'
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
EOF

sudo systemctl daemon-reload
sudo systemctl enable as-dance
sudo systemctl start as-dance
```

### Frontend Deployment

```bash
# Build
cd frontend
npm install
npm run build

# Upload dist/ to Hostinger/Render
# (Use their deployment interface or FTP)
```

---

## PART 6: VERIFICATION

### Test Health Endpoint
```bash
curl https://asdancz.in/api/health
# Expected: {"ok":true,"service":"as-dance","port":8085}
```

### Test CORS
```bash
curl -H "Origin: https://asdancz.in" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://asdancz.in/api/health -v
```

### Test SSL
```bash
curl -I https://asdancz.in
# Should show: HTTP/2 200
```

### Check Browser Console
1. Open https://asdancz.in
2. Press F12 → Console
3. Should see no CORS errors
4. Should see no mixed content warnings

---

## TROUBLESHOOTING

### "Mixed Content" Warning
- Ensure all API calls use `https://`
- Check `.env` has `VITE_API_URL=https://asdancz.in`
- Verify all image URLs use HTTPS

### CORS Errors
- Check `app.cors.allowedOriginPatterns` in `application.properties`
- Ensure domain is listed: `https://asdancz.in`
- Restart backend after changes

### SSL Certificate Issues
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

### Backend Not Responding
```bash
# Check service status
sudo systemctl status as-dance

# View logs
sudo tail -f /var/log/as-dance/app.log

# Restart service
sudo systemctl restart as-dance
```

---

## Summary Checklist

- [ ] Backend CORS configured
- [ ] Backend built and deployed
- [ ] Frontend `.env` created with `VITE_API_URL`
- [ ] Frontend API calls updated
- [ ] ReviewLoop CSS fixed (z-index, animation)
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall rules set
- [ ] Health endpoint tested
- [ ] CORS tested
- [ ] SSL tested
- [ ] No console errors
- [ ] No mixed content warnings

---

## Support
- Health: `https://asdancz.in/api/health`
- Logs: `ssh user@vps tail -f /var/log/as-dance/app.log`
- WhatsApp: https://wa.me/918825602356

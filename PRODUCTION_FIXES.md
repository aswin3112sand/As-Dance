# Production Fixes for AS DANCE – Complete Guide

## BACKEND FIXES (Spring Boot)

### 1. CORS Configuration (Already Correct)
Your `SecurityConfig.java` is already properly configured. Verify it includes:
- ✅ Frontend domain: `https://asdancz.in`
- ✅ Methods: GET, POST, PUT, DELETE, OPTIONS
- ✅ Credentials: Enabled
- ✅ Pattern matching for localhost dev

**Current config in `application.properties`:**
```properties
app.cors.allowedOriginPatterns=http://localhost:*,http://127.0.0.1:*,http://72.61.248.167:*,https://asdancz.in,https://www.asdancz.in
```

### 2. Health Check Endpoint
Your `/api/health` endpoint is already implemented in `HealthController.java`.

Test it:
```bash
curl https://asdancz.in/api/health
# Expected response: {"ok":true,"service":"as-dance","port":8085}
```

### 3. Port Configuration
Backend runs on port **8085** (configured in `application.properties`).

For production on VPS:
```properties
server.port=8080
server.address=0.0.0.0
```

### 4. HTTPS Setup with Nginx + Let's Encrypt

**On your VPS, install Nginx:**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

**Create Nginx config at `/etc/nginx/sites-available/asdancz.in`:**
```nginx
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

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
    }

    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable and get SSL certificate:**
```bash
sudo ln -s /etc/nginx/sites-available/asdancz.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot certonly --nginx -d asdancz.in -d www.asdancz.in
sudo systemctl restart nginx
```

**Auto-renew SSL:**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 5. Firewall Rules (UFW)
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

---

## FRONTEND FIXES (React)

### 1. Environment-Based API URL

**Create `.env` file in `frontend/` directory:**
```env
VITE_API_URL=https://asdancz.in
```

**For local dev:**
```env
VITE_API_URL=http://localhost:8085
```

### 2. Update `frontend/src/ui/api.js`

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

### 3. Update API calls in components

**Example in `frontend/src/ui/pages/Login.jsx`:**
```javascript
import { apiCall } from '../api.js';

// Replace fetch calls with:
const response = await apiCall('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
```

### 4. Fix Review Section Toggle Button

**Update `frontend/src/ui/components/ReviewLoop.jsx`:**

Replace the `.review-controls` CSS section (around line 280) with:
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

### 5. Add Smooth Auto-Scroll Animation

**Add to ReviewLoop.jsx CSS (after `.review-track.is-animating` rule):**
```css
@keyframes reviewMarquee {
  from { 
    transform: translateX(0); 
  }
  to { 
    transform: translateX(-50%); 
  }
}

/* Smooth easing for premium feel */
.review-track.is-animating {
  animation: reviewMarquee 70s linear infinite;
  animation-timing-function: linear;
}

/* Pause on hover for better UX */
.review-scroller:hover .review-track.is-animating {
  animation-play-state: paused;
}
```

---

## DEPLOYMENT CHECKLIST

### Backend (VPS)
- [ ] Update `application.properties` with production settings
- [ ] Set `app.payment.mock=false` and add Razorpay keys
- [ ] Configure Nginx reverse proxy
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Set firewall rules
- [ ] Run: `mvn clean package` → deploy JAR
- [ ] Test: `curl https://asdancz.in/api/health`

### Frontend (Hostinger/Render)
- [ ] Create `.env` with `VITE_API_URL=https://asdancz.in`
- [ ] Run: `npm run build:backend` (if syncing to backend)
- [ ] Or: `npm run build` for standalone deployment
- [ ] Deploy `dist/` folder
- [ ] Test: Open https://asdancz.in in browser
- [ ] Check console for API errors

### Verification
```bash
# Test CORS
curl -H "Origin: https://asdancz.in" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://asdancz.in/api/health -v

# Test API
curl https://asdancz.in/api/health

# Test WebSocket (if used)
wscat -c wss://asdancz.in/ws
```

---

## Mixed Content Fix

If you see "Not Secure" warnings:

1. **Ensure all resources use HTTPS:**
   - Images: `https://...` not `http://...`
   - API calls: Use `VITE_API_URL` env var
   - External scripts: Use HTTPS versions

2. **Update `frontend/index.html`:**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="upgrade-insecure-requests">
   ```

3. **Nginx header:**
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   ```

---

## Quick Commands

**Build & Deploy Backend:**
```bash
cd backend
mvn clean package
scp target/as-dance-backend-1.0.0.jar user@vps:/opt/app/
ssh user@vps "systemctl restart as-dance"
```

**Build & Deploy Frontend:**
```bash
cd frontend
npm install
npm run build
# Upload dist/ to Hostinger/Render
```

**Monitor Backend Logs:**
```bash
ssh user@vps "tail -f /var/log/as-dance/app.log"
```

---

## Support
- Health check: `https://asdancz.in/api/health`
- Admin panel: `https://asdancz.in/admin`
- WhatsApp: https://wa.me/918825602356

# AS DANCE Production Fixes – File Changes Summary

## Files to Modify

### 1. BACKEND: application.properties
**Path:** `backend/src/main/resources/application.properties`

**Changes:**
- Change `server.port=8085` → `server.port=8080`
- Update `app.cors.allowedOriginPatterns` to include production domain
- Add production profile settings
- Disable dev tools for production

**Current lines to update:**
```properties
# Line 1: Change port
server.port=8080

# Line 5: Update CORS
app.cors.allowedOriginPatterns=https://asdancz.in,https://www.asdancz.in,http://localhost:*

# Add after line 5:
spring.profiles.active=prod
spring.devtools.restart.enabled=false
spring.devtools.livereload.enabled=false
spring.web.resources.cache.period=31536000
spring.web.resources.chain.cache=true

# Update payment section:
app.payment.mock=false
app.razorpay.keyId=YOUR_RAZORPAY_KEY_ID
app.razorpay.keySecret=YOUR_RAZORPAY_KEY_SECRET
```

---

### 2. FRONTEND: Create .env file
**Path:** `frontend/.env`

**Content:**
```env
VITE_API_URL=https://asdancz.in
```

**For local development, create:** `frontend/.env.local`
```env
VITE_API_URL=http://localhost:8085
```

---

### 3. FRONTEND: Update api.js
**Path:** `frontend/src/ui/api.js`

**Replace entire file with:**
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

---

### 4. FRONTEND: Update all API calls in components

**Files to update:**
- `frontend/src/ui/pages/Login.jsx`
- `frontend/src/ui/pages/Register.jsx`
- `frontend/src/ui/pages/Checkout.jsx`
- `frontend/src/ui/pages/Dashboard.jsx`
- `frontend/src/ui/pages/Admin.jsx`
- Any other component making API calls

**Pattern to replace:**
```javascript
// Before
const response = await fetch('http://localhost:8085/api/...', {...});

// After
import { apiCall } from '../api.js';
const response = await apiCall('/api/...', {...});
```

**Example for Login.jsx:**
```javascript
// Add import at top
import { apiCall } from '../api.js';

// Replace fetch calls
// Before:
const response = await fetch('http://localhost:8085/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});

// After:
const response = await apiCall('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
```

---

### 5. FRONTEND: Fix ReviewLoop.jsx CSS

**Path:** `frontend/src/ui/components/ReviewLoop.jsx`

**Find and replace the `.review-controls` CSS section (around line 280):**

**Old CSS:**
```css
.review-controls {
  flex-shrink: 0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
```

**New CSS:**
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

**Also update the animation section:**

**Old:**
```css
@keyframes reviewMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.review-track.is-animating {
  animation: reviewMarquee 70s linear infinite;
}
```

**New:**
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

---

## Files to Create (New)

### 1. Nginx Configuration
**Path:** `/etc/nginx/sites-available/asdancz.in` (on VPS)

See `nginx-asdancz.in.conf` in project root for full content.

---

### 2. Systemd Service
**Path:** `/etc/systemd/system/as-dance.service` (on VPS)

See `QUICK_REFERENCE.md` for full content.

---

## Build & Deploy Steps

### 1. Build Backend
```bash
cd backend
mvn clean package -DskipTests
# Output: target/as-dance-backend-1.0.0.jar
```

### 2. Build Frontend
```bash
cd frontend
npm install
npm run build
# Output: dist/ folder
```

### 3. Deploy Backend
```bash
# Copy JAR to VPS
scp backend/target/as-dance-backend-1.0.0.jar user@vps:/opt/as-dance/

# SSH into VPS and restart
ssh user@vps "sudo systemctl restart as-dance"
```

### 4. Deploy Frontend
```bash
# Upload dist/ folder to Hostinger/Render
# (Use their deployment interface)
```

---

## Verification

### Test Backend
```bash
curl https://asdancz.in/api/health
# Expected: {"ok":true,"service":"as-dance","port":8085}
```

### Test Frontend
1. Open https://asdancz.in in browser
2. Press F12 → Console
3. Should see no errors
4. Should see no mixed content warnings

### Test CORS
```bash
curl -H "Origin: https://asdancz.in" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://asdancz.in/api/health -v
```

---

## Summary

**Total files to modify:** 6
- 1 backend config file
- 4 frontend files (1 new .env, 1 api.js, 2+ component files)
- 1 new Nginx config (on VPS)

**Total files to create:** 2
- `.env` file
- Nginx config

**Estimated time:** 30-45 minutes for all changes + deployment

---

## Support
- See `IMPLEMENTATION_GUIDE.md` for detailed step-by-step instructions
- See `QUICK_REFERENCE.md` for copy-paste code snippets
- See `PRODUCTION_FIXES.md` for comprehensive overview

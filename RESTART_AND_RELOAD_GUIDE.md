# AS DANCE - Server Restart & Cache Clear Guide

## 🔴 CRITICAL: Cache Issues? Follow This

### Step 1: Verify Cache Properties (Already Set ✓)

Your `application.properties` already has:
```properties
spring.thymeleaf.cache=false
spring.web.resources.cache.period=0
spring.web.resources.chain.cache=false
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

✅ **Status**: Cache disabled. No changes needed.

---

## 🔄 Server Restart (Compulsory After Backend Code Change)

### Option 1: Maven Command Line (Recommended)

```bash
# Terminal in backend folder
cd backend

# Stop current server
# Press: Ctrl+C

# Restart
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

**Wait for**: `Started Application in X.XXX seconds`

### Option 2: IDE Restart (IntelliJ / VS Code)

- **IntelliJ**: Click ⏹️ Stop → ▶️ Run
- **VS Code**: Ctrl+C in terminal → `mvn spring-boot:run`

---

## 🌐 Browser Hard Reload (Compulsory After CSS/JS/Image Change)

### Option 1: Keyboard Shortcut (Fastest)
```
Windows/Linux: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

### Option 2: DevTools Cache Clear

1. Open DevTools: `F12`
2. Right-click refresh button → **"Empty cache and hard reload"**
3. Wait for page to fully load

### Option 3: Manual Cache Clear
1. Open DevTools: `F12`
2. Go to **Application** tab
3. Click **Clear site data** (top-left)
4. Check: ✓ Cookies, ✓ Cache Storage, ✓ Local Storage
5. Click **Clear**
6. Refresh: `Ctrl+R`

---

## ✅ Verification Checklist

### 1. Confirm Static Files Location
```
backend/src/main/resources/static/
├── index.html
├── assets/
│   ├── index-XXXXX.css  ← Your styles
│   └── index-XXXXX.js   ← Your scripts
└── favicon.ico
```

**Check**: After `npm run build:backend`, files should be here.

### 2. Verify Server Serving Static Files

Open DevTools (F12) → **Network** tab → Refresh

Look for:
- ✅ `index.html` - Status 200
- ✅ `index-XXXXX.css` - Status 200
- ✅ `index-XXXXX.js` - Status 200

**If Status 304**: Browser cache hit (do hard reload)
**If Status 404**: Files not synced (rebuild frontend)

### 3. Check Response Headers

In DevTools → **Network** → Click CSS file → **Headers** tab

Look for:
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

✅ **Good**: Cache headers present
❌ **Bad**: Missing headers (restart server)

---

## 🚀 Complete Workflow (CSS/JS Changes)

### 1. Edit Frontend Code
```bash
# Edit: frontend/src/ui/styles.css
# Or: frontend/src/ui/components/ReviewLoop.jsx
```

### 2. Rebuild Frontend
```bash
cd frontend
npm run build:backend
cd ..
```

**Wait for**: `Synced ... -> backend/src/main/resources/static/`

### 3. Restart Backend Server
```bash
cd backend
# Press: Ctrl+C (stop current)
# Then: mvn spring-boot:run
```

**Wait for**: `Started Application in X.XXX seconds`

### 4. Hard Reload Browser
```
Ctrl+Shift+R  (or Cmd+Shift+R on Mac)
```

**Result**: Changes visible ✅

---

## 🔧 Troubleshooting

### Problem: CSS/JS Changes Not Showing

**Solution 1**: Hard Reload
```
Ctrl+Shift+R
```

**Solution 2**: Clear Cache + Reload
```
F12 → Right-click refresh → "Empty cache and hard reload"
```

**Solution 3**: Verify Files Synced
```bash
# Check if files exist in backend static folder
dir backend\src\main\resources\static\assets\
```

If empty → Rebuild frontend:
```bash
cd frontend
npm run build:backend
```

**Solution 4**: Restart Server
```bash
cd backend
Ctrl+C
mvn spring-boot:run
```

### Problem: 404 on CSS/JS Files

**Cause**: Frontend not built or not synced

**Fix**:
```bash
cd frontend
npm install
npm run build:backend
cd ..
cd backend
Ctrl+C
mvn spring-boot:run
```

### Problem: Port 8086 Already in Use

```bash
# Find process on port 8086
netstat -ano | findstr :8086

# Kill it (replace XXXX with PID)
taskkill /PID XXXX /F

# Restart server
mvn spring-boot:run
```

---

## 📋 Quick Reference

| Action | Command | Wait For |
|--------|---------|----------|
| Edit CSS/JS | Edit file | - |
| Rebuild Frontend | `cd frontend && npm run build:backend` | "Synced" message |
| Restart Server | `cd backend && Ctrl+C && mvn spring-boot:run` | "Started Application" |
| Hard Reload Browser | `Ctrl+Shift+R` | Page loads |

---

## 🎯 Pro Tips

✅ **Always restart server after backend code change**
✅ **Always hard reload after CSS/JS/image change**
✅ **Cache disabled in dev mode** (no manual config needed)
✅ **DevTools Network tab** shows if cache is working
✅ **Status 304** = Browser cache (hard reload fixes it)
✅ **Status 200** = Fresh from server (good)

---

## 📍 Current Setup

- **Backend Port**: 8086
- **URL**: http://localhost:8086
- **Dev Mode**: ✅ Enabled
- **Cache**: ✅ Disabled
- **Hot Reload**: ✅ Enabled
- **Static Files**: `backend/src/main/resources/static/`

**Everything is configured. Just restart + hard reload!**

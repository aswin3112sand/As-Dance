# 🚀 Quick Start - Neon Banner with Hot Reload

## Configuration Applied ✅

```properties
# Disable cache for Thymeleaf (important)
spring.thymeleaf.cache=false

# Disable cache for static assets
spring.web.resources.cache.period=0
spring.web.resources.chain.cache=false

# Enable devtools for hot reload
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

---

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

**Expected Output**:
```
Tomcat initialized with port 8085 (http)
Adding welcome page: class path resource [static/index.html]
```

---

## Open Browser

```
http://localhost:8085
```

**Hard Refresh** (bypass cache):
- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

---

## See Neon Banner ✨

- Deep navy-black gradient background
- Neon purple/blue corner glow
- Subtle fog/smoke depth effects
- 3D LED studio reflection
- All text preserved

---

## Hot Reload Workflow

### Edit CSS
```bash
# Edit: frontend/src/ui/neon-styles.css
# Change colors, animations, opacity, etc.
```

### Build & Sync
```bash
cd frontend
npm run build:backend
```

### Refresh Browser
```
Ctrl+Shift+R
```

**Result**: Changes reflect instantly! ⚡

---

## Troubleshooting

### Port 8085 Already in Use
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8085).OwningProcess | Stop-Process -Force
```

### CSS Not Updating
1. Hard refresh: `Ctrl+Shift+R`
2. Clear cache: DevTools → Storage → Clear All
3. Rebuild: `npm run build:backend`

---

**Status**: ✅ Ready to deploy

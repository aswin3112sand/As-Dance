# AS DANCE - Run Updated Styles

## Quick Start (Updated Styles Visible)

### Option 1: Full Build (First Time)
```bash
Double-click: build-and-run.bat
```
- Rebuilds frontend with all updated styles
- Syncs to backend static folder
- Runs backend on http://localhost:8085

### Option 2: Fast Rebuild (After Style Changes)
```bash
Double-click: fast-rebuild.bat
```
- Quick rebuild (no npm install)
- Syncs updated files
- Runs backend

### Option 3: Manual Steps
```bash
# Build frontend with updated styles
cd frontend
npm run build:backend
cd ..

# Run backend
cd backend
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

Then open: **http://localhost:8085**

---

## What Gets Updated
✅ Banner strip background (Sky-Blue gradient + neon accents)
✅ Smoke/fog particle effects
✅ Grid overlay pattern
✅ Review section styling
✅ All CSS animations

## Browser Access
- **URL**: http://localhost:8085
- **Port**: 8085 (single port for UI + API)
- **Dev Mode**: Enabled (hot reload ready)

## Troubleshooting

**Styles not updating?**
1. Hard refresh browser: `Ctrl+Shift+Delete` (clear cache)
2. Or: `Ctrl+F5` (force refresh)

**Build fails?**
```bash
cd frontend
rm -r node_modules dist
npm install
npm run build:backend
```

**Port 8085 in use?**
```bash
netstat -ano | findstr :8085
taskkill /PID <PID> /F
```

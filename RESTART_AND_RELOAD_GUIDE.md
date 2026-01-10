# AS DANCE - Restart and Reload Guide (Minimal)

## Quick workflow (most cases)

### Frontend changes (CSS/JS/images)

1) Build and sync to backend
```bash
cd frontend
npm run build:backend
```

2) Restart backend
```bash
cd ../backend
# Ctrl+C to stop current server
mvn spring-boot:run
```

3) Hard reload browser
```
Windows/Linux: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

### Backend changes
```bash
cd backend
# Ctrl+C to stop current server
mvn spring-boot:run
```

---

## Verify when changes do not appear

1) Static files exist
```
backend/src/main/resources/static/
```
Expect `index.html` and `assets/index-*.css` / `assets/index-*.js`.

2) DevTools Network tab
- `index.html`, `index-*.css`, `index-*.js` should be 200
- 304 means cache; do a hard reload
- 404 means build did not sync; rebuild frontend

---

## Cache config (already set)

```properties
spring.thymeleaf.cache=false
spring.web.resources.cache.period=0
spring.web.resources.chain.cache=false
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

---

## Troubleshooting (short)

- 404 on CSS/JS: run `npm run build:backend`, then restart backend.
- Port 8085 in use:
```bash
netstat -ano | findstr :8085
taskkill /PID XXXX /F
```
- Still seeing old UI: DevTools -> Application -> Clear site data -> hard reload.

---

## Current setup

- URL: http://localhost:8085
- Static output: `backend/src/main/resources/static/`
- Dev mode: cache disabled

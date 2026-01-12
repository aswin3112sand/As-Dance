# Spring Boot DevTools Live Reload Setup

## ✅ Already Configured

DevTools is already enabled in `application.properties`:
```properties
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
spring.web.resources.cache.period=0
spring.web.resources.chain.cache=false
```

## 🚀 Run with Live Reload

### Option 1: Backend Only (Recommended for CSS/Static Changes)
```bash
cd backend
mvn spring-boot:run
```
- Open: http://localhost:8085
- Changes to static files (CSS, HTML, JS) auto-reload
- No need to restart

### Option 2: Frontend + Backend Dev Mode (For React Changes)
```bash
# Terminal 1 - Frontend dev server
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run
```
- Frontend: http://localhost:5173 (hot reload)
- Backend: http://localhost:8085

### Option 3: Full Build & Run
```bash
cd frontend
npm run build:backend

cd backend
mvn spring-boot:run
```

## 🔄 How It Works

1. **DevTools watches** for changes in:
   - `src/main/resources/static/` (CSS, JS, images)
   - `src/main/resources/templates/` (HTML)
   - Java source files (auto-restart)

2. **LiveReload** automatically refreshes browser when files change

3. **No manual restart needed** - just save and refresh browser

## 💡 Tips

- **Hard refresh** if changes don't appear: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Check console** for any errors during reload
- **CSS changes** appear instantly without page reload
- **Java changes** trigger automatic restart (takes 2-3 seconds)

## ✨ What's Enabled

✅ Static file caching disabled  
✅ Thymeleaf caching disabled  
✅ DevTools restart enabled  
✅ LiveReload enabled  
✅ Gzip compression enabled  

**You're all set! Just run and code!** 🎉

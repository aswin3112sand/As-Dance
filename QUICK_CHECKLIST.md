# ⚡ Quick Checklist - CSS/JS Changes

## After Frontend Changes (CSS/JS/Images)

- [ ] Edit file in `frontend/src/ui/`
- [ ] Run: `cd frontend && npm run build:backend`
- [ ] Wait for: "Synced ... -> backend/src/main/resources/static/"
- [ ] Restart server: `cd backend && Ctrl+C && mvn spring-boot:run`
- [ ] Wait for: "Started Application in X.XXX seconds"
- [ ] Hard reload browser: `Ctrl+Shift+R`
- [ ] Verify in DevTools (F12) → Network tab → CSS/JS Status 200

## Cache Properties ✅ Already Set

```properties
spring.thymeleaf.cache=false
spring.web.resources.cache.period=0
spring.web.resources.chain.cache=false
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

**Location**: `backend/src/main/resources/application.properties`

## Server Details

- **Port**: 8086
- **URL**: http://localhost:8086
- **Dev Mode**: ✅ Enabled
- **Cache**: ✅ Disabled

## If Changes Not Showing

1. Hard reload: `Ctrl+Shift+R`
2. Clear cache: `F12 → Right-click refresh → Empty cache and hard reload`
3. Restart server: `Ctrl+C` then `mvn spring-boot:run`
4. Verify files synced: `dir backend\src\main\resources\static\assets\`

---

**Read full guide**: `RESTART_AND_RELOAD_GUIDE.md`

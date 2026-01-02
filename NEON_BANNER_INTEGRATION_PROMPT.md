# AS DANCE Premium Neon Cinematic Banner Integration Prompt

**For: Gemini 3 Pro / Claude Sonnet 4.5**

---

## OBJECTIVE
Apply a premium neon cinematic background to the AS DANCE BannerStrip component without modifying text content, structure, or component name. Ensure full-stack auto-reflect workflow with instant frontend-to-backend UI rendering.

---

## REQUIREMENTS

### Visual Design
- **Background Theme**: Deep dark navy-black gradient + neon purple/blue corner glow + low sky haze opacity + realistic studio smoke/fog depth
- **3D Depth Lighting**: Subtle 3D depth lighting behind dancer circle and hill area for LED studio reflection feel
- **Text Preservation**: Keep all banner text exactly the same:
  - "639-Step Premium Neon Dance Curriculum" (title)
  - All sub-text, stats, pills, badges, pricing, tagline
- **Layout Integrity**: Fixed-width responsive layout—never collapse, maintain structure
- **No Content Changes**: Only background theme, lighting, and depth effects

### Technical Stack
- **Frontend**: React (BannerStrip.jsx) + GSAP animations + CSS (neon-styles.css, styles.css)
- **Backend**: Spring Boot + Thymeleaf (serves static assets from `backend/src/main/resources/static/`)
- **Build Pipeline**: Vite (frontend) → sync to backend static folder
- **Development Mode**: Spring DevTools + no-cache headers

### Full-Stack Auto-Reflect Requirements
1. **Disable Aggressive Caching**
   - Set `spring.thymeleaf.cache=false` in `application.properties`
   - Add no-cache headers for banner background assets
   - Ensure static resources bypass browser cache during dev

2. **Enable Hot Reload**
   - Spring Boot DevTools auto-restart on file changes
   - Frontend CSS/JS changes trigger rebuild via Vite
   - Browser refresh fetches latest UI without delay

3. **Instant Sync Workflow**
   - `npm run build:backend` syncs React dist → backend static folder
   - Backend serves updated UI on next request
   - No manual file copying required

4. **Browser Refresh Behavior**
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) fetches updated assets
   - No stale cache interference
   - Updated banner background renders immediately

---

## IMPLEMENTATION SCOPE

### Files to Modify
1. **frontend/src/ui/components/BannerStrip.jsx**
   - Keep component structure intact
   - Add CSS classes for neon background effects
   - Preserve all text content and GSAP animations

2. **frontend/src/ui/neon-styles.css**
   - Add `.banner-strip-neon-cinematic` class with:
     - Deep navy-black gradient base
     - Neon purple/blue corner glow
     - Low-opacity sky haze
     - Realistic studio smoke/fog depth
     - 3D depth lighting behind dancer circle
     - LED studio reflection feel

3. **frontend/src/ui/styles.css**
   - Add supporting keyframes for fog drift, glow pulse, depth effects
   - Ensure no conflicts with existing banner styles

4. **backend/src/main/resources/application.properties**
   - Disable Thymeleaf cache: `spring.thymeleaf.cache=false`
   - Add no-cache headers for static assets
   - Enable Spring DevTools auto-restart

5. **frontend/vite.config.js** (optional)
   - Ensure CSS is bundled correctly
   - No changes needed if already configured

---

## DESIGN SPECIFICATIONS

### Color Palette
- **Base**: `#050814` (deep black)
- **Gradient**: `#050814` → `#0a0e24` → `#050814`
- **Neon Blue**: `#4cc9ff` / `#00E5FF`
- **Neon Purple**: `#bd00ff` / `#FF6BDB`
- **Neon Green**: `#00ff94`
- **Glow Opacity**: 0.08–0.15 (low, subtle)

### Effects
- **Fog/Smoke**: Radial gradients with 50px+ blur, 0.08–0.12 opacity
- **Corner Glow**: Neon blue (top-right), neon purple (bottom-left)
- **Sky Haze**: Subtle radial gradient at top, fading to transparent
- **3D Depth**: Inset shadows + drop-shadow on dancer circle
- **LED Reflection**: Subtle light rays behind circle, low opacity

### Animations
- **Fog Drift**: 30s ease-in-out infinite (subtle movement)
- **Glow Pulse**: 8s ease-in-out infinite (breathing effect)
- **Corner Bloom**: 10s ease-in-out infinite (subtle scale)

---

## DEVELOPMENT WORKFLOW

### Step 1: Update Frontend CSS
```bash
# Edit frontend/src/ui/neon-styles.css
# Add .banner-strip-neon-cinematic class with all effects
# Add supporting keyframes
```

### Step 2: Update BannerStrip Component
```bash
# Edit frontend/src/ui/components/BannerStrip.jsx
# Add className="banner-strip-neon-cinematic" to root <section>
# Keep all text, structure, GSAP animations unchanged
```

### Step 3: Build & Sync
```bash
cd frontend
npm run build:backend
# This builds React + syncs dist/ to backend/src/main/resources/static/
```

### Step 4: Configure Backend
```bash
# Edit backend/src/main/resources/application.properties
# Set spring.thymeleaf.cache=false
# Add no-cache headers for static assets
```

### Step 5: Run Backend
```bash
cd backend
mvn spring-boot:run
# Spring DevTools auto-restarts on changes
# Open http://localhost:8085
```

### Step 6: Test & Iterate
```bash
# Edit CSS in frontend/src/ui/neon-styles.css
# Run: npm run build:backend
# Hard refresh browser (Ctrl+Shift+R)
# Updated banner renders instantly
```

---

## CACHING & CACHE-BUSTING STRATEGY

### Backend Configuration
```properties
# application.properties
spring.thymeleaf.cache=false
spring.web.resources.cache.cachecontrol.max-age=0
spring.web.resources.cache.cachecontrol.no-cache=true
server.servlet.session.cookie.http-only=true
```

### Frontend Build
- Vite automatically adds content-hash to bundle filenames
- `npm run build:backend` syncs latest hashed files
- Browser fetches new assets on hard refresh

### Browser Refresh
- **Soft Refresh** (F5): May use cache
- **Hard Refresh** (Ctrl+Shift+R / Cmd+Shift+R): Bypasses cache, fetches latest

---

## VALIDATION CHECKLIST

- [ ] Banner text content unchanged (639-Step Premium Neon Dance Curriculum + all sub-text)
- [ ] Banner structure intact (no layout collapse, responsive)
- [ ] Component name unchanged (BannerStrip)
- [ ] Neon background applied (deep navy-black + purple/blue glow + fog)
- [ ] 3D depth lighting visible behind dancer circle
- [ ] LED studio reflection feel present
- [ ] CSS animations smooth (fog drift, glow pulse, corner bloom)
- [ ] Frontend changes sync to backend on `npm run build:backend`
- [ ] Browser hard refresh fetches updated UI without delay
- [ ] Spring DevTools auto-restart works on backend changes
- [ ] No aggressive caching interferes with development
- [ ] Responsive layout maintained on mobile/tablet

---

## EXPECTED OUTPUT

### Visual Result
- Premium neon cinematic banner with deep navy-black gradient
- Neon purple/blue corner glow effects
- Low-opacity sky haze and realistic studio smoke/fog
- 3D depth lighting behind dancer circle
- LED studio reflection feel
- Smooth, subtle animations (fog drift, glow pulse)
- All text content preserved exactly

### Technical Result
- Frontend CSS changes auto-sync to backend static folder
- Browser refresh reflects latest UI immediately
- No cache interference during development
- Spring Boot DevTools auto-restart on backend changes
- Full-stack workflow: Edit → Build → Refresh → See Changes

---

## NOTES

- **Minimal Code**: Only add necessary CSS classes and keyframes; no verbose implementations
- **No Breaking Changes**: Preserve all existing text, structure, GSAP animations
- **Performance**: Use GPU-accelerated animations (transform, opacity); avoid expensive blur on text
- **Accessibility**: Maintain text contrast; ensure animations respect `prefers-reduced-motion`
- **Mobile-First**: Responsive design; reduce fog opacity on smaller screens if needed

---

## QUICK START COMMAND

```bash
# 1. Update CSS & component
# 2. Build & sync
cd frontend && npm run build:backend

# 3. Run backend
cd ../backend && mvn spring-boot:run

# 4. Open browser
# http://localhost:8085

# 5. Hard refresh to see changes
# Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

---

**Ready to integrate? Paste this prompt into Gemini 3 Pro or Claude Sonnet 4.5 and provide the updated CSS + component code.**

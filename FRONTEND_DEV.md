# Frontend Live Reload Setup

## 🚀 Quick Start

### Option 1: Frontend Dev Server Only (Fastest for UI Changes)
```bash
cd frontend
npm run dev
```
- Open: **http://localhost:5173**
- Hot reload on every save (instant!)
- Perfect for CSS, React, and component changes

### Option 2: Full Stack Dev (Frontend + Backend)
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
mvn spring-boot:run
```
- Frontend: http://localhost:5173 (hot reload)
- Backend API: http://localhost:8085
- Both auto-update on save

### Option 3: Production Build
```bash
cd frontend
npm run build:backend
cd backend
mvn spring-boot:run
```
- Open: http://localhost:8085
- Built frontend served by backend

## ✨ What's Enabled

✅ **Vite Hot Module Replacement (HMR)** - Instant CSS/JS updates  
✅ **React Fast Refresh** - Component updates without page reload  
✅ **Source Maps** - Easy debugging  
✅ **Auto-restart** - On dependency changes  

## 📝 File Changes Auto-Update

| File Type | Reload Type | Time |
|-----------|------------|------|
| CSS | Instant | <100ms |
| React Components | HMR | <500ms |
| Static Assets | Instant | <100ms |
| Dependencies | Full Restart | 2-3s |

## 🔄 Workflow

1. **Save CSS** → Browser updates instantly
2. **Save React component** → Component re-renders (state preserved)
3. **Save static files** → Auto-refresh
4. **No manual refresh needed!**

## 💡 Tips

- **Hard refresh** if needed: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Check console** for HMR status
- **Keep dev server running** in background
- **Both terminals** for full-stack development

## 🎯 For Navbar Changes

```bash
cd frontend
npm run dev
```
- Edit `src/ui/styles.css` → See changes instantly
- Edit `src/ui/components/EnhancedNavbar.jsx` → Component updates live
- No rebuild needed!

**You're all set! Start coding!** 🎉

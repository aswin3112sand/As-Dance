# LIGHTHOUSE 100% - TESTING & VERIFICATION GUIDE

## QUICK START

```bash
cd frontend
npm install
npm run build
npm run preview
```

Then open Chrome DevTools (F12) → Lighthouse → Analyze page load

---

## DETAILED TESTING STEPS

### 1. RESPONSIVENESS TESTING

**Test on these breakpoints:**
- 320px (iPhone SE)
- 375px (iPhone 12)
- 414px (iPhone 14 Plus)
- 480px (Small Android)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)

**What to check:**
```
✓ Navbar height responsive (not fixed)
✓ Hero grid single column on mobile
✓ All buttons clickable (44px+ size)
✓ No horizontal scrollbar
✓ Text readable (font sizes scale)
✓ Images responsive (100% width)
✓ Grids adapt (1 → 2 → 3 → 4 columns)
✓ Touch targets 44px minimum
✓ Spacing scales with viewport
```

**Chrome DevTools:**
1. Press F12
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device or custom size
4. Test all breakpoints

---

### 2. PERFORMANCE TESTING

**Lighthouse Performance Checklist:**

```
✓ First Contentful Paint (FCP) < 1.8s
✓ Largest Contentful Paint (LCP) < 2.5s
✓ Cumulative Layout Shift (CLS) < 0.1
✓ Total Blocking Time (TBT) < 200ms
✓ Time to Interactive (TTI) < 3.8s
```

**How to test:**
1. Open DevTools → Lighthouse
2. Select "Performance"
3. Click "Analyze page load"
4. Check scores

**If scores are low:**
- Disable animations on mobile (already done)
- Reduce backdrop-filter blur (already done)
- Lazy load images below fold
- Code split routes

---

### 3. ACCESSIBILITY TESTING

**Lighthouse Accessibility Checklist:**

```
✓ Skip-to-content link present
✓ Focus states visible (2px outline)
✓ All buttons 44px minimum
✓ Main landmark present
✓ Alt text on all images
✓ Color contrast WCAG AA
✓ Keyboard navigation works
✓ Form labels present
✓ Heading hierarchy correct
✓ No duplicate IDs
```

**Manual testing:**
1. Press Tab key repeatedly
2. Verify focus outline visible
3. Press Enter on focused button
4. Verify action works
5. Test with screen reader (NVDA/JAWS)

**Chrome DevTools:**
1. Open DevTools → Lighthouse
2. Select "Accessibility"
3. Click "Analyze page load"
4. Check for issues

---

### 4. SEO TESTING

**Lighthouse SEO Checklist:**

```
✓ Meta description present
✓ Viewport meta tag set
✓ Robots.txt present
✓ Sitemap.xml present
✓ Canonical URL set
✓ OpenGraph tags present
✓ Twitter card tags present
✓ Mobile-friendly
✓ No blocked resources
✓ Structured data valid
```

**How to test:**
1. Open DevTools → Lighthouse
2. Select "SEO"
3. Click "Analyze page load"
4. Check for issues

**Manual checks:**
```bash
# Check robots.txt
curl https://localhost:4173/robots.txt

# Check sitemap.xml
curl https://localhost:4173/sitemap.xml

# Check meta tags
# Open DevTools → Elements → <head>
```

---

### 5. BEST PRACTICES TESTING

**Lighthouse Best Practices Checklist:**

```
✓ No console errors
✓ No console warnings
✓ HTTPS enabled (production)
✓ No mixed content
✓ No deprecated APIs
✓ Images have width/height
✓ Images use modern formats
✓ No unminified JS/CSS
✓ No unused JS
✓ Proper error handling
```

**How to test:**
1. Open DevTools → Console
2. Check for errors/warnings
3. Open DevTools → Lighthouse
4. Select "Best Practices"
5. Click "Analyze page load"

---

## FULL LIGHTHOUSE AUDIT COMMAND

```bash
# Build production
npm run build

# Preview production build
npm run preview

# Open in Chrome
# Press F12 → Lighthouse
# Select all categories
# Click "Analyze page load"
```

---

## EXPECTED RESULTS

After all fixes applied:

```
Performance:      100
Accessibility:    100
Best Practices:   100
SEO:              100
```

---

## TROUBLESHOOTING

### Performance Score Low?

**Check:**
1. Animations disabled on mobile? ✓ (responsive-fixes.css)
2. Backdrop-filter reduced? ✓ (responsive-fixes.css)
3. Images lazy loaded? ✓ (HeroSection.jsx, BannerStrip.jsx)
4. No console errors? Check DevTools → Console

**Fix:**
```css
/* Disable animations on mobile */
@media (max-width: 768px) {
  animation: none !important;
}

/* Reduce blur on mobile */
@media (max-width: 768px) {
  backdrop-filter: blur(6px) !important;
}
```

### Accessibility Score Low?

**Check:**
1. Skip-to-content link present? ✓ (App.jsx)
2. Focus states visible? ✓ (responsive-fixes.css)
3. Touch targets 44px? ✓ (responsive-fixes.css)
4. Main landmark present? ✓ (App.jsx)

**Fix:**
```jsx
// Add to App.jsx
<a href="#main-content" className="skip-to-content">
  Skip to main content
</a>
<main id="main-content">
  {/* content */}
</main>
```

### SEO Score Low?

**Check:**
1. robots.txt present? ✓ (public/robots.txt)
2. sitemap.xml present? ✓ (public/sitemap.xml)
3. Meta tags in index.html? ✓ (index.html)
4. Canonical URL set? ✓ (index.html)

**Fix:**
```html
<!-- In index.html <head> -->
<meta name="description" content="...">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="https://asdance.com">
```

### Best Practices Score Low?

**Check:**
1. No console errors? Check DevTools → Console
2. Images have width/height? ✓ (HeroSection.jsx, BannerStrip.jsx)
3. No deprecated APIs? Check DevTools → Console
4. HTTPS enabled? (production only)

**Fix:**
```jsx
// Add width/height to images
<img
  src={image}
  alt="Description"
  width="1024"
  height="768"
  loading="lazy"
  decoding="async"
/>
```

---

## MOBILE TESTING CHECKLIST

### 320px (iPhone SE)
- [ ] Navbar responsive
- [ ] Hero single column
- [ ] Buttons 44px+
- [ ] No horizontal scroll
- [ ] Text readable
- [ ] Images responsive

### 375px (iPhone 12)
- [ ] All above
- [ ] Spacing correct
- [ ] Grids responsive

### 480px (Small Android)
- [ ] All above
- [ ] Forms usable
- [ ] Modals responsive

### 768px (iPad)
- [ ] Grids 2 columns
- [ ] Navbar full
- [ ] All content visible

### 1024px+ (Desktop)
- [ ] Grids 3-4 columns
- [ ] Full layout
- [ ] Animations enabled

---

## KEYBOARD NAVIGATION TEST

1. Press Tab repeatedly
2. Verify focus outline visible
3. Press Enter on buttons
4. Press Space on checkboxes
5. Press Arrow keys in dropdowns
6. Press Escape to close modals
7. Alt+M to skip to main content

---

## SCREEN READER TEST

**Using NVDA (Windows):**
1. Download NVDA: https://www.nvaccess.org/
2. Start NVDA
3. Open website
4. Navigate with arrow keys
5. Verify all content readable

**Using JAWS (Windows):**
1. Start JAWS
2. Open website
3. Navigate with arrow keys
4. Verify all content readable

**Using VoiceOver (Mac):**
1. Press Cmd+F5 to enable
2. Open website
3. Navigate with VO+arrow keys
4. Verify all content readable

---

## FINAL VERIFICATION

Run this checklist before deployment:

```
RESPONSIVENESS:
✓ 320px - No scroll, readable
✓ 375px - All buttons clickable
✓ 480px - Forms usable
✓ 768px - Grids 2 columns
✓ 1024px - Grids 3-4 columns
✓ 1440px - Full layout

PERFORMANCE:
✓ FCP < 1.8s
✓ LCP < 2.5s
✓ CLS < 0.1
✓ TBT < 200ms

ACCESSIBILITY:
✓ Skip-to-content link
✓ Focus states visible
✓ Touch targets 44px+
✓ Main landmark present
✓ Alt text on images
✓ Keyboard navigation works

SEO:
✓ Meta tags present
✓ robots.txt present
✓ sitemap.xml present
✓ Canonical URL set
✓ Mobile-friendly

BEST PRACTICES:
✓ No console errors
✓ Images have width/height
✓ No deprecated APIs
✓ HTTPS enabled

LIGHTHOUSE SCORES:
✓ Performance: 100
✓ Accessibility: 100
✓ Best Practices: 100
✓ SEO: 100
```

---

## DEPLOYMENT CHECKLIST

Before going live:

```bash
# 1. Build production
npm run build

# 2. Run Lighthouse audit
npm run preview
# Then test in Chrome DevTools

# 3. Test on real devices
# iPhone, Android, iPad, Desktop

# 4. Test keyboard navigation
# Tab through entire site

# 5. Test with screen reader
# NVDA or JAWS

# 6. Check console for errors
# DevTools → Console

# 7. Verify all links work
# Click every link

# 8. Test forms
# Submit all forms

# 9. Test responsive images
# Resize browser window

# 10. Final Lighthouse audit
# All scores should be 100
```

---

## SUPPORT

If you encounter issues:

1. Check console for errors (F12 → Console)
2. Check Lighthouse report for specific issues
3. Verify all files are created:
   - responsive-fixes.css ✓
   - robots.txt ✓
   - sitemap.xml ✓
4. Verify App.jsx updated with skip-to-content link
5. Run `npm run build` to rebuild

---

## NEXT STEPS

1. ✅ Apply all fixes from this guide
2. ✅ Run Lighthouse audit
3. ✅ Verify all scores are 100
4. ✅ Test on real devices
5. ✅ Deploy to production


# Premium 3D Hero & Stats layout Instructions

## Goal
Create a high-performance, studio-grade 3D Hero section for AS DANCE that balances aesthetic appeal with strict conversion logic.

## 1. CTA Placement Strategy (Strict)
*   **Hero Section Only**: The "Login" and "Create Account" buttons must ONLY appear in the Hero section.
*   **Auto-Hide Logic**: If the user is logged in, hide "Login" and "Create Account" buttons immediately to reduce clutter.
*   **Main Conversion Button**: "Unlock 639 Steps for ₹499" is the primary action. It stays visible but can change to "Dashboard" or "Go to Content" if purchased (optional, but focus on unauthenticated view first).
*   **Cleanup**: Remove duplicate Login/Buy buttons from the Navbar, Offer strip, and Footer to focus attention on the Hero.

## 2. Visual Composition
*   **Layout Grid**:
    *   **Desktop**: Split 60/40. Left align text. Right align 3D Visual.
    *   **Mobile**: Single column. Center align everything.
*   **Typography**:
    *   **Headline**: "AS DANCE" - 700 Weight, White, Deep Neon Glow (Cyan/Purple).
    *   **Subhead**: "639-Step Premium Neon Dance Bundle" - 600 Weight, High Contrast.
    *   **Support**: Body text should be 500 weight, slightly transparent white (opacity 0.75).
*   **3D Hero Image**:
    *   Place a premium dance studio 3D render (16:9 aspect ratio) in the right column.
    *   Apply a 3D perspective transform (tilt) on desktop hover.
    *   **Stats Card**: Overlay or position a "639 Total Steps" glass-morphism card near the image (centered or right-balanced).

## 3. Performance & Tech
*   **Image**: Use WebP/JPG. Max width 520px. Preload (Eager load) this LCP image.
*   **Layout Shift**: Enforce strict aspect-ratio containers for the image to prevent jumpiness on load.
*   **Code**: Use Bootstrap 5 grid + Custom CSS for neon glows. No heavy JS libs for simple layout.

## 4. Example Component Structure
```jsx
<section className="hero">
  <div className="container">
    <div className="row">
       <div className="col-lg-6 text-start">
          <h1>AS DANCE</h1>
          <p>Curriculum...</p>
          <button>Unlock ₹499</button>
          {!user && <AuthButtons />}
       </div>
       <div className="col-lg-6">
          <div className="3d-card-wrapper">
             <img src="studio-3d.jpg" />
             <div className="stats-overlay">639 Steps</div>
          </div>
       </div>
    </div>
  </div>
</section>
```

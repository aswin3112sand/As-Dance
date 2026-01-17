import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const DemoSection = React.lazy(() => import("../components/DemoSection.jsx"));

export default function Preview() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const navHiddenRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDelta = 6;
    const hideAfter = 90;
    let rafId = null;

    const setHidden = (value) => {
      if (navHiddenRef.current === value) return;
      navHiddenRef.current = value;
      setIsNavHidden(value);
    };

    const updateScrollState = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(currentY > 12);

      if (prefersReducedMotion) {
        setHidden(false);
        lastScrollYRef.current = currentY;
        rafId = null;
        return;
      }

      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;

      if (currentY <= 8) {
        setHidden(false);
      } else if (delta > minDelta && currentY > hideAfter) {
        setHidden(true);
      } else if (delta < -minDelta) {
        setHidden(false);
      }

      lastScrollYRef.current = currentY;
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollState);
    };

    lastScrollYRef.current = window.scrollY || 0;
    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className={`navbar-glass${isScrolled ? " is-scrolled" : ""}${isNavHidden ? " is-hidden" : ""}`}>
          <div className="container-max">
            <div className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
              AS DANCE
            </div>
            <Link to="/" className="btn btn--ghost">
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      <div className="page-content">
        <Suspense fallback={(
          <section id="preview" className="section section-compact section-anim" aria-busy="true">
            <div className="container-max text-center text-white-50 small" style={{ opacity: 0.8 }}>
              Loading preview...
            </div>
          </section>
        )}>
          <DemoSection />
        </Suspense>
      </div>
    </>
  );
}

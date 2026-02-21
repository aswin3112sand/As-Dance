import React, { Suspense, memo, useEffect, useRef, useState } from "react";
import { Mail, WhatsApp } from "../icons.jsx";

import HeroSection from "../components/HeroSection.jsx";
import LevelCards from "../components/LevelCards.jsx";
import FaqSection from "../components/FaqSection.jsx";

const DemoSection = React.lazy(() => import("../components/DemoSection.jsx"));
const ReviewLoop = React.lazy(() => import("../components/ReviewLoop.jsx"));
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const NAV_SECTIONS = ["about", "services", "preview", "reviews", "contacts"];
const PRIMARY_CTA_TEXT = "WhatsApp-la 639-Step Course Join Pannu - INR 499";
const PRIMARY_WA_LINK = "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20naan%20INR%20499%20639-step%20course%20join%20panna%20ready.";

const SectionSkeleton = memo(function SectionSkeleton({ title, id, minHeight }) {
  return (
    <section
      id={id}
      className="section section-compact section-anim"
      aria-busy="true"
      style={minHeight ? { minHeight } : undefined}
    >
      <div className="container-max text-center text-white-50 small" style={{ opacity: 0.8 }}>
        Loading {title}...
      </div>
    </section>
  );
});

const PREVIEW_FALLBACK = (
  <SectionSkeleton title="preview" id="preview" minHeight="clamp(260px, 45vw, 420px)" />
);

const REVIEWS_FALLBACK = (
  <SectionSkeleton title="reviews" id="reviews" minHeight="clamp(300px, 60vw, 560px)" />
);

const LazyMount = memo(function LazyMount({ rootMargin = "240px", fallback, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    const node = targetRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return <div ref={targetRef}>{isVisible ? children : fallback}</div>;
});

export default function Home() {
  const loaded = true;
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0]);

  useEffect(() => {
    let rafId = null;

    const updateScrollState = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      const nextIsScrolled = currentY > 12;
      setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection((prev) => (prev === sectionId ? prev : sectionId));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);



  return (
    <>
      {/* NAVBAR */}
      <header className="site-header">
        <Navbar
          activeSection={activeSection}
          loaded={loaded}
          isScrolled={isScrolled}
        />
      </header>



      <div className="page-content">
        {/* 1. HERO */}
        <HeroSection />

        {/* 2. SALES FLOW */}
        <LevelCards />
        <LazyMount
          fallback={PREVIEW_FALLBACK}
        >
          <Suspense fallback={PREVIEW_FALLBACK}>
            <DemoSection />
          </Suspense>
        </LazyMount>

        {/* 3. REVIEWS MARQUEE */}
        <LazyMount
          fallback={REVIEWS_FALLBACK}
        >
          <Suspense fallback={REVIEWS_FALLBACK}>
            <ReviewLoop />
          </Suspense>
        </LazyMount>

        <FaqSection />
      </div>

      <a
        href={PRIMARY_WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-sticky-enroll"
        aria-label={PRIMARY_CTA_TEXT}
      >
        {PRIMARY_CTA_TEXT}
      </a>

      {/* 9. SUPPORT BUTTONS (Floating Container) */}
      <div className="fab-container">
        <a
          href="mailto:businessaswin@gmail.com"
          className="mail-float"
          title="Email Support"
          aria-label="Email Support"
          data-tooltip="Email support"
        >
          <Mail size={20} />
        </a>
        <a
          href="https://wa.me/918825602356"
          target="_blank"
          rel="noopener noreferrer"
          className="wa-float"
          title="Support on WhatsApp"
          aria-label="Support on WhatsApp"
          data-tooltip="Chat on WhatsApp"
        >
          <WhatsApp size={24} color="#fff" />
        </a>
      </div>

      {/* 10. FOOTER */}
      <Footer />
    </>
  );
}

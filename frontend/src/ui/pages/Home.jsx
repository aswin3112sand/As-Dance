import React, { Suspense, useEffect, useRef, useState } from "react";
import { Mail, WhatsApp } from "../icons.jsx";

import BannerStrip from "../components/BannerStrip.jsx";
import HeroSection from "../components/HeroSection.jsx";
import LevelCards from "../components/LevelCards.jsx";

const DemoSection = React.lazy(() => import("../components/DemoSection.jsx"));
const ReviewLoop = React.lazy(() => import("../components/ReviewLoop.jsx"));
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const NAV_SECTIONS = ["bundle", "services", "preview", "reviews", "contacts"];

export default function Home() {
  const loaded = true;
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0]);
  const SectionSkeleton = ({ title, id, minHeight }) => (
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
  const LazyMount = ({ rootMargin = "240px", fallback, children }) => {
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
  };

  useEffect(() => {
    let rafId = null;

    const updateScrollState = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(currentY > 12);
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
            setActiveSection(entry.target.id);
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
      {/* 0. UTILS */}
      <div id="preloader" style={{ opacity: loaded ? 0 : 1, visibility: loaded ? 'hidden' : 'visible' }}>
        <div className="loader-content">
          <div className="loader-text">AS DANCE</div>
          <div className="loader-subtext">639 STEP BUNDLE</div>
        </div>
      </div>
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
        <BannerStrip />

        {/* 2. REST OF SECTIONS */}
        <HeroSection />
        <LevelCards />
        <LazyMount
          fallback={<SectionSkeleton title="preview" id="preview" minHeight="clamp(260px, 45vw, 420px)" />}
        >
          <Suspense fallback={<SectionSkeleton title="preview" id="preview" minHeight="clamp(260px, 45vw, 420px)" />}>
            <DemoSection />
          </Suspense>
        </LazyMount>

        {/* 3. REVIEWS MARQUEE */}
        <LazyMount
          fallback={<SectionSkeleton title="reviews" id="reviews" minHeight="clamp(300px, 60vw, 560px)" />}
        >
          <Suspense fallback={<SectionSkeleton title="reviews" id="reviews" minHeight="clamp(300px, 60vw, 560px)" />}>
            <ReviewLoop />
          </Suspense>
        </LazyMount>
      </div>

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

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRealTimeAnimations } from "../hooks/useRealTimeAnimations.js";

import BannerStrip from "../components/BannerStrip.jsx";
import HeroSection from "../components/HeroSection.jsx";
import LevelCards from "../components/LevelCards.jsx";


const DemoSection = React.lazy(() => import("../components/DemoSection.jsx"));
const ReviewLoop = React.lazy(() => import("../components/ReviewLoop.jsx"));
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

const NAV_SECTIONS = ["bundle", "services", "preview", "reviews", "contacts"];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0]);
  const lastScrollYRef = useRef(0);
  const navHiddenRef = useRef(false);
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

  // --- 1. PRELOADER LOGIC ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSaveData = navigator?.connection?.saveData === true;
    if (prefersReducedMotion || isSaveData) {
      setLoaded(true);
      return undefined;
    }
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

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



  // --- 2. SCROLL PROGRESS LOGIC ---
  useEffect(() => {
    const progressBar = document.querySelector(".scroll-progress");
    let rafId = null;

    const update = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      if (progressBar) progressBar.style.setProperty("--scroll-progress", scroll.toFixed(3));
      document.documentElement.style.setProperty("--ui-scroll-depth", scroll.toFixed(3));
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (progressBar) progressBar.style.setProperty("--scroll-progress", "0");
      document.documentElement.style.setProperty("--ui-scroll-depth", "0");
    };
  }, []);

  // --- 3. SECTION ENTRANCE ANIMATION ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSaveData = navigator?.connection?.saveData === true;
    if (prefersReducedMotion || isSmallScreen || isCoarsePointer || isSaveData) return;
    const ctx = gsap.context(() => {
      const cardReveal = {
        from: { opacity: 0, y: 40, scale: 0.96 },
        to: {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.09,
          ease: "power2.out",
          clearProps: "transform"
        }
      };
      const reviewReveal = {
        from: { opacity: 0, y: 30 },
        to: {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "cubic-bezier(0.4, 0, 0.2, 1)",
          clearProps: "transform"
        }
      };
      const sectionReveal = {
        from: { opacity: 0, y: 40, scale: 0.98 },
        to: { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" }
      };

      gsap.utils.toArray(".section-anim").forEach((section) => {
        const reviewCards = section.querySelectorAll(".review-card");
        const cards = section.querySelectorAll(".card-anim");
        if (reviewCards.length) {
          gsap.fromTo(
            reviewCards,
            reviewReveal.from,
            {
              ...reviewReveal.to,
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
              }
            }
          );
        } else if (cards.length) {
          gsap.fromTo(
            cards,
            cardReveal.from,
            {
              ...cardReveal.to,
              scrollTrigger: {
                trigger: section,
                start: "top 80%"
              }
            }
          );
        } else {
          gsap.fromTo(
            section,
            sectionReveal.from,
            {
              ...sectionReveal.to,
              scrollTrigger: {
                trigger: section,
                start: "top 80%"
              }
            }
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* 0. UTILS */}
      <div id="preloader" style={{ opacity: loaded ? 0 : 1, visibility: loaded ? 'hidden' : 'visible' }}>
        <div className="loader-content">
          <div className="loader-text">AS DANCE</div>
          <div className="text-white small tracking-widest mt-2">639 STEP BUNDLE</div>
        </div>
      </div>
      <div className="scroll-progress"></div>

      {/* NAVBAR */}
      <Navbar
        activeSection={activeSection}
        loaded={loaded}
        isScrolled={isScrolled}
        isNavHidden={isNavHidden}
      />

      <div className="page-content">
        <BannerStrip />

        {/* 1. HERO SECTION */}
        <HeroSection />

        {/* 2. SERVICES */}
        <LevelCards />

        {/* 3. DEMO / PREVIEW */}
        <LazyMount
          fallback={<SectionSkeleton title="preview" id="preview" minHeight="clamp(260px, 45vw, 420px)" />}
        >
          <Suspense fallback={<SectionSkeleton title="preview" id="preview" minHeight="clamp(260px, 45vw, 420px)" />}>
            <DemoSection />
          </Suspense>
        </LazyMount>

        {/* 5. REVIEWS */}
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
        <a href="mailto:bussinessaswin@gmail.com" className="mail-float" title="Email Support" aria-label="Email Support">
          <Mail size={20} />
        </a>
        <a href="https://wa.me/918825602356" target="_blank" rel="noopener noreferrer" className="wa-float" title="Support on WhatsApp" aria-label="Support on WhatsApp">
          <WhatsApp size={24} color="#fff" />
        </a>
      </div>

      {/* 10. FOOTER */}
      <Footer />
    </>
  );
}

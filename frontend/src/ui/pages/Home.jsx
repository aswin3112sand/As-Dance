import React, { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import BannerStrip from "../components/BannerStrip.jsx";
import HeroSection from "../components/HeroSection.jsx";
import LevelCards from "../components/LevelCards.jsx";

const DemoSection = React.lazy(() => import("../components/DemoSection.jsx"));
const ReviewLoop = React.lazy(() => import("../components/ReviewLoop.jsx"));
import { WhatsApp, Mail, ShieldCheck, Infinity, Zap, Headset, PhoneCall } from "../icons.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const SectionSkeleton = ({ title, id }) => (
    <section id={id} className="section section-compact section-anim" aria-busy="true">
      <div className="container-max text-center text-white-50 small" style={{ opacity: 0.8 }}>
        Loading {title}...
      </div>
    </section>
  );

  // --- 1. PRELOADER LOGIC ---
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- 4. NAVBAR HORIZONTAL GLIDE (SCROLL REACTIVE) ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const glideTargets = Array.from(document.querySelectorAll(".nav-center, .nhh-nav-links"));
    if (!glideTargets.length) return;

    let lastY = window.scrollY || document.documentElement.scrollTop || 0;
    let rafId = null;
    let resetTimer = null;

    const setShift = (value) => {
      glideTargets.forEach((el) => el.style.setProperty("--nav-glide-x", `${value}px`));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const dy = y - lastY;
        lastY = y;
        const shift = Math.max(-18, Math.min(18, dy * 0.65));
        setShift(shift);

        if (resetTimer) window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => setShift(0), 140);
      });
    };

    setShift(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (resetTimer) window.clearTimeout(resetTimer);
      setShift(0);
    };
  }, []);

  // --- 2. SCROLL PROGRESS LOGIC ---
  useEffect(() => {
    const progressBar = document.querySelector(".scroll-progress");
    let rafId = null;

    const update = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      if (progressBar) progressBar.style.width = `${scroll * 100}%`;
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
    };
  }, []);

  // --- 3. SECTION ENTRANCE ANIMATION ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".section-anim").forEach((section) => {
        const cards = section.querySelectorAll(".card-anim");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.09,
              ease: "power2.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: section,
                start: "top 80%"
              }
            }
          );
        } else {
          gsap.fromTo(
            section,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
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
      <nav className={`navbar-glass${loaded ? " is-nav-animated" : ""}`}>
        <div className="container-max d-flex align-items-center justify-content-between">
          <div className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>AS DANCE</div>

          <div className="d-none d-md-flex align-items-center gap-5 nav-center">
            <a href="#bundle" className="nav-link">
              <span className="nav-label">Bundle</span>
              <span className="nav-emoji" aria-hidden="true">📦</span>
            </a>
            <a href="#services" className="nav-link">
              <span className="nav-label">Services</span>
              <span className="nav-emoji" aria-hidden="true">⚙</span>
            </a>
            <a href="#preview" className="nav-link">
              <span className="nav-label">Preview</span>
              <span className="nav-emoji" aria-hidden="true">▶</span>
            </a>
            <a href="#reviews" className="nav-link">
              <span className="nav-label">Reviews</span>
              <span className="nav-emoji" aria-hidden="true">⭐</span>
            </a>
            <a href="#contacts" className="nav-link">
              <span className="nav-label">Contacts</span>
              <span className="nav-emoji" aria-hidden="true">📞✉</span>
            </a>
          </div>

          <div className="d-flex align-items-center gap-2 header-actions">
            <Link to="/login" className="btn nav-cta nav-cta-secondary">
              Login
            </Link>
            <Link to="/register" className="btn nav-cta nav-cta-primary">
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <BannerStrip />

        {/* 1. HERO SECTION */}
        <HeroSection />

        {/* 2. SERVICES */}
        <LevelCards />

        {/* 3. DEMO / PREVIEW */}
        <Suspense fallback={<SectionSkeleton title="preview" id="preview" />}>
          <DemoSection />
        </Suspense>

        {/* 5. REVIEWS */}
        <Suspense fallback={<SectionSkeleton title="reviews" id="reviews" />}>
          <ReviewLoop />
        </Suspense>

      </main>

      {/* 9. SUPPORT BUTTONS (Floating Container) */}
      <div className="fab-container">
        <a href="mailto:businessaswin@gmail.com" className="mail-float" title="Email Support">
          <Mail size={20} />
        </a>
        <a href="https://wa.me/918825602356" target="_blank" rel="noreferrer" className="wa-float" title="Support on WhatsApp">
          <WhatsApp size={24} color="#fff" />
        </a>
      </div>

      {/* 10. FOOTER */}
      <footer className="site-footer section-anim bg-contact" id="contacts">
        <div className="container-max footer-grid">
          <div className="footer-col footer-brand">
            <div className="footer-title">AS DANCE — 639-Step Premium Curriculum</div>
            <p className="footer-copy">
              Fast skill progression for students, fitness dancers, wedding choreo learners, and stage performers.
            </p>
            <div className="footer-icons">
              <a href="https://wa.me/918825602356" target="_blank" rel="noreferrer" className="footer-icon">
                <WhatsApp size={18} color="#fff" />
              </a>
              <a href="mailto:businessaswin@gmail.com" className="footer-icon">
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-title">Contact</div>
            <div className="footer-list footer-contact">
              <div className="footer-contact-item">
                <Mail size={16} />
                <span>Email: businessaswin@gmail.com</span>
              </div>
              <div className="footer-contact-item">
                <PhoneCall size={16} />
                <span>Phone: +91 88256 02356</span>
              </div>
              <div className="footer-contact-item">Song Used: "Dance Dhoom Mix 2025"</div>
              <div className="footer-contact-item">Beat Sync: Always Matching Step For Beaat</div>
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-title">Support</div>
            <div className="footer-list">
              <span>Secure Payment</span>
              <span>Lifetime Access</span>
              <span>Instant Unlock</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
        <div className="footer-divider" aria-hidden="true"></div>
        <div className="footer-trust">
          <div className="footer-trust-item">
            <ShieldCheck size={16} />
            Secure Payment
          </div>
          <div className="footer-trust-item">
            <Infinity size={16} />
            Lifetime Access
          </div>
          <div className="footer-trust-item">
            <Zap size={16} />
            Instant Unlock
          </div>
          <div className="footer-trust-item">
            <Headset size={16} />
            24/7 Support
          </div>
        </div>
        <div className="footer-signature">
          Aswin —  AS DANCE Creator
        </div>
      </footer>
    </>
  );
}

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Infinity, Zap, Headset } from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import heroPreview from "../../assets/bg/As Dance.webp";

const LEVELS = [
  { name: "Easy", value: 196, className: "hero-level-easy" },
  { name: "Medium", value: 219, className: "hero-level-medium" },
  { name: "Hard", value: 226, className: "hero-level-hard" }
];

const OFFER_ICONS = [
  { label: "Instant Unlock", icon: "⚡" },
  { label: "HD Step Video", icon: "🎥" },
  { label: "7-Day Step Change", icon: "🔁" },
  { label: "One-Time Payment", icon: "💳" }
];

const HeroSection = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const counterRef = useRef(null);
  const hasCounted = useRef(false);

  const handleCheckout = () => {
    if (loading) return;
    if (user) {
      nav("/checkout");
      return;
    }
    nav("/login", { state: { from: "/checkout" } });
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
      gsap.to(imageRef.current, {
        y: -6,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, heroRef);

    const handleMouseMove = (e) => {
      if (!imageRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 10;
      gsap.to(imageRef.current, {
        x: -xPos,
        y: -yPos,
        rotationY: -xPos * 0.5,
        rotationX: yPos * 0.5,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const targetEl = counterRef.current;
    if (!targetEl) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const runCounter = () => {
      if (hasCounted.current) return;
      hasCounted.current = true;
      const target = 639;
      if (prefersReducedMotion) {
        targetEl.textContent = `${target}`;
        return;
      }
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          targetEl.textContent = Math.round(counter.value).toString();
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(targetEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="hero-section section bg-hero hero-full">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-grid-background" aria-hidden="true"></div>
      <div className="container-max hero-grid hero-grid-advanced">
        <div className="hero-content hero-content-advanced" ref={textRef}>
          <div className="hero-brand-row">
            <span className="hero-brand-title">AS DANCE</span>
            <span className="hero-brand-subtitle">639 Bundle</span>
          </div>
          <div className="hero-headline-row">
            <h1 className="hero-title">
              639-STEP <span className="hero-title-highlight">PREMIUM NEON</span> DANCE BUNDLE
            </h1>
            <div className="hero-count-panel">
              <span className="hero-count-value" ref={counterRef}>0</span>
              <span className="hero-count-label">Steps</span>
              <span className="hero-price-tag">₹499 ONLY</span>
            </div>
          </div>
          <div className="hero-price-stack">
            <span className="hero-old-price">₹1500</span>
            <span className="hero-price-badge">₹499 ONLY</span>
          </div>
          <div className="hero-levels">
            {LEVELS.map((level) => (
              <span key={level.name} className={`hero-level-pill ${level.className}`}>
                <span className="hero-level-value">{level.value}</span>
                <span className="hero-level-name">{level.name}</span>
              </span>
            ))}
          </div>
          <div className="hero-difficulty-line">
            {LEVELS.map((level, idx) => (
              <span key={`${level.name}-line`} className="hero-difficulty-item">
                <strong>{level.name.toUpperCase()}</strong>
                <span className="hero-difficulty-value">{level.value}</span>
                {idx < LEVELS.length - 1 && <span className="hero-difficulty-separator">|</span>}
              </span>
            ))}
          </div>
          <div className="hero-cta-row">
            <button
              type="button"
              className="btn btn-cta btn-hero btn-cta-primary hero-primary-cta"
              onClick={handleCheckout}
              disabled={loading}
            >
              UNLOCK NOW &nbsp;→&nbsp; START IN MINUTES
            </button>
          </div>
          <p className="hero-copy hero-copy-advanced">
            Unlock studio-grade choreography, lifetime drills, and instant mentorship—no gaps, all neon energy.
          </p>
          <div className="hero-offer-icons hero-offer-icons-cta">
            {OFFER_ICONS.map((item) => (
              <span key={item.label} className="hero-offer-chip">
                <span className="hero-offer-icon" aria-hidden="true">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
          <div className="hero-trust hero-trust-advanced">
            <span className="trust-item">
              <ShieldCheck size={16} />
              Secure Payment
            </span>
            <span className="trust-item">
              <Infinity size={16} />
              Lifetime Access
            </span>
            <span className="trust-item">
              <Zap size={16} />
              Instant Unlock
            </span>
            <span className="trust-item">
              <Headset size={16} />
              24/7 Support
            </span>
          </div>
        </div>
        <div className="hero-visual hero-visual-advanced" ref={imageRef}>
          <div className="hero-poster-frame">
            <img
              src={heroPreview}
              alt="AS DANCE premium poster"
              loading="eager"
              decoding="async"
              width="720"
              height="420"
              className="hero-preview-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

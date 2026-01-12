import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { ShieldCheck, Infinity, Zap, Headphones } from "../icons.jsx";
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
  const nav = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const counterRef = useRef(null);
  const hasCounted = useRef(false);

  const handleCheckout = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      nav(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    nav(target);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    const isSaveData = navigator?.connection?.saveData === true;
    const skipMotion = prefersReducedMotion || isSmallScreen || isSaveData;

    const ctx = gsap.context(() => {
      if (skipMotion) return;
      const heroText = textRef.current;
      const introTargets = heroText
        ? heroText.querySelectorAll(
          ".hero-brand-row, .hero-count-panel, .hero-price-stack, .hero-levels, .hero-difficulty-line"
        )
        : [];
      const ctaTargets = heroText ? heroText.querySelectorAll(".hero-cta-row .btn") : [];
      const baseEase = "cubic-bezier(0.4, 0, 0.2, 1)";

      const tl = gsap.timeline({ defaults: { ease: baseEase } });
      tl.from(".hero-title", { opacity: 0, x: -40, duration: 0.6 });
      if (introTargets.length) {
        tl.from(introTargets, { opacity: 0, y: 18, duration: 0.55, stagger: 0.06 }, "-=0.3");
      }
      tl.from(".hero-copy", { opacity: 0, y: 12, duration: 0.5 }, "+=0.12")
        .from(
          ctaTargets,
          { opacity: 0, scale: 0.95, duration: 0.5, ease: "power2.out", stagger: 0.12 },
          "-=0.35"
        )
        .from(".hero-offer-icons", { opacity: 0, y: 12, duration: 0.5 }, "-=0.25")
        .from(".hero-trust", { opacity: 0, y: 10, duration: 0.45 }, "-=0.2");

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
        );
        if (!isCoarsePointer) {
          gsap.to(imageRef.current, {
            y: -4,
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
    }, heroRef);

    if (skipMotion || isCoarsePointer) {
      return () => ctx.revert();
    }

    if (!imageRef.current) {
      return () => ctx.revert();
    }

    const xTo = gsap.quickTo(imageRef.current, "x", { duration: 0.8, ease: "power2.out" });
    const rotYTo = gsap.quickTo(imageRef.current, "rotationY", { duration: 0.8, ease: "power2.out" });
    const rotXTo = gsap.quickTo(imageRef.current, "rotationX", { duration: 0.8, ease: "power2.out" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 12;
      const yPos = (clientY / window.innerHeight - 0.5) * 6;
      xTo(-xPos);
      rotYTo(-xPos * 0.35);
      rotXTo(yPos * 0.35);
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
              639-STEP <span className="hero-title-highlight">STAGE-READY</span> DANCE CURRICULUM
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
              <Headphones size={16} />
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
              width="1024"
              height="1536"
              fetchpriority="high"
              className="hero-preview-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { ShieldCheck, Infinity, Zap, Headphones } from "../icons.jsx";
import heroAvif512 from "../../assets/optimized/hero-512.avif";
import heroAvif1024 from "../../assets/optimized/hero-1024.avif";
import heroWebp512 from "../../assets/optimized/hero-512.webp";
import heroWebp1024 from "../../assets/optimized/hero-1024.webp";

const SERVICE_PILLARS = [
  { name: "Choreography", value: "Custom", className: "hero-level-easy" },
  { name: "Training", value: "Online", className: "hero-level-medium" },
  { name: "Delivery", value: "24-48h", className: "hero-level-hard" }
];

const OFFER_ICONS = [
  { label: "Custom Dance Choreography Service", icon: "*" },
  { label: "Online Dance Training Course", icon: "*" },
  { label: "Original dance steps", icon: "*" },
  { label: "Course access", icon: "*" }
];

const HeroSection = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const counterRef = useRef(null);

  const handleCheckout = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      nav(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    nav(target);
  };

  useEffect(() => {
    const targetEl = counterRef.current;
    if (!targetEl) return;
    targetEl.textContent = "24-48";
  }, []);

  return (
    <section className="hero-section section bg-hero hero-full">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-grid-background" aria-hidden="true"></div>
      <div className="container-max hero-grid hero-grid-advanced">
        <div className="hero-content hero-content-advanced">
          <div className="hero-brand-row">
            <span className="hero-brand-title">AS DANCE</span>
            <span className="hero-brand-subtitle">Online Dance Training Course</span>
          </div>
          <div className="hero-headline-row">
            <h1 className="hero-title">
              Customized <span className="hero-title-highlight">CHOREOGRAPHY</span> AND ONLINE DANCE TRAINING
            </h1>
            <div className="hero-count-panel">
              <span className="hero-count-value" ref={counterRef}>0</span>
              <span className="hero-count-label">Hours</span>
              <span className="hero-price-tag">Delivery window</span>
            </div>
          </div>
          <div className="hero-price-stack">
            <span className="hero-old-price">Education service</span>
            <span className="hero-price-badge">Subscription / course access</span>
          </div>
          <div className="hero-levels">
            {SERVICE_PILLARS.map((level) => (
              <span key={level.name} className={`hero-level-pill ${level.className}`}>
                <span className="hero-level-value">{level.value}</span>
                <span className="hero-level-name">{level.name}</span>
              </span>
            ))}
          </div>
          <div className="hero-difficulty-line">
            {SERVICE_PILLARS.map((level, idx) => (
              <span key={`${level.name}-line`} className="hero-difficulty-item">
                <strong>{level.name.toUpperCase()}</strong>
                <span className="hero-difficulty-value">{level.value}</span>
                {idx < SERVICE_PILLARS.length - 1 && <span className="hero-difficulty-separator">|</span>}
              </span>
            ))}
          </div>
          <div className="hero-cta-row">
            <button
              type="button"
              className="btn btn-cta btn-hero btn-cta-primary hero-primary-cta"
              onClick={handleCheckout}
            >
              GET COURSE ACCESS
            </button>
          </div>
          <p className="hero-copy hero-copy-advanced">
            An online service for customized choreography with original dance steps, plus online dance training built
            around your song and style. This education service provides subscription / course access with guided videos
            and support.
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
              Course Access
            </span>
            <span className="trust-item">
              <Zap size={16} />
              Delivery 24-48 hours
            </span>
            <span className="trust-item">
              <Headphones size={16} />
              Support
            </span>
          </div>
        </div>
        <div className="hero-visual hero-visual-advanced">
          <div className="hero-poster-frame">
            <picture>
              <source
                type="image/avif"
                srcSet={`${heroAvif512} 512w, ${heroAvif1024} 1024w`}
                sizes="(max-width: 900px) 70vw, 520px"
              />
              <source
                type="image/webp"
                srcSet={`${heroWebp512} 512w, ${heroWebp1024} 1024w`}
                sizes="(max-width: 900px) 70vw, 520px"
              />
              <img
                src={heroWebp1024}
                alt="AS DANCE premium poster"
                loading="eager"
                decoding="async"
                width="1024"
                height="1536"
                style={{ aspectRatio: "2/3" }}
                fetchpriority="high"
                className="hero-preview-image"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;






import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import welcomeBanner from "../../assets/bg/dhanush.webp";

export default function BannerStrip() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);

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
    const ctx = gsap.context(() => {
      gsap.set(".banner-content-item", { opacity: 0, y: 20 });
      gsap.set(".banner-poster-3d", { opacity: 0, scale: 0.95, rotationY: 5 });

      if (!prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(".banner-content-item", {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1.0,
          clearProps: "all"
        })
          .to(".banner-poster-3d", {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 1.4,
            ease: "elastic.out(1, 0.85)"
          }, "-=0.8");
      } else {
        gsap.to([".banner-content-item", ".banner-poster-3d"], { opacity: 1, duration: 0.5 });
      }

    }, containerRef);

    const handleMouseMove = (e) => {
      if (!imageRef.current || prefersReducedMotion) return;

      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - left) / width - 0.5;
      const relativeY = (e.clientY - top) / height - 0.5;

      gsap.to(imageRef.current, {
        rotationY: relativeX * 6,
        rotationX: -relativeY * 6,
        y: -5,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        rotationY: 0,
        rotationX: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const imgContainer = imageRef.current;
    if (imgContainer) {
      imgContainer.addEventListener("mousemove", handleMouseMove);
      imgContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      ctx.revert();
      if (imgContainer) {
        imgContainer.removeEventListener("mousemove", handleMouseMove);
        imgContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="banner-strip-advanced" id="bundle" ref={containerRef}>
      {/* Hyper-realistic night sky layers */}
      <div className="banner-nebula-haze" aria-hidden="true" />
      <div className="banner-edge-smoke" aria-hidden="true" />
      <div className="banner-sky-fog" aria-hidden="true" />
      <div className="banner-starfield" aria-hidden="true" />
      <div className="shooting-star" aria-hidden="true" />
      <div className="shooting-star alt" aria-hidden="true" />
      <div className="bottom-glow" aria-hidden="true" />
      <div className="bottom-glow right" aria-hidden="true" />

      {/* Realistic moon */}
      <div className="banner-realistic-moon" aria-hidden="true">
        <div className="moon-realistic-surface" />
        <div className="moon-realistic-glow" />
      </div>

      {/* Neon purple-blue rim lighting */}
      <div className="banner-neon-rim-top" aria-hidden="true" />
      <div className="banner-neon-rim-bottom" aria-hidden="true" />
      <div className="banner-neon-rim-left" aria-hidden="true" />
      <div className="banner-neon-rim-right" aria-hidden="true" />

      <div className="banner-marquee-strip">
        <div className="marquee-content">
          <span className="marquee-item">STAGE READY <span className="marquee-dot">•</span></span>
          <span className="marquee-item">COMPETITION WORTHY <span className="marquee-dot">•</span></span>
          <span className="marquee-item">CROWD IMPRESS GUARANTEED <span className="marquee-dot">•</span></span>
          <span className="marquee-item">100% STUDIO GRADE <span className="marquee-dot">•</span></span>
          <span className="marquee-item">NEON ENERGY <span className="marquee-dot">•</span></span>
          <span className="marquee-item">STAGE READY <span className="marquee-dot">•</span></span>
          <span className="marquee-item">COMPETITION WORTHY <span className="marquee-dot">•</span></span>
          <span className="marquee-item">CROWD IMPRESS GUARANTEED <span className="marquee-dot">•</span></span>
          <span className="marquee-item">100% STUDIO GRADE <span className="marquee-dot">•</span></span>
          <span className="marquee-item">NEON ENERGY <span className="marquee-dot">•</span></span>
        </div>
      </div>

      <div className="container-max banner-shell">
        <div className="banner-copy">
          <div className="banner-content-item">
            <div className="banner-welcome-badge" ref={badgeRef}>
              <span style={{ fontSize: '1.1em' }} role="img" aria-label="headphones">🎧</span>
              Welcome to AS DANCE
            </div>
          </div>

          <div className="banner-kicker banner-content-item">AS DANCE PRESENTS</div>

          <h1 className="banner-title-advanced banner-content-item" ref={titleRef}>
            639-Step Premium <br />
            Neon Dance Curriculum
          </h1>

          <div className="banner-stats banner-content-item">
            <span className="banner-stats-digits">639</span> Steps —
            <span className="ms-2">196 Easy | 219 Medium | 226 Hard</span>
          </div>

          <div className="curriculum-pills banner-content-item">
            <span className="curriculum-pill pill-easy">196 Easy</span>
            <span className="curriculum-pill pill-medium">219 Medium</span>
            <span className="curriculum-pill pill-hard">226 Hard</span>
          </div>

          <div className="badge-row banner-content-item">
            <span>Stage Ready</span>
            <span>Competition Worthy</span>
            <span>Crowd Impress Guaranteed</span>
          </div>

          <div className="banner-meta banner-content-item mt-4">
            ₹499 ONLY • ONE-TIME PAYMENT • LIFETIME ACCESS
          </div>
          <p className="banner-tagline banner-content-item mt-3 text-white-50">
            Built for Stage, Battle & Audience Impact — 1 Video, 639 Moves, Real Performance Power
          </p>
        </div>

        <div className="banner-visual banner-content-item">
          <div className="banner-poster-3d" ref={imageRef}>
            <div className="banner-image-layer">
              <span className="ring-shimmer" aria-hidden="true" />
              <span className="ring-particles" aria-hidden="true" />
                <img
                  src={welcomeBanner}
                  alt="AS DANCE welcome banner"
                  loading="eager"
                  decoding="async"
                className="banner-image"
                style={{ width: '100%', borderRadius: '50%', display: 'block' }}
              />
              <div className="scanline-overlay" aria-hidden="true" />
              <div className="banner-reflection" aria-hidden="true" />
            </div>
          </div>
          <div className="banner-buy-wrap">
            <div className="banner-buy-chip">₹499 • 639 Steps</div>
            <button
              type="button"
              className="banner-buy-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

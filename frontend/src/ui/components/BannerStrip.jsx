import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import welcomeBanner from "../../assets/bg/dhanush.webp";

export default function BannerStrip() {
  const nav = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const starLayers = useMemo(() => {
    const reduceStars = typeof window !== "undefined" && (
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      navigator?.connection?.saveData === true
    );
    const buildStars = (count, sizeMin, sizeMax, opacityMin, opacityMax, twinkleMin, twinkleMax, delayMax) => (
      Array.from({ length: count }, () => {
        const size = sizeMin + Math.random() * (sizeMax - sizeMin);
        const opacity = opacityMin + Math.random() * (opacityMax - opacityMin);
        const twinkle = twinkleMin + Math.random() * (twinkleMax - twinkleMin);
        const delay = Math.random() * delayMax;
        return {
          top: Math.random() * 100,
          left: Math.random() * 100,
          size: Number(size.toFixed(2)),
          opacity: Number(opacity.toFixed(2)),
          twinkle: Number(twinkle.toFixed(2)),
          delay: Number(delay.toFixed(2))
        };
      })
    );

    const counts = reduceStars
      ? { far: 10, mid: 8, near: 6 }
      : { far: 18, mid: 16, near: 12 };
    const twinkleMin = reduceStars ? 8 : 6;
    const twinkleMax = reduceStars ? 16 : 16;
    const delayMax = reduceStars ? 8 : 6;

    return {
      far: buildStars(counts.far, 0.6, 1.4, 0.25, 0.5, twinkleMin, twinkleMax, delayMax),
      mid: buildStars(counts.mid, 0.9, 1.8, 0.35, 0.65, twinkleMin, twinkleMax, delayMax),
      near: buildStars(counts.near, 1.1, 2.4, 0.5, 0.85, twinkleMin, twinkleMax, delayMax)
    };
  }, []);

  const handleCheckout = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      nav("/login", { state: { from: target } });
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
      gsap.set(".banner-content-item", { opacity: 0, y: 20 });
      gsap.set(".banner-poster-3d", { opacity: 0, scale: 0.95, rotationY: 5 });

      if (!skipMotion) {
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

    let rafId = null;
    const updateVignette = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max((viewHeight - rect.top) / (viewHeight + rect.height), 0), 1);
      const strength = 0.18 + progress * 0.18;
      const depthShift = (progress - 0.5) * 2;
      el.style.setProperty("--banner-vignette", strength.toFixed(3));
      el.style.setProperty("--banner-scroll-depth", depthShift.toFixed(3));
    };

    updateVignette();

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateVignette();
      });
    };

    if (!skipMotion) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
    }

    if (skipMotion || isCoarsePointer) {
      return () => {
        ctx.revert();
        if (!skipMotion) {
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleScroll);
        }
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }

    const imgContainer = imageRef.current;
    const rotateXTo = imgContainer ? gsap.quickTo(imgContainer, "rotationX", { duration: 0.4, ease: "power2.out" }) : null;
    const rotateYTo = imgContainer ? gsap.quickTo(imgContainer, "rotationY", { duration: 0.4, ease: "power2.out" }) : null;
    const translateYTo = imgContainer ? gsap.quickTo(imgContainer, "y", { duration: 0.4, ease: "power2.out" }) : null;

    const handleMouseMove = (e) => {
      if (!imageRef.current || !rotateXTo || !rotateYTo || !translateYTo) return;

      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - left) / width - 0.5;
      const relativeY = (e.clientY - top) / height - 0.5;

      rotateYTo(relativeX * 3.5);
      rotateXTo(-relativeY * 3.5);
      translateYTo(-4);
    };

    const handleMouseLeave = () => {
      if (!rotateXTo || !rotateYTo || !translateYTo) return;
      rotateYTo(0);
      rotateXTo(0);
      translateYTo(0);
    };

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
      if (!skipMotion) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section className="banner-strip-advanced" id="bundle" ref={containerRef}>
      {/* Advanced Galaxy Nebula Background */}
      <div className="galaxy-nebula-bg" aria-hidden="true">
        <div className="galaxy-nebula-layer" />
        <div className="galaxy-nebula-layer secondary" />
        <div className="banner-starfield depth-far">
          {starLayers.far.map((star, i) => (
            <span
              key={`far-${i}`}
              className="galaxy-star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                "--star-opacity": `${star.opacity}`,
                "--twinkle-duration": `${star.twinkle}s`,
                "--twinkle-delay": `${star.delay}s`
              }}
            />
          ))}
        </div>
        <div className="banner-starfield depth-mid">
          {starLayers.mid.map((star, i) => (
            <span
              key={`mid-${i}`}
              className="galaxy-star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                "--star-opacity": `${star.opacity}`,
                "--twinkle-duration": `${star.twinkle}s`,
                "--twinkle-delay": `${star.delay}s`
              }}
            />
          ))}
        </div>
        <div className="banner-starfield depth-near">
          {starLayers.near.map((star, i) => (
            <span
              key={`near-${i}`}
              className="galaxy-star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                "--star-opacity": `${star.opacity}`,
                "--twinkle-duration": `${star.twinkle}s`,
                "--twinkle-delay": `${star.delay}s`
              }}
            />
          ))}
        </div>
      </div>

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
              {/* Rotating Light Ring */}
              <div className="banner-image-rotator" aria-hidden="true" />

              <span className="ring-shimmer" aria-hidden="true" />
              <img
                src={welcomeBanner}
                alt="AS DANCE welcome banner"
                loading="eager"
                decoding="async"
                width="1280"
                height="720"
                className="banner-image banner-image-stable"
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
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

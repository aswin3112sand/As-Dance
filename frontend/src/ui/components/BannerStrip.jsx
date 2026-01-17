import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { shouldReduceMotion } from "../utils/motion.js";
import bannerAvif420 from "../../assets/optimized/banner-420.avif";
import bannerAvif840 from "../../assets/optimized/banner-840.avif";
import bannerWebp420 from "../../assets/optimized/banner-420.webp";
import bannerWebp840 from "../../assets/optimized/banner-840.webp";

export default function BannerStrip() {
  const nav = useNavigate();
  const { user } = useAuth();
  const starLayers = useMemo(() => {
    const reduceStars = typeof window !== "undefined" && (
      shouldReduceMotion() ||
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches
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

  return (
    <section className="banner-strip-advanced hero" id="bundle">
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

      <div className="container-max banner-shell">
        <div className="banner-copy">
          <div className="banner-content-item">
            <div className="banner-welcome-badge">
              <span style={{ fontSize: '1.1em' }} role="img" aria-label="headphones">🎧</span>
              Welcome to AS DANCE
            </div>
          </div>

          <div className="banner-kicker banner-content-item">AS DANCE PRESENTS</div>

          <h2 className="banner-title-advanced banner-content-item">
            <span className="title-accent">639-Step</span>{" "}
            <span className="title-strong">Premium</span>
            <br />
            <span className="title-neon">Neon</span> Dance Curriculum
          </h2>

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
          <div className="banner-poster-3d">
            <div className="banner-image-layer">
              {/* Rotating Light Ring */}
              <div className="banner-image-rotator" aria-hidden="true" />

              <span className="ring-shimmer" aria-hidden="true" />
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${bannerAvif420} 420w, ${bannerAvif840} 840w`}
                  sizes="(max-width: 900px) 70vw, 420px"
                />
                <source
                  type="image/webp"
                  srcSet={`${bannerWebp420} 420w, ${bannerWebp840} 840w`}
                  sizes="(max-width: 900px) 70vw, 420px"
                />
                <img
                  src={bannerWebp840}
                  alt="AS DANCE welcome banner"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  width="840"
                  height="472"
                  className="banner-image banner-image-stable"
                  style={{ width: "100%", borderRadius: "50%", display: "block" }}
                />
              </picture>
              <div className="scanline-overlay" aria-hidden="true" />
              <div className="banner-reflection" aria-hidden="true" />
            </div>
          </div>
          <div className="banner-buy-wrap">
            <div className="banner-buy-chip">
              <span className="price">₹499</span>
              <span className="sep">•</span>
              <span className="steps">639 Steps</span>
            </div>
            <button
              type="button"
              className="banner-buy-btn"
              onClick={handleCheckout}
            >
              <span className="banner-buy-text">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

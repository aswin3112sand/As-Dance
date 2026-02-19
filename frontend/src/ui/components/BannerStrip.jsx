import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { shouldReduceMotion } from "../utils/motion.js";
import bannerAvif420 from "../../assets/optimized/banner-420.avif";
import bannerAvif840 from "../../assets/optimized/banner-840.avif";
import bannerWebp420 from "../../assets/optimized/banner-420.webp";
import bannerWebp840 from "../../assets/optimized/banner-840.webp";

function BannerStrip() {
  const nav = useNavigate();
  const { user } = useAuth();
  const customQuoteUrl = "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20I%20need%20a%20custom%20choreography%20quote.";
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
      ? { far: 8, mid: 6, near: 4 }
      : { far: 12, mid: 10, near: 8 };
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

  const handleCustomQuote = () => {
    window.open(customQuoteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="banner-strip-advanced hero" id="about">
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
              <span className="banner-welcome-mark" aria-hidden="true">AS</span>
              Welcome to AS DANCE
            </div>
          </div>

          <div className="banner-kicker banner-content-item">START HERE</div>

          <h2 className="banner-title-advanced banner-content-item">
            <span className="title-accent">Customized</span>{" "}
            <span className="title-strong">Choreography</span>
            <br />
            <span className="title-neon">Online</span> Dance Training
          </h2>

          <div className="banner-stats banner-content-item">
            <span className="banner-stats-digits">Original</span> dance steps -
            <span className="ms-2">Song matched | Style aligned | Level guided</span>
          </div>

          <div className="curriculum-pills banner-content-item">
            <span className="curriculum-pill pill-easy">Song matched</span>
            <span className="curriculum-pill pill-medium">Style matched</span>
            <span className="curriculum-pill pill-hard">Guided videos</span>
          </div>

          <div className="badge-row banner-content-item">
            <span>Online service</span>
            <span>Education service</span>
            <span>Secure payment</span>
          </div>

          <div className="banner-meta banner-content-item mt-4">
            Delivery within 24-48 hours after payment
          </div>
          <div className="banner-offer-line banner-content-item">
            Course Access: INR 499 | Custom Choreography: Starts INR 300
          </div>
          <p className="banner-tagline banner-content-item mt-3 text-white-50">
            All services are delivered digitally via Google Drive or private online access.
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
              <span className="price">INR 499</span>
              <span className="sep">|</span>
              <span className="steps">Course Access</span>
            </div>
            <div className="banner-buy-actions">
              <button
                type="button"
                className="banner-buy-btn"
                onClick={handleCheckout}
              >
                <span className="banner-buy-text">Buy Course Access</span>
              </button>
              <button
                type="button"
                className="banner-custom-btn"
                onClick={handleCustomQuote}
              >
                Custom Choreo Quote
              </button>
            </div>
            <p className="banner-buy-note">
              Fixed checkout for course access. Custom choreography is quoted on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(BannerStrip);



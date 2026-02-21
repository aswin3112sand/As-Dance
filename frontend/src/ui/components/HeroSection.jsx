import React, { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { ShieldCheck, Infinity, Zap, Headphones, Music } from "../icons.jsx";
import heroAvif512 from "../../assets/optimized/hero-512.avif";
import heroAvif1024 from "../../assets/optimized/hero-1024.avif";
import heroWebp512 from "../../assets/optimized/hero-512.webp";
import heroWebp1024 from "../../assets/optimized/hero-1024.webp";
import heroLocalVideo from "../../assets/bg/Dance dhoom.mp4";
import heroMelody from "../../assets/bg/Vaarayo-Vaarayo-MassTamilan.dev.mp3";
import dhanushImage from "../../assets/bg/dhanush.webp";

// Replace this stock URL later if you want another background video.
const HERO_VIDEO_STOCK_SRC = "https://videos.pexels.com/video-files/10344331/10344331-hd_1920_1080_25fps.mp4";
const HERO_VIDEO_FALLBACK_SRC = heroLocalVideo;
const HERO_MELODY_SRC = heroMelody;
const HERO_AUDIO_PREF_KEY = "asdance:heroAudioEnabled";

const SERVICE_PILLARS = [
  { name: "Course", value: "639 Steps", className: "hero-level-easy" },
  { name: "Format", value: "Tamil + English", className: "hero-level-medium" },
  { name: "Delivery", value: "Google Drive", className: "hero-level-hard" }
];

const OFFER_ICONS = [
  { label: "One-time INR 499 payment", icon: "*" },
  { label: "Instant dashboard access", icon: "*" },
  { label: "639 practical song-based steps", icon: "*" },
  { label: "20 mins daily self-practice format", icon: "*" }
];

const HeroSection = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const supportUrl = "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20INR%20499%20639-step%20course%20pathi%20detail%20venum.";
  const melodyRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const setSavedAudioPref = (enabled) => {
    try {
      window.localStorage.setItem(HERO_AUDIO_PREF_KEY, enabled ? "true" : "false");
    } catch {
      // Ignore storage errors (private mode / blocked storage).
    }
  };

  const pauseMelodySafely = (melody) => {
    try {
      melody.pause();
    } catch {
      // JSDOM and some environments may not implement media pause.
    }
  };

  const handleCheckout = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      nav(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    nav(target);
  };

  useEffect(() => {
    const melody = melodyRef.current;
    if (!melody) return;

    melody.muted = isMuted;
    melody.volume = isMuted ? 0 : 0.9;
  }, [isMuted]);

  useEffect(() => {
    const melody = melodyRef.current;
    if (!melody) return;

    let shouldAutoEnable = false;
    try {
      shouldAutoEnable = window.localStorage.getItem(HERO_AUDIO_PREF_KEY) === "true";
    } catch {
      shouldAutoEnable = false;
    }

    if (!shouldAutoEnable) return;

    let cancelled = false;
    let interactionHooked = false;

    const removeInteractionRetry = () => {
      if (!interactionHooked) return;
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      interactionHooked = false;
    };

    const startMelody = async () => {
      try {
        melody.muted = false;
        melody.volume = 0.9;
        await melody.play();
        if (!cancelled) {
          setIsMuted(false);
        }
        return true;
      } catch {
        melody.muted = true;
        melody.volume = 0;
        if (!cancelled) {
          setIsMuted(true);
        }
        return false;
      }
    };

    const handleFirstInteraction = async () => {
      removeInteractionRetry();
      const started = await startMelody();
      if (!started) {
        setSavedAudioPref(false);
      }
    };

    const addInteractionRetry = () => {
      if (interactionHooked) return;
      window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
      window.addEventListener("keydown", handleFirstInteraction, { once: true });
      interactionHooked = true;
    };

    const tryAutoplay = async () => {
      const started = await startMelody();
      if (!started) {
        addInteractionRetry();
      }
    };

    void tryAutoplay();

    return () => {
      cancelled = true;
      removeInteractionRetry();
    };
  }, []);

  const toggleHeroAudio = async () => {
    const melody = melodyRef.current;
    if (!melody) return;

    if (isMuted) {
      try {
        melody.muted = false;
        melody.volume = 0.9;
        await melody.play();
        setIsMuted(false);
        setSavedAudioPref(true);
      } catch {
        melody.muted = true;
        melody.volume = 0;
        setIsMuted(true);
        setSavedAudioPref(false);
      }
      return;
    }

    melody.muted = true;
    melody.volume = 0;
    pauseMelodySafely(melody);
    setIsMuted(true);
    setSavedAudioPref(false);
  };

  return (
    <section className="hero-section section bg-hero hero-full" id="about">
      <audio ref={melodyRef} loop preload="auto" playsInline aria-hidden="true" muted={isMuted}>
        <source src={HERO_MELODY_SRC} type="audio/mpeg" />
        <source src={heroLocalVideo} type="audio/mp4" />
      </audio>
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          className="hero-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroWebp1024}
        >
          <source src={HERO_VIDEO_STOCK_SRC} type="video/mp4" />
          <source src={HERO_VIDEO_FALLBACK_SRC} type="video/mp4" />
        </video>
      </div>
      <div className="hero-video-overlay" aria-hidden="true"></div>
      <div className="hero-right-neon-orb" aria-hidden="true">
        <img src={dhanushImage} alt="" className="hero-right-neon-orb-image" loading="lazy" decoding="async" />
      </div>
      <div className={`hero-dhanush-badge ${isMuted ? "" : "is-live"} hero-dhanush-corner`} aria-hidden="true">
        <img src={dhanushImage} alt="" className="hero-dhanush-image" loading="lazy" decoding="async" />
      </div>
      <div className="hero-top-shell">
        <div className="hero-brand-floating">
          <span className="hero-brand-title">AS DANCE</span>
          <span className="hero-brand-subtitle">639 STEP PRACTICAL COURSE</span>
        </div>
        <div className="hero-audio-cluster">
          <button
            type="button"
            className={`hero-audio-toggle ${isMuted ? "is-muted" : "is-live"}`}
            onClick={toggleHeroAudio}
            aria-label={isMuted ? "Enable hero video audio" : "Mute hero video audio"}
            aria-pressed={!isMuted}
          >
            <span className="visually-hidden">
              {isMuted ? "Enable sound" : "Mute sound"}
            </span>
            <span className="hero-audio-icon-wrap" aria-hidden="true">
              <Music size={16} className="hero-audio-icon" />
              <span className={`hero-audio-eq ${isMuted ? "is-muted" : "is-live"}`}>
                <span className="hero-audio-eq-bar"></span>
                <span className="hero-audio-eq-bar"></span>
                <span className="hero-audio-eq-bar"></span>
                <span className="hero-audio-eq-bar"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="hero-fullline-wrap">
        <h1 className="hero-fullline-headline">
          Easy-a start pannunga, step-by-step practice la confident aagunga.
        </h1>
      </div>
      <div className="hero-top-count-row">
        <div className="hero-count-panel">
          <span className="hero-count-value">639</span>
          <span className="hero-count-label">Steps</span>
        </div>
      </div>
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-grid-background" aria-hidden="true"></div>
      <div className="container-max hero-grid hero-grid-advanced">
        <div className="hero-content hero-content-advanced">
          <div className="hero-price-stack">
            <span className="hero-old-price">One-time INR 499 | Dashboard access | Song-based step breakdown</span>
            <span className="hero-price-badge">
              <span className="hero-price-badge-line">🎥 100% Recorded Practical Course</span>
              <span className="hero-price-badge-line">⏳ Learn Anytime. Practice at Your Pace.</span>
            </span>
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
          <div className="hero-cta-row hero-cta-stack">
            <button
              type="button"
              className="btn btn-cta btn-hero btn-cta-primary hero-primary-cta"
              onClick={handleCheckout}
            >
              Pay INR 499 - Access 639 Steps
            </button>
          </div>
          <div className="hero-cta-hint">
            First preview paakanuma?{" "}
            <a href="/preview">
              Video samples inga iruku
            </a>
            {" "} | Still doubt ah?{" "}
            <a href={supportUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp support
            </a>
          </div>
          <p className="hero-copy hero-copy-advanced">
            Payment success apram dashboard open aagum. Appuram Google Drive moolama 639 practical
            steps access panni self-practice start pannalaam.
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
              Lifetime practice access
            </span>
            <span className="trust-item">
              <Zap size={16} />
              Dashboard unlock after payment
            </span>
            <span className="trust-item">
              <Headphones size={16} />
              WhatsApp help
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
                alt="AS DANCE beginner dance program poster"
                loading="lazy"
                decoding="async"
                width="1024"
                height="1536"
                style={{ aspectRatio: "2/3" }}
                fetchpriority="low"
                className="hero-preview-image"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);

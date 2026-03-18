import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import OdometerNumber from "./OdometerNumber.jsx";
import Reveal from "./Reveal.jsx";
import "./RealtimeBundleSection.css";

const CHECKOUT_TARGET = "/checkout?pay=1";
const WA_ENQUIRY =
  "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20live%20batch%20waitlist%20pathi%20clarity%20venum.";
const COUNTDOWN_TARGET_HOUR = 20;

const BUNDLES = [
  {
    id: "starter",
    name: "Easy | Foundation",
    tagline: "33% of the pyramid for melody songs, soft beats, and shy beginners who need rhythm lock before speed.",
    price: "213 Steps",
    priceNote: "Included inside the INR 499 mastery unlock.",
    badge: "Start here",
    accent: "#36f3ff",
    accentHex: "54, 243, 255",
    cta: "Unlock Full 639 Bundle",
    ctaType: "checkout",
    features: [
      "Rhythm lock for melody tracks and soft-beat songs",
      "Body control, wave basics, and slow-groove confidence",
      "Tamil + English counts for shy beginners",
      "Completion-friendly drills before speed work begins",
      "Best starting point for first reels and wedding intros",
      "Foundation layer inside the same INR 499 bundle",
    ],
    summaryLine: "100% beginner-friendly base for learners who want clarity before complexity.",
  },
  {
    id: "performer",
    name: "Medium | Sync Pro",
    tagline: "33% of the pyramid for Bollywood timing, expression, footwork, and visible group-flow confidence.",
    price: "213 Steps",
    priceNote: "Unlocked inside the same INR 499 mastery bundle.",
    badge: "Confidence jump",
    accent: "#ffd166",
    accentHex: "255, 209, 102",
    cta: "Unlock Full 639 Bundle",
    ctaType: "checkout",
    features: [
      "Expression, isolations, and sync drills for reel work",
      "Footwork and group timing for culturals and public performance",
      "Confidence bridge from solo basics into visible output",
      "Cleaner combo sequencing for camera and stage transitions",
      "Best for learners moving from practice room to public moments",
      "Same bundle unlock with no extra medium-level fee",
    ],
    summaryLine: "A strong confidence jump for learners moving from basics into visible performance.",
  },
  {
    id: "event",
    name: "Hard | Stage Beast",
    tagline: "34% of the pyramid for aggressive tracks, power delivery, fast sync, and camera-command performance.",
    price: "213 Steps",
    priceNote: "Final layer inside the same INR 499 mastery unlock.",
    badge: "Stage finish",
    accent: "#ff7a59",
    accentHex: "255, 122, 89",
    cta: "Unlock Full 639 Bundle",
    ctaType: "checkout",
    features: [
      "Aggressive-track handling, power delivery, and fast sync",
      "Stage pressure, camera focus, and performance stamina drills",
      "Final layer for rap power, show openings, and stage sets",
      "Optional custom choreography extension when song-specific output is needed",
      "Best for advanced presentation after Easy and Medium are stable",
      "Still included in the same 639-step ladder",
    ],
    summaryLine: "Built for stage-beast energy, camera command, and premium performance finish.",
  },
];

const UNLOCK_MESSAGES = [
  "Keerthana moved from Easy drills into a confident wedding set flow.",
  "Sanjay used Medium sync steps to prep faster for culturals season.",
  "A new learner unlocked the full 639 pyramid after the free preview.",
  "Monisha asked for Hard-level polish plus a custom extension.",
  "Bundle buyers are using one system for reels, weddings, and stage practice.",
  "Live batches are planned for Q3 2026 after the digital mastery path.",
];

function getTimeUntilNextBatch() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(COUNTDOWN_TARGET_HOUR, 0, 0, 0);

  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  return Math.max(target.getTime() - now.getTime(), 0);
}

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function useLiveLearners(base = 143) {
  const [count, setCount] = useState(base);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCount((current) => {
        const next = current + Math.floor(Math.random() * 3) - 1;
        return Math.min(base + 8, Math.max(base - 8, next));
      });
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [base]);

  return count;
}

function useCountdown() {
  const [remaining, setRemaining] = useState(() => getTimeUntilNextBatch());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemaining(getTimeUntilNextBatch());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return formatDuration(remaining);
}

function useUnlockTicker(messages) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [messages]);

  return messages[index];
}

function RealtimeBundleSection() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [activeBundleId, setActiveBundleId] = useState(BUNDLES[0].id);

  const liveCount = useLiveLearners();
  const countdown = useCountdown();
  const tickerMessage = useUnlockTicker(UNLOCK_MESSAGES);
  const activeBundle = useMemo(
    () => BUNDLES.find((bundle) => bundle.id === activeBundleId) || BUNDLES[0],
    [activeBundleId]
  );
  const activeStyle = useMemo(
    () => ({
      "--accent": activeBundle.accent,
      "--accentHex": activeBundle.accentHex,
      "--accent-hex": activeBundle.accentHex,
    }),
    [activeBundle.accent, activeBundle.accentHex]
  );

  const handleBundleChange = useCallback((bundleId) => {
    setActiveBundleId(bundleId);
  }, []);

  const handleBundleCta = useCallback(() => {
    if (activeBundle.ctaType === "checkout") {
      if (user?.hasPaid || user?.unlocked) {
        nav("/dashboard");
        return;
      }
      if (!user) {
        nav(`/login?redirect=${encodeURIComponent(CHECKOUT_TARGET)}`);
        return;
      }
      nav(CHECKOUT_TARGET);
      return;
    }

    if (activeBundle.ctaType === "whatsapp") {
      window.open(WA_ENQUIRY, "_blank", "noopener,noreferrer");
      return;
    }

    nav("/services");
  }, [activeBundle.ctaType, nav, user]);

  return (
    <section className="section-shell rbs-section" aria-labelledby="realtime-bundle-title">
      <div className="rbs-fog rbs-fog--cyan" aria-hidden="true" />
      <div className="rbs-fog rbs-fog--orange" aria-hidden="true" />

      <div className="container-max rbs-container">
        <Reveal>
          <div className="rbs-status-bar" role="status" aria-label="Realtime bundle status">
            <span className="rbs-status-item">
              <span className="rbs-live-dot" aria-hidden="true" />
              <OdometerNumber value={String(liveCount)} className="odometer--compact odometer--cyan" /> learners active now
            </span>
            <span className="rbs-status-separator" aria-hidden="true" />
            <span className="rbs-status-item rbs-status-item--danger">
              <OdometerNumber value="213" className="odometer--compact odometer--danger" /> steps per level
            </span>
            <span className="rbs-status-separator" aria-hidden="true" />
            <span className="rbs-status-item rbs-status-item--gold">
              Next support window in <OdometerNumber value={countdown} className="odometer--compact odometer--gold odometer--countdown" />
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div className="rbs-ticker" aria-live="polite">
            <span className="rbs-ticker-dot" aria-hidden="true" />
            <span key={tickerMessage} className="rbs-ticker-copy">
              {tickerMessage}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rbs-heading">
            <span className="rbs-heading-kicker">Mastery Bundle Breakdown</span>
            <h2 id="realtime-bundle-title" className="rbs-title">
              See how the 639-step pyramid turns shy beginners into stage-ready performers.
            </h2>
            <p className="rbs-copy">
              Each level holds 213 steps. The full INR 499 unlock stacks progression, measurable confidence, and real-world performance use cases into one system.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="rbs-tabs" role="tablist" aria-label="Mastery bundle levels">
            {BUNDLES.map((bundle) => {
              const isActive = bundle.id === activeBundle.id;
              const tabStyle = {
                "--accent": bundle.accent,
                "--accentHex": bundle.accentHex,
                "--accent-hex": bundle.accentHex,
              };

              return (
                <button
                  key={bundle.id}
                  id={`rbs-tab-${bundle.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="rbs-active-panel"
                  className={`rbs-tab${isActive ? " rbs-tab--active" : ""}`}
                  style={tabStyle}
                  onClick={() => handleBundleChange(bundle.id)}
                >
                  {bundle.badge ? <span className="rbs-tab-badge">{bundle.badge}</span> : null}
                  <span className="rbs-tab-name">{bundle.name}</span>
                  <span className="rbs-tab-price">{bundle.price}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            key={activeBundle.id}
            id="rbs-active-panel"
            role="tabpanel"
            aria-labelledby={`rbs-tab-${activeBundle.id}`}
            className="rbs-panel"
            style={activeStyle}
          >
            <div className="rbs-panel-main">
              <div className="rbs-panel-copy">
                <span className="rbs-panel-label">Selected bundle</span>
                <h3 className="rbs-panel-title">{activeBundle.name}</h3>
                <p className="rbs-panel-tagline">{activeBundle.tagline}</p>
              </div>

              <ul className="rbs-features-list">
                {activeBundle.features.map((feature) => (
                  <li key={feature} className="rbs-feature-item">
                    <span className="rbs-feature-check" aria-hidden="true">
                      {"\u2713"}
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rbs-summary">
              <span className="rbs-summary-label">Level summary</span>
              <div className="rbs-summary-price">{activeBundle.price}</div>
              <p className="rbs-summary-note">{activeBundle.priceNote}</p>
              <p className="rbs-summary-line">{activeBundle.summaryLine}</p>

              <div className="rbs-summary-stack">
                <div className="rbs-summary-pill">INR 499 unlock</div>
                <div className="rbs-summary-pill">
                  Tamil + English cues
                </div>
              </div>

              <button type="button" className="rbs-cta" onClick={handleBundleCta}>
                {activeBundle.cta}
              </button>

              <p className="rbs-summary-footnote">
                All three levels sit inside the same bundle. Custom choreography add-ons stay separate on the service page.
              </p>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(RealtimeBundleSection);

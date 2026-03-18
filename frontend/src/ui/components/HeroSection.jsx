import React, { memo, useMemo, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Clock,
  CreditCard,
  Crown,
  Lock,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Unlock,
  Users,
  Video,
} from "../icons.jsx";
import Button from "./Button.jsx";
import GlassCard from "./GlassCard.jsx";
import OdometerNumber from "./OdometerNumber.jsx";
import {
  cardHover,
  fadeInSoft,
  fadeInUp,
  imageReveal,
  staggerContainer,
} from "../motion/variants.js";
import starterPreview from "../../assets/bg/DanceTut.webp";
import performerPreview from "../../assets/bg/w14.webp";
import eventPreview from "../../assets/bg/dhanush.webp";
import heroDanceVideo from "../../assets/bg/Dance dhoom.mp4";

const HERO_POSTER_IMAGE = "/og-cover.webp";

const HERO_METRICS = [
  {
    id: "progress",
    value: "90%",
    odometerValue: "90",
    suffix: "%",
    label: "30-Day Shift",
    copy: "90% of beginners reach medium-level confidence faster when they follow the Easy to Hard order.",
    icon: Users,
    tone: "gold",
  },
  {
    id: "split",
    value: "213 x 3",
    label: "Level Split",
    copy: "Easy, Medium, and Hard each carry 213 mapped steps inside the mastery pyramid.",
    icon: Crown,
    tone: "copper",
  },
  {
    id: "guidance",
    value: "Tamil + English",
    label: "Cue System",
    copy: "Counts, corrections, and song-feel cues stay readable for beginners and performers.",
    icon: MessageCircle,
    tone: "cyan",
  },
  {
    id: "safety",
    value: "Fit-First",
    label: "Risk Check",
    copy: "Preview the style first and buy only when the flow matches your energy.",
    icon: ShieldCheck,
    tone: "emerald",
  },
];

const HERO_JOURNEY = [
  { id: "free-class", label: "Free Preview", copy: "WhatsApp-first style check before payment" },
  { id: "checkout", label: "Unlock Bundle", copy: "One-time INR 499 mastery unlock" },
  { id: "dashboard", label: "Train", copy: "Dashboard opens the Easy to Hard progression" },
];

const HERO_CHOREO_TAGS = ["Wedding Intro", "Reels", "Culturals", "Stage Sets"];

const HERO_STATES = [
  {
    id: "guest",
    title: "Start with free preview",
    label: "Preview State",
    copy: "Check the style fit before you pay.",
    icon: Lock,
  },
  {
    id: "unpaid",
    title: "Unlock INR 499",
    label: "Bundle State",
    copy: "One payment opens the full 639-step mastery ladder.",
    icon: CreditCard,
  },
  {
    id: "paid",
    title: "Dashboard unlocked",
    label: "Unlocked State",
    copy: "Easy, Medium, and Hard access are ready in one place.",
    icon: Unlock,
  },
];

const HERO_BUNDLES = [
  {
    id: "starter",
    name: "639 Mastery",
    price: "INR 499",
    badge: "Unlock now",
    accent: "#d4af37",
    accentRgb: "212, 175, 55",
    image: starterPreview,
    previewLabel: "Easy -> Hard",
    summary: "213 Easy + 213 Medium + 213 Hard steps with Tamil + English cues, song mapping, and lifetime dashboard access.",
    points: [
      "90% of beginners use the structured order to reach medium-level confidence faster",
      "Melody, Bollywood, and aggressive track logic packed into one mastery pyramid",
      "Best fit for reels, weddings, culturals, and camera-ready practice",
    ],
  },
  {
    id: "performer",
    name: "Live Batch",
    price: "Q3 2026",
    badge: "Coming later",
    accent: "#d8dbe2",
    accentRgb: "216, 219, 226",
    image: performerPreview,
    previewLabel: "Future coaching",
    summary: "Digital bundle now. Live batches are planned for Q3 2026 for learners who want direct coaching after the recorded path.",
    points: [
      "Join the waitlist if you want guided batch coaching later",
      "Built as the next step after the 639 digital system",
      "Keeps the current sales path clean: preview now, bundle now, live later",
    ],
  },
  {
    id: "event",
    name: "Custom Choreo",
    price: "INR 300-500",
    badge: "Tiered quote",
    accent: "#b87333",
    accentRgb: "184, 115, 51",
    image: eventPreview,
    previewLabel: "Per 30 sec",
    summary: "Easy, Medium, and Hard choreography pricing scales by clip count so wedding intros, reels, and stage sets can be quoted clearly.",
    points: [
      "Easy INR 300, Medium INR 400, Hard INR 500 per 30-second clip",
      "INR 200 personalization and INR 500 rehearsal-video add-ons available",
      "Best for event-led routines that need song-specific planning",
    ],
  },
];

function renderAction({
  label,
  onClick,
  to,
  href,
  variant = "primary",
  icon = null,
  className = "",
}) {
  if (!label) return null;

  if (to) {
    return (
      <Button to={to} variant={variant} className={className}>
        {label}
        {icon}
      </Button>
    );
  }

  if (href) {
    return (
      <Button
        href={href}
        variant={variant}
        className={className}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        {label}
        {icon}
      </Button>
    );
  }

  return (
    <Button type="button" variant={variant} onClick={onClick} className={className}>
      {label}
      {icon}
    </Button>
  );
}

function mergeActionClass(action, className) {
  if (!action) return action;
  return {
    ...action,
    className: [action.className, className].filter(Boolean).join(" "),
  };
}

function HeroSection({
  title = "639 Steps = Mastery Pyramid",
  subtitle = "Train through 213 Easy, 213 Medium, and 213 Hard steps with Tamil + English cues, confidence metrics, and one clear INR 499 unlock.",
  primaryAction,
  secondaryAction,
  courseAction,
  waitlistAction,
  serviceAction,
  userState = "guest",
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeBundleId, setActiveBundleId] = useState(HERO_BUNDLES[0].id);
  const currentState = useMemo(
    () => HERO_STATES.find((state) => state.id === userState) || HERO_STATES[0],
    [userState]
  );
  const activeBundle = useMemo(
    () => HERO_BUNDLES.find((bundle) => bundle.id === activeBundleId) || HERO_BUNDLES[0],
    [activeBundleId]
  );
  const bundleStyle = useMemo(
    () => ({
      "--hero-bundle-accent": activeBundle.accent,
      "--hero-bundle-accent-rgb": activeBundle.accentRgb,
    }),
    [activeBundle.accent, activeBundle.accentRgb]
  );

  const bundleAction = useMemo(() => {
    if (activeBundle.id === "performer") return waitlistAction;
    if (activeBundle.id === "event") return serviceAction;
    return courseAction;
  }, [activeBundle.id, courseAction, serviceAction, waitlistAction]);

  const checkoutProgress = userState === "paid" ? 100 : userState === "unpaid" ? 60 : 20;

  return (
    <section id="about" className={`hero section-shell section-shell--tight hero--${userState}`}>
      <div className="container-max">
        <div className="hero__bento">
          <m.div
            className="hero__copy-shell"
            variants={staggerContainer(prefersReducedMotion ? 0.08 : 0.12, 0.02)}
            initial="hidden"
            animate="visible"
          >
            <GlassCard accent="gold" className="hero__copy hero__panel">
              <m.div className="hero__copy-top" variants={fadeInSoft}>
                <div className="hero__label">
                  <span className="chip chip--gold">
                    <Sparkles size={14} aria-hidden="true" />
                    639-step mastery path
                  </span>
                  <span className="chip hero__state-chip">
                    <Activity size={14} aria-hidden="true" />
                    {currentState.label}
                  </span>
                </div>

                <div className="hero__copy-grid">
                  <div className="hero__copy-main">
                    <div className="hero__headline-stack">
                      <span className="hero__kicker">Mastery Pyramid</span>
                      <m.h1 className="hero__title" variants={fadeInUp}>
                        {title}
                      </m.h1>
                      <m.p className="hero__subheadline" variants={fadeInSoft}>
                        Easy to Hard progression. INR 499 one-time unlock.
                      </m.p>
                      <m.p className="hero__lead" variants={fadeInSoft}>
                        {subtitle}
                      </m.p>
                    </div>

                    <m.div className="button-row hero__actions" variants={staggerContainer(0.08, 0)}>
                      <m.div variants={fadeInSoft}>
                        {renderAction({
                          ...mergeActionClass(
                            primaryAction,
                            userState === "guest" ? "hero__action hero__action--pulse" : "hero__action"
                          ),
                          icon: <ArrowRight size={16} aria-hidden="true" />,
                        })}
                      </m.div>
                      <m.div variants={fadeInSoft}>
                        {renderAction(
                          mergeActionClass(
                            secondaryAction,
                            userState === "unpaid" ? "hero__action hero__action--focus" : "hero__action"
                          )
                        )}
                      </m.div>
                    </m.div>
                  </div>

                  <div className="hero__preview-stack" aria-label="Dance bundle image previews">
                    {HERO_BUNDLES.map((bundle, index) => (
                      <button
                        key={bundle.id}
                        type="button"
                        className={`hero__preview-tile${bundle.id === activeBundle.id ? " is-active" : ""}${
                          index === 0 ? " hero__preview-tile--featured" : ""
                        }`}
                        onClick={() => setActiveBundleId(bundle.id)}
                      >
                        <img
                          src={bundle.image}
                          alt={`${bundle.name} bundle preview`}
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding="async"
                          fetchpriority={index === 0 ? "high" : "low"}
                          width="720"
                          height="960"
                        />
                        <span className="hero__preview-overlay">
                          <span className="hero__preview-kicker">{bundle.previewLabel}</span>
                          <strong>{bundle.name}</strong>
                          <span className="hero__preview-price">{bundle.price}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </m.div>

              <m.div className="hero__progress" variants={fadeInSoft} aria-label="Checkout progress simulator">
                <div className="hero__progress-head">
                  <strong>{currentState.title}</strong>
                  <span>{checkoutProgress}% journey readiness</span>
                </div>
                <div className="hero__progress-track" aria-hidden="true">
                  <div className="hero__progress-fill" style={{ width: `${checkoutProgress}%` }} />
                </div>
                <div className="hero__progress-steps">
                  {HERO_JOURNEY.map((step, index) => (
                    <div
                      key={step.id}
                      className={`hero__progress-step${
                        checkoutProgress >= (index + 1) * 33 ? " is-active" : ""
                      }`}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{step.label}</strong>
                    </div>
                  ))}
                </div>
              </m.div>
            </GlassCard>
          </m.div>

          <m.div
            className="hero__video-shell"
            initial="hidden"
            animate="visible"
            variants={imageReveal}
            custom={0.1}
          >
            <GlassCard className="hero__video hero__panel">
              <div className="hero__video-media">
                <video
                  className="hero__video-element"
                  autoPlay={!prefersReducedMotion}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={HERO_POSTER_IMAGE}
                  aria-label="AS Dance choreography preview"
                >
                  <source src={heroDanceVideo} type="video/mp4" />
                </video>

                <div className="hero__video-overlay">
                  <span className="hero__play-orb" aria-hidden="true">
                    <PlayCircle size={26} />
                  </span>

                  <div className="hero__video-copy">
                    <span>Cinema-Mapped Preview</span>
                    <strong>See how melody, sync, and stage energy translate into the full training flow.</strong>
                  </div>

                  <span className="hero__video-ring" aria-hidden="true">
                    <Video size={18} />
                  </span>
                </div>
              </div>
            </GlassCard>
          </m.div>

          <m.div
            className="hero__metrics-shell"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(prefersReducedMotion ? 0.07 : 0.09, 0.14)}
          >
            <GlassCard className="hero__metrics hero__panel">
              <div className="hero__metrics-grid">
                {HERO_METRICS.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <m.div
                      key={metric.id}
                      className={`hero__metric hero__metric--${metric.tone}`}
                      variants={fadeInSoft}
                      whileHover={prefersReducedMotion ? undefined : cardHover}
                    >
                      <span className="hero__metric-icon">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="hero__metric-label">{metric.label}</span>
                      <strong className="hero__metric-value">
                        {metric.odometerValue ? (
                          <OdometerNumber
                            value={metric.odometerValue}
                            suffix={metric.suffix || ""}
                            className="odometer--hero-metric"
                          />
                        ) : (
                          metric.value
                        )}
                      </strong>
                      <p>{metric.copy}</p>
                    </m.div>
                  );
                })}
              </div>
            </GlassCard>
          </m.div>

          <m.div className="hero__path-shell" initial="hidden" animate="visible" variants={fadeInSoft}>
            <GlassCard className="hero__path hero__panel">
              <span className="hero__card-kicker">Conversion Flow</span>
              <strong className="hero__card-title">Free Preview to Mastery Unlock</strong>
              <div className="hero__journey-list">
                {HERO_JOURNEY.map((step, index) => (
                  <div key={step.id} className="hero__journey-step">
                    <span className="hero__journey-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{step.label}</strong>
                      <span>{step.copy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </m.div>

          <m.div className="hero__custom-shell" initial="hidden" animate="visible" variants={fadeInSoft}>
            <GlassCard className="hero__custom hero__panel">
              <span className="hero__card-kicker">Tiered Choreo</span>
              <strong className="hero__card-title">Easy / Medium / Hard quote logic</strong>
              <p className="hero__card-copy">
                Select a tier, send the clip length, and move to a clear WhatsApp quote without confusing the bundle pricing.
              </p>
              <div className="hero__tag-grid">
                {HERO_CHOREO_TAGS.map((item) => (
                  <span key={item} className="hero__tag">
                    <Crown size={15} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </GlassCard>
          </m.div>

          <m.div className="hero__bundle-shell" initial="hidden" animate="visible" variants={fadeInSoft}>
            <GlassCard className="hero__bundle hero__panel" style={bundleStyle}>
              <div className="hero__bundle-top">
                <span className="hero__live-pill">
                  <Activity size={14} aria-hidden="true" />
                  <OdometerNumber value="23" className="odometer--compact" /> learners active now
                </span>
                <span className="hero__live-pill hero__live-pill--cyan">
                  <Clock size={14} aria-hidden="true" />
                  Live Batches Q3 2026
                </span>
              </div>

              <div className="hero__bundle-tabs" role="tablist" aria-label="Bundle selector preview">
                {HERO_BUNDLES.map((bundle) => (
                  <button
                    key={bundle.id}
                    type="button"
                    role="tab"
                    aria-selected={bundle.id === activeBundle.id}
                    className={`hero__bundle-tab${bundle.id === activeBundle.id ? " is-active" : ""}`}
                    onClick={() => setActiveBundleId(bundle.id)}
                  >
                    <span>{bundle.name}</span>
                    <strong>{bundle.price}</strong>
                  </button>
                ))}
              </div>

              <div className="hero__bundle-body">
                <div className="hero__bundle-copy">
                  <span className="hero__bundle-badge">{activeBundle.badge}</span>
                  <strong>{activeBundle.name}</strong>
                  <p>{activeBundle.summary}</p>
                </div>

                <ul className="hero__bundle-list">
                  {activeBundle.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="hero__state-rail" aria-label="Personalization states">
                {HERO_STATES.map((state) => {
                  const Icon = state.icon;
                  const isCurrent = state.id === userState;

                  return (
                    <article
                      key={state.id}
                      className={`hero__state-card hero__state-card--${state.id}${isCurrent ? " is-current" : ""}`}
                    >
                      <span className="hero__state-icon">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <div className="hero__state-copy">
                        <strong>{state.label}</strong>
                        <span>{state.title}</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="hero__bundle-action">
                {renderAction(
                  mergeActionClass(
                    bundleAction,
                    userState === "paid" && activeBundle.id === "starter"
                      ? "hero__action hero__action--success"
                      : "hero__action"
                  )
                )}
              </div>
            </GlassCard>
          </m.div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);

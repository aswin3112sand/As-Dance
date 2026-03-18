import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Crown,
  Mail,
  MessageCircle,
  Music,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  WhatsApp,
  Zap,
} from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import HeroSection from "../components/HeroSection.jsx";
import GlassCard from "../components/GlassCard.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Button from "../components/Button.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import {
  cardHover,
  defaultViewport,
  fadeInSoft,
  fadeInUp,
  imageReveal,
  scaleIn,
  staggerContainer,
} from "../motion/variants.js";
import bundleImage from "../../assets/bg/poster.webp";
import supportImage from "../../assets/bg/DanceTut.webp";

const DeferredDemoSection = lazy(() => import("../components/DemoSection.jsx"));
const DeferredRealtimeBundleSection = lazy(() => import("../components/RealtimeBundleSection.jsx"));
const DeferredReviewLoop = lazy(() => import("../components/ReviewLoop.jsx"));

const CHECKOUT_TARGET = "/checkout?pay=1";
const FREE_CLASS_WA_LINK =
  "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20free%20style-check%20preview%20venum.%20Bundle%20before%20fit%20paakanum.";
const COURSE_WA_LINK =
  "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20639-step%20mastery%20bundle%20pathi%20clarity%20venum.";

const NAV_SECTIONS = [
  { id: "about", label: "Mastery" },
  { id: "styles", label: "Levels" },
  { id: "results", label: "Results" },
  { id: "pricing", label: "Offers" },
  { id: "contacts", label: "Support" },
];

const TRUST_SIGNALS = [
  {
    icon: Sparkles,
    value: "90% reach Medium",
    copy: "Most shy beginners move into medium-level comfort within 30 days when they follow the step order.",
  },
  {
    icon: Target,
    value: "213 x 3 pyramid",
    copy: "Easy, Medium, and Hard each hold 213 steps instead of random clips and disconnected reels.",
  },
  {
    icon: Users,
    value: "Reels to weddings",
    copy: "One bundle supports reels, culturals, wedding intros, and stage-prep practice.",
  },
  {
    icon: ShieldCheck,
    value: "Preview before pay",
    copy: "Free style-check first. Buy only when the teaching flow matches your energy.",
  },
];

const STYLE_CARDS = [
  { icon: Music, title: "Easy Foundation", price: "Included in INR 499", copy: "Melody tracks, soft-beat grooves, rhythm lock, and beginner-safe body control." },
  { icon: Crown, title: "Medium Sync Pro", price: "Included in INR 499", copy: "Bollywood timing, expression, footwork, and group-flow confidence for reels and culturals." },
  { icon: Zap, title: "Hard Stage Beast", price: "Included in INR 499", copy: "Aggressive power, fast sync, camera-ready pressure control, and stage-delivery energy." },
  { icon: Sparkles, title: "Song Mastery", price: "90% song coverage", copy: "Train across melody, Bollywood, and aggressive songs with mapped practice logic." },
  { icon: Trophy, title: "Reel to Stage ROI", price: "Real-world use", copy: "Use the same system for wedding intros, college performances, reels, and spotlight moments." },
  { icon: PlayCircle, title: "Custom Choreo", price: "INR 300-500 / 30 sec", copy: "Clip-wise pricing for event-led routines with clear add-ons and WhatsApp quote flow." },
];

const WHY_CARDS = [
  {
    icon: ShieldCheck,
    title: "Random reel copy",
    copy: "Practice breaks when every song starts from zero and no repeatable system holds the learning together.",
  },
  {
    icon: Trophy,
    title: "No progress system",
    copy: "Without level-based order, beginners stay stuck between saved reels, half-learned combos, and inconsistent growth.",
  },
  {
    icon: Clock,
    title: "Confidence gap",
    copy: "Stage fear lasts longer when basics never become sync, expression, and performance drills.",
  },
  {
    icon: Users,
    title: "Structured 639-step fix",
    copy: "The mastery pyramid gives a clear order: Easy first, Medium next, Hard finish, then premium custom extensions if needed.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is the INR 499 bundle live or recorded?",
    answer: "It is a recorded digital mastery bundle with guided structure, repeat-friendly practice, and support channels.",
  },
  {
    question: "How are the 639 steps split?",
    answer: "The bundle is split into 213 Easy, 213 Medium, and 213 Hard steps so progress feels measurable and clean.",
  },
  {
    question: "Do custom choreography tiers use separate pricing?",
    answer: "Yes. Easy is INR 300, Medium is INR 400, and Hard is INR 500 per 30-second clip. Add-ons stay separate.",
  },
  {
    question: "What if I am unsure before buying?",
    answer: "Start with the free WhatsApp preview first. If the flow fits your style, then move to the bundle or custom quote.",
  },
];

function SectionFallback({ id, title, minHeight }) {
  return (
    <section id={id} className="section-shell section-shell--tight deferred-section__placeholder" style={{ minHeight }}>
      <div className="container-max">
        <GlassCard className="deferred-section__card">
          <span className="chip chip--gold">{title}</span>
          <p>Loading the next bundle section...</p>
        </GlassCard>
      </div>
    </section>
  );
}

function DeferredSection({ id = "", title, minHeight, children }) {
  const hostRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || typeof window === "undefined") return undefined;

    const node = hostRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={hostRef} className="deferred-section" style={!shouldRender ? { minHeight } : undefined}>
      {shouldRender ? children : <SectionFallback id={id} title={title} minHeight={minHeight} />}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0].id);

  useEffect(() => {
    let rafId = null;

    const updateScrollState = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(currentY > 12);
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const checkoutRoute = useMemo(() => {
    if (user?.unlocked) return "/dashboard";
    if (!user) return `/login?redirect=${encodeURIComponent(CHECKOUT_TARGET)}`;
    return CHECKOUT_TARGET;
  }, [user]);

  const handleCourseCta = () => {
    navigate(checkoutRoute);
  };

  const handleCustomService = () => {
    navigate("/services");
  };

  const navLinks = useMemo(
    () => NAV_SECTIONS.map((item) => ({ key: item.id, label: item.label, href: `#${item.id}` })),
    []
  );
  const gridViewport = { ...defaultViewport, amount: 0.18 };
  const staggerStep = prefersReducedMotion ? 0.08 : 0.14;

  return (
    <MainLayout
      navProps={{
        links: navLinks,
        activeKey: activeSection,
        isScrolled,
        ctaLabel: user?.unlocked ? "Open Dashboard" : "Unlock 639 Bundle",
        ctaTo: checkoutRoute,
        secondaryLabel: "Free Preview",
        secondaryHref: "#preview",
      }}
    >
      <HeroSection
        primaryAction={{ label: "Free WhatsApp Preview", href: FREE_CLASS_WA_LINK }}
        secondaryAction={{
          label: user?.unlocked ? "Open Dashboard" : "Bundle Questions",
          href: user?.unlocked ? "" : COURSE_WA_LINK,
          to: user?.unlocked ? "/dashboard" : "",
          variant: user?.unlocked ? "secondary" : "danger",
        }}
        userState={user?.unlocked ? "paid" : user ? "unpaid" : "guest"}
        courseAction={{
          label: user?.unlocked ? "Open Dashboard" : "Unlock 639 Bundle",
          to: checkoutRoute,
        }}
        waitlistAction={{
          label: "Join Live Batch Waitlist",
          href: COURSE_WA_LINK,
          variant: "secondary",
        }}
        serviceAction={{
          label: "Request Tiered Quote",
          to: "/services",
          variant: "secondary",
        }}
      />

      <section className="section-shell section-shell--tight">
        <div className="container-max">
          <m.div
            className="home-strip"
            variants={staggerContainer(staggerStep, 0.04)}
            initial="hidden"
            whileInView="visible"
            viewport={gridViewport}
          >
            {TRUST_SIGNALS.map((item) => {
              const Icon = item.icon;
              return (
                <m.div key={item.value} variants={fadeInSoft} whileHover={prefersReducedMotion ? undefined : cardHover}>
                  <GlassCard className="signal-card">
                    <span className="icon-orb">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <strong>{item.value}</strong>
                    <p style={{ margin: 0 }}>{item.copy}</p>
                  </GlassCard>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      <section id="styles" className="section-shell">
        <div className="container-max">
          <ScrollReveal variant={fadeInSoft}>
            <SectionHeader
              eyebrow="Inside the mastery system"
              title={
                <>
                  Train by level, song energy, and <span className="display-accent">real-world use case</span>
                </>
              }
              description="The bundle is not random content. It is a mapped path for melody songs, Bollywood sync, aggressive stage energy, and real performance output."
            />
          </ScrollReveal>

          <m.div
            className="feature-grid"
            variants={staggerContainer(staggerStep, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={gridViewport}
          >
            {STYLE_CARDS.map((item, index) => {
              const Icon = item.icon;
              return (
                <m.div key={item.title} variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
                  <GlassCard className="style-card" accent={index === 1 ? "gold" : ""}>
                    <div className="style-card__top">
                      <div>
                        <span className="icon-orb">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <h3 style={{ margin: 0 }}>{item.title}</h3>
                      </div>
                      <span className="style-card__price">{item.price}</span>
                    </div>
                    <p style={{ margin: 0 }}>{item.copy}</p>
                    <Button type="button" variant="ghost" onClick={item.title === "Choreography" ? handleCustomService : handleCourseCta}>
                      View details
                      <ArrowRight size={16} aria-hidden="true" />
                    </Button>
                  </GlassCard>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      <section id="results" className="section-shell section-shell--tight">
        <div className="container-max">
          <ScrollReveal variant={fadeInSoft}>
            <SectionHeader
              eyebrow="Why this system works"
              title={
                <>
                  Fix the broken practice loop before asking for <span className="display-accent">performance confidence</span>
                </>
              }
              description="The real problem is not talent. It is random practice, no progression logic, and no confidence bridge from beginner drills to visible performance."
            />
          </ScrollReveal>

          <m.div
            className="grid-4"
            variants={staggerContainer(staggerStep, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={gridViewport}
          >
            {WHY_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <m.div key={item.title} variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
                  <GlassCard className="proof-card">
                    <span className="icon-orb">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h3 style={{ margin: 0 }}>{item.title}</h3>
                    <p style={{ margin: 0 }}>{item.copy}</p>
                  </GlassCard>
                </m.div>
              );
            })}
          </m.div>

          <div className="story-band" style={{ marginTop: "2rem" }}>
            <ScrollReveal variant={imageReveal}>
              <div className="story-band__image glass-card">
                <img
                  src={bundleImage}
                  alt="AS Dance 639 mastery bundle poster"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08} variant={fadeInSoft}>
              <GlassCard className="story-band__content" accent="gold">
                <span className="chip chip--gold">Value stacking</span>
                <h3 style={{ marginBottom: "0.85rem", fontFamily: "var(--font-family-display)", fontSize: "2rem" }}>
                  One scroll should show free preview, INR 499 unlock, and premium custom upgrade.
                </h3>
                <ul className="detail-list">
                  <li>Start with a free style-check preview on WhatsApp.</li>
                  <li>Unlock the full 639-step mastery pyramid only when the teaching flow feels right.</li>
                  <li>Upgrade to tiered custom choreography for weddings, culturals, reels, and stage moments.</li>
                </ul>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <DeferredSection title="Learner reviews" minHeight="clamp(24rem, 50vw, 34rem)">
        <Suspense fallback={<SectionFallback id="reviews" title="Learner reviews" minHeight="clamp(24rem, 50vw, 34rem)" />}>
          <DeferredReviewLoop />
        </Suspense>
      </DeferredSection>

      <DeferredSection id="preview" title="Preview lessons" minHeight="clamp(20rem, 42vw, 28rem)">
        <Suspense fallback={<SectionFallback id="preview" title="Preview lessons" minHeight="clamp(20rem, 42vw, 28rem)" />}>
          <DeferredDemoSection />
        </Suspense>
      </DeferredSection>

      <DeferredSection title="Bundle breakdown" minHeight="clamp(26rem, 58vw, 38rem)">
        <Suspense fallback={<SectionFallback title="Bundle breakdown" minHeight="clamp(26rem, 58vw, 38rem)" />}>
          <DeferredRealtimeBundleSection />
        </Suspense>
      </DeferredSection>

      <section id="pricing" className="section-shell">
        <div className="container-max">
          <ScrollReveal variant={fadeInSoft}>
            <SectionHeader
              eyebrow="Offer architecture"
              title={
                <>
                  One preview path, one bundle path, and one <span className="display-accent">premium upsell</span>
                </>
              }
              description="This sales flow keeps buying intent clean: free preview for cold traffic, INR 499 bundle for warm traffic, and custom choreography for premium buyers."
            />
          </ScrollReveal>

          <m.div
            className="path-grid"
            variants={staggerContainer(staggerStep, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={gridViewport}
          >
            <m.div variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
              <GlassCard className="offer-card">
                <div className="offer-card__top">
                  <div>
                    <span className="icon-orb">
                      <PlayCircle size={18} aria-hidden="true" />
                    </span>
                    <h3 style={{ margin: 0 }}>Free style check</h3>
                  </div>
                  <span className="price-tag">No payment</span>
                </div>
                <p style={{ margin: 0 }}>
                  Best for first-time visitors who want to feel the teaching style before they commit to the bundle.
                </p>
                <ul className="tier-list">
                  <li>WhatsApp-first preview</li>
                  <li>Fit-before-buy clarity</li>
                  <li>Low-pressure entry into the sales flow</li>
                </ul>
                <Button href={FREE_CLASS_WA_LINK} target="_blank" rel="noopener noreferrer">
                  Book free preview
                </Button>
              </GlassCard>
            </m.div>

            <m.div variants={scaleIn} whileHover={prefersReducedMotion ? undefined : cardHover}>
              <GlassCard className="offer-card offer-card--featured" accent="gold">
                <div className="offer-card__top">
                  <div>
                    <span className="icon-orb">
                      <Crown size={18} aria-hidden="true" />
                    </span>
                    <h3 style={{ margin: 0 }}>639 Mastery Bundle</h3>
                  </div>
                  <span className="price-tag">INR 499</span>
                </div>
                <p style={{ margin: 0 }}>
                  213 Easy + 213 Medium + 213 Hard steps with lifetime access, Tamil + English cues, and one clear unlock path.
                </p>
                <ul className="tier-list">
                  <li>One-time payment</li>
                  <li>Lifetime access</li>
                  <li>Dashboard + structured progression unlock</li>
                </ul>
                <Button type="button" onClick={handleCourseCta}>
                  {user?.unlocked ? "Open Dashboard" : "Unlock 639 Bundle"}
                </Button>
              </GlassCard>
            </m.div>

            <m.div variants={fadeInUp} whileHover={prefersReducedMotion ? undefined : cardHover}>
              <GlassCard className="offer-card" accent="red">
                <div className="offer-card__top">
                  <div>
                    <span className="icon-orb">
                      <Zap size={18} aria-hidden="true" />
                    </span>
                    <h3 style={{ margin: 0 }}>Custom choreography tiers</h3>
                  </div>
                  <span className="price-tag">INR 300-500</span>
                </div>
                <p style={{ margin: 0 }}>
                  Per 30-second clip pricing for wedding intros, reels, culturals, and stage routines that need personal planning.
                </p>
                <ul className="tier-list">
                  <li>Easy INR 300 / Medium INR 400 / Hard INR 500</li>
                  <li>INR 200 personalization and INR 500 rehearsal add-ons</li>
                  <li>Best for event-ready output and premium handling</li>
                </ul>
                <Button type="button" variant="secondary" onClick={handleCustomService}>
                  View tiered service
                </Button>
              </GlassCard>
            </m.div>
          </m.div>

          <ScrollReveal delay={0.08} variant={scaleIn}>
            <GlassCard className="cta-banner" accent="gold" style={{ marginTop: "2rem" }}>
              <div>
                <div className="cta-banner__highlight">
                  <MessageCircle size={16} aria-hidden="true" />
                  Free WA / INR 499 Bundle / Custom Upsell
                </div>
                <h3 style={{ marginBottom: "0.8rem", fontFamily: "var(--font-family-display)", fontSize: "2rem" }}>
                  Start with clarity, then buy only the path you actually need.
                </h3>
                <p className="muted" style={{ margin: 0 }}>
                  Preview first for fit, unlock the mastery bundle for progression, or request a clip-wise quote for custom routines.
                </p>
              </div>

              <div className="button-row">
                <Button href={FREE_CLASS_WA_LINK} target="_blank" rel="noopener noreferrer">
                  Start free preview
                </Button>
                <Button type="button" variant="secondary" onClick={handleCourseCta}>
                  Unlock bundle
                </Button>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <section id="contacts" className="section-shell section-shell--tight">
        <div className="container-max">
          <m.div
            className="grid-2"
            variants={staggerContainer(staggerStep, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={gridViewport}
          >
            <m.div variants={fadeInUp}>
              <GlassCard className="support-card" accent="gold">
                <SectionHeader
                  eyebrow="Support and clarity"
                  title="Fast answers matter when pricing, levels, and deliverables are involved."
                  description="This brand sells clarity as much as choreography. Preview questions, bundle doubts, and custom quote requests should all feel easy to resolve."
                />

                <div className="support-stack">
                  <div className="support-item">
                    <span className="icon-orb">
                      <WhatsApp size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>WhatsApp preview + quote help</strong>
                      <p style={{ margin: "0.25rem 0 0" }}>Fastest route for free previews, bundle questions, clip-count pricing, and custom choreography discussions.</p>
                    </div>
                  </div>

                  <div className="support-item">
                    <span className="icon-orb">
                      <Mail size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>Email support</strong>
                      <p style={{ margin: "0.25rem 0 0" }}>Use email for collaborations, detailed support, or longer custom project requests.</p>
                    </div>
                  </div>
                </div>

                <div className="button-row">
                  <Button href={FREE_CLASS_WA_LINK} target="_blank" rel="noopener noreferrer">
                    Ask on WhatsApp
                  </Button>
                  <Button href="mailto:businessaswin@gmail.com" variant="secondary">
                    Email support
                  </Button>
                </div>
              </GlassCard>
            </m.div>

            <m.div variants={imageReveal}>
              <GlassCard className="support-card">
                <div className="media-panel" style={{ minHeight: "14rem" }}>
                  <img
                    src={supportImage}
                    alt="AS Dance support and coaching visual"
                    loading="lazy"
                    decoding="async"
                    width="1200"
                    height="900"
                  />
                  <div className="media-panel__copy">
                    <span className="chip chip--gold">Visible FAQ</span>
                  </div>
                </div>

                <h3 style={{ margin: 0, fontFamily: "var(--font-family-display)", fontSize: "1.9rem" }}>
                  Common questions
                </h3>
                <div className="faq-grid">
                  {FAQ_ITEMS.map((item) => (
                    <GlassCard key={item.question} className="faq-card">
                      <strong>{item.question}</strong>
                      <p style={{ margin: 0 }}>{item.answer}</p>
                    </GlassCard>
                  ))}
                </div>
              </GlassCard>
            </m.div>
          </m.div>
        </div>
      </section>

      <div className="floating-mobile-cta">
        <Button href={FREE_CLASS_WA_LINK} target="_blank" rel="noopener noreferrer" className="w-full">
          Start free preview on WhatsApp
        </Button>
      </div>
    </MainLayout>
  );
}

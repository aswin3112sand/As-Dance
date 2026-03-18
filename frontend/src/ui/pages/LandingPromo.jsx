import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Crown,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Button from "../components/Button.jsx";
import Reveal from "../components/Reveal.jsx";

const CHECKOUT_TARGET = "/checkout?pay=1";
const PROMO_SECTIONS = [
  { id: "offer", label: "Offer" },
  { id: "proof", label: "Proof" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

const FLASH_SIGNALS = [
  { icon: Users, title: "500+ students", copy: "A warm entry point matters. This page is built to convert cold traffic without pressure." },
  { icon: Trophy, title: "Performance ready", copy: "The system is designed for confidence on stage, camera, and reels." },
  { icon: ShieldCheck, title: "One-time access", copy: "No subscription confusion. Pay once and move into the structured course path." },
  { icon: Zap, title: "Instant route", copy: "Login, checkout, dashboard, and support all stay within one coherent journey." },
];

const FAQ_ITEMS = [
  {
    question: "Why use a dedicated offer page?",
    answer: "It gives ad traffic and referral traffic a faster route into trust, value, and a single action.",
  },
  {
    question: "Will I still get dashboard access?",
    answer: "Yes. The offer page still routes into the same auth, payment, and dashboard flow.",
  },
  {
    question: "Is the course beginner friendly?",
    answer: "Yes. The learning promise is structured for shy beginners first, not only confident dancers.",
  },
];

function formatCountdown(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function LandingPromo() {
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(PROMO_SECTIONS[0].id);
  const [remainingSeconds, setRemainingSeconds] = useState(6 * 3600);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => (current <= 0 ? 6 * 3600 : current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

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
    const sections = PROMO_SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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

  const navLinks = useMemo(
    () => PROMO_SECTIONS.map((item) => ({ key: item.id, label: item.label, href: `#${item.id}` })),
    []
  );

  const handlePrimaryCta = () => {
    if (loading) return;
    navigate(checkoutRoute);
  };

  return (
    <MainLayout
      navProps={{
        links: navLinks,
        activeKey: activeSection,
        isScrolled,
        ctaLabel: user?.unlocked ? "Open Dashboard" : "Unlock for INR 499",
        ctaTo: checkoutRoute,
      }}
    >
      <section id="offer" className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="page-hero">
            <Reveal>
              <GlassCard className="page-hero__content" accent="gold">
                <div className="button-row" style={{ marginBottom: "1rem" }}>
                  <span className="chip chip--gold">
                    <Sparkles size={14} aria-hidden="true" />
                    Flash unlock live
                  </span>
                  <span className="chip">{formatCountdown(remainingSeconds)}</span>
                </div>

                <h1 className="page-hero__title">Unlock the 639-step system before the countdown resets.</h1>
                <p>
                  This landing experience is designed for faster conversion: premium visuals, simple trust language,
                  and one obvious next action. It still preserves the same login, payment, and dashboard flows.
                </p>

                <div className="button-row">
                  <Button type="button" onClick={handlePrimaryCta}>
                    {user?.unlocked ? "Open Dashboard" : "Get instant access"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                  <Button to="/home" variant="secondary">
                    Explore full home experience
                  </Button>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.08}>
              <GlassCard className="page-hero__aside" accent="red">
                <span className="chip chip--gold">Offer summary</span>
                <div className="price-block" style={{ marginTop: "1rem" }}>
                  <span>Regular bundle positioning</span>
                  <strong>INR 499</strong>
                </div>
                <ul className="tier-list" style={{ marginTop: "1rem" }}>
                  <li>Structured 639-step recorded course</li>
                  <li>Dashboard unlock after payment verification</li>
                  <li>Tamil + English friendly teaching style</li>
                  <li>One-time payment, no recurring surprise</li>
                </ul>
                <div className="divider" style={{ marginBlock: "1rem" }} />
                <div className="button-row">
                  <Button type="button" onClick={handlePrimaryCta}>
                    Buy now
                  </Button>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="home-strip">
            {FLASH_SIGNALS.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <GlassCard className="signal-card">
                    <span className="icon-orb">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <strong>{item.title}</strong>
                    <p style={{ margin: 0 }}>{item.copy}</p>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="proof" className="section-shell">
        <div className="container-max">
          <SectionHeader
            eyebrow="Proof and positioning"
            title={
              <>
                Premium offer pages need <span className="display-accent">confidence, not noise</span>
              </>
            }
            description="The goal is to frame the product like a premium creator brand: warm, cinematic, and conversion-focused."
          />

          <div className="grid-3">
            <Reveal>
              <GlassCard className="proof-card">
                <span className="icon-orb">
                  <Users size={18} aria-hidden="true" />
                </span>
                <h3 style={{ margin: 0 }}>Warm traffic conversion</h3>
                <p style={{ margin: 0 }}>This page is tighter than the full home flow, so ad traffic gets value and direction faster.</p>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.05}>
              <GlassCard className="proof-card">
                <span className="icon-orb">
                  <Crown size={18} aria-hidden="true" />
                </span>
                <h3 style={{ margin: 0 }}>Premium creator energy</h3>
                <p style={{ margin: 0 }}>The visual language should feel like a branded dance academy, not a generic course template.</p>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.1}>
              <GlassCard className="proof-card">
                <span className="icon-orb">
                  <ShieldCheck size={18} aria-hidden="true" />
                </span>
                <h3 style={{ margin: 0 }}>Trust-first structure</h3>
                <p style={{ margin: 0 }}>Offer clarity, visual polish, and support visibility reduce hesitation before payment.</p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="pricing" className="section-shell section-shell--tight">
        <div className="container-max">
          <SectionHeader
            eyebrow="Pricing spotlight"
            title="Simple pricing wins when the page feels premium."
            description="One offer. One action. One fast route into the dashboard experience."
          />

          <div className="grid-2">
            <Reveal>
              <GlassCard className="offer-card offer-card--featured" accent="gold">
                <span className="chip chip--gold">Flash offer</span>
                <div className="price-block">
                  <strong>INR 499</strong>
                  <span>Limited-time framed offer for the 639-step recorded bundle.</span>
                </div>
                <ul className="tier-list">
                  <li>Clear beginner-friendly structure</li>
                  <li>Dashboard unlock flow preserved</li>
                  <li>Support route stays visible</li>
                </ul>
                <Button type="button" onClick={handlePrimaryCta}>
                  Continue to checkout
                </Button>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.08}>
              <GlassCard className="offer-card">
                <h3 style={{ margin: 0 }}>Need the full brand story first?</h3>
                <p style={{ margin: 0 }}>
                  The home page shows the broader academy, free class entry, social proof, preview lessons, and service split.
                </p>
                <div className="button-row">
                  <Button to="/home" variant="secondary">
                    Open full home
                  </Button>
                  <Button to="/preview" variant="ghost">
                    Watch preview
                  </Button>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell section-shell--tight">
        <div className="container-max">
          <SectionHeader
            eyebrow="FAQ"
            title="A premium offer page still answers the obvious questions."
            description="The job here is to remove friction, not add more persuasion copy than the user needs."
          />

          <div className="grid-3">
            {FAQ_ITEMS.map((item, index) => (
              <Reveal key={item.question} delay={index * 0.05}>
                <GlassCard className="faq-card">
                  <strong>{item.question}</strong>
                  <p style={{ margin: 0 }}>{item.answer}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

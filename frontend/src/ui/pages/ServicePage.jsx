import React, { useMemo } from "react";
import {
  ArrowRight,
  Clock,
  Flame,
  Lock,
  MessageCircle,
  Music,
  ShieldCheck,
  Target,
  WhatsApp,
  Zap,
} from "../icons.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Button from "../components/Button.jsx";
import Reveal from "../components/Reveal.jsx";
import heroStudioImage from "../../assets/bg/DanceTut.webp";
import supportStudioImage from "../../assets/bg/t14.webp";

const SUPPORT_NUMBER = "918825602356";

const SERVICE_TIERS = [
  {
    id: "starter",
    title: "Easy tier",
    icon: Target,
    duration: "Per 30-second clip",
    level: "Melody | Soft beats",
    delivery: "2-min wedding intro: 4 x INR 300 = INR 1,200",
    price: "INR 300",
    points: ["Waves, basics, and slow groove", "Best for low-pressure intros and shy starters", "WhatsApp quote format: Easy x clips"],
  },
  {
    id: "performance",
    title: "Medium tier",
    icon: Zap,
    duration: "Per 30-second clip",
    level: "Bollywood | Hip-hop sync",
    delivery: "2-min reel set: 4 x INR 400 = INR 1,600",
    price: "INR 400",
    points: ["Isolations, footwork, and expression", "Best for reels, culturals, and group sync", "Scales cleanly by clip count"],
  },
  {
    id: "signature",
    title: "Hard tier",
    icon: Flame,
    duration: "Per 30-second clip",
    level: "Aggressive | Rap power",
    delivery: "3-min stage set: 6 x INR 500 = INR 3,000",
    price: "INR 500",
    points: ["Jumps, fast sync, and stage explosion", "Best for power tracks and premium output", "Mixed example: 2 Medium + 4 Hard = INR 2,800"],
  },
];

const PROCESS_STEPS = [
  {
    id: "song",
    title: "Share the song + seconds",
    icon: Music,
    body: "Send the track and exact clip length clearly so the scope is locked before pricing starts.",
  },
  {
    id: "level",
    title: "Choose Easy / Medium / Hard",
    icon: Target,
    body: "Pick the tier based on song energy, move difficulty, and the kind of performance output you need.",
  },
  {
    id: "build",
    title: "Get the clip-wise quote",
    icon: Zap,
    body: "Quote logic is simple: tier x number of 30-second clips, plus optional add-ons when you need them.",
  },
  {
    id: "delivery",
    title: "Receive routine + support",
    icon: Clock,
    body: "Paid buyers get the final choreography flow, optional rehearsal support, and clear follow-through.",
  },
];

const FAQ_ITEMS = [
  "30-second clip pricing scales cleanly to full routine length.",
  "Add INR 200 for personalization and INR 500 for a rehearsal video.",
  "Course bundle and custom choreography are separate offers.",
  "Live batches are planned for Q3 2026 after the digital path.",
];

function buildWhatsAppLink(message) {
  return `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ServicePage() {
  const genericServiceLink = useMemo(
    () =>
      buildWhatsAppLink(
        "Hi AS DANCE, enakku custom choreography venum. Song, seconds, and Easy/Medium/Hard tier process explain pannunga."
      ),
    []
  );

  return (
    <MainLayout
      navProps={{
        links: [
          { key: "services", label: "Tiers", href: "#tiers" },
          { key: "workflow", label: "Workflow", href: "#workflow" },
          { key: "support", label: "Support", href: "#support" },
        ],
        ctaLabel: "Chat on WhatsApp",
        ctaHref: genericServiceLink,
      }}
    >
      <section className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="page-hero">
            <Reveal>
              <GlassCard className="page-hero__content" accent="gold">
                <span className="chip chip--gold">Advanced choreo tiers</span>
                <h1 className="page-hero__title">Choose Easy, Medium, or Hard per 30-second clip and scale it to your full routine.</h1>
                <p>
                  This service covers wedding intros, reels, culturals, and stage sets. The INR 499 mastery bundle stays
                  separate. Here pricing depends on tier, clip count, and add-ons so the service feels clean and predictable.
                </p>

                <div className="button-row">
                  <Button href={genericServiceLink} target="_blank" rel="noopener noreferrer">
                    Send song + seconds
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                  <Button to="/checkout?pay=1" variant="secondary">
                    View INR 499 bundle
                  </Button>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.08}>
              <GlassCard className="page-hero__aside">
                <div className="media-panel" style={{ minHeight: "100%" }}>
                  <img
                    src={heroStudioImage}
                    alt="AS Dance rehearsal and choreography visual"
                    width="1200"
                    height="800"
                    decoding="async"
                  />
                  <div className="media-panel__copy">
                    <span className="chip chip--gold">Clip-wise quote workflow</span>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="workflow" className="section-shell section-shell--tight">
        <div className="container-max">
          <SectionHeader
            eyebrow="How quotes work"
            title="Tiered pricing keeps custom choreography clear."
            description="No confusion, no bloated copy. Just enough clarity to choose the tier, count the clips, and start on WhatsApp."
          />

          <div className="process-grid">
            {PROCESS_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Reveal key={step.id} delay={index * 0.05}>
                  <GlassCard className="process-card">
                    <span className="icon-orb">
                      <StepIcon size={18} aria-hidden="true" />
                    </span>
                    <strong>{step.title}</strong>
                    <p style={{ margin: 0 }}>{step.body}</p>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tiers" className="section-shell">
        <div className="container-max">
          <SectionHeader
            eyebrow="Advanced choreo tiers"
            title={
              <>
                Per 30-second pricing that scales to <span className="display-accent">reels, intros, and full routines</span>
              </>
            }
            description="Use clip count to estimate the total. A 2-minute routine equals four 30-second clips."
          />

          <div className="tier-grid">
            {SERVICE_TIERS.map((tier, index) => {
              const TierIcon = tier.icon;
              const tierLink = buildWhatsAppLink(
                `Hi AS DANCE, ${tier.title} (${tier.price}) custom choreography start panna aasai. Song share pannuren.`
              );

              return (
                <Reveal key={tier.id} delay={index * 0.05}>
                  <GlassCard className="tier-card" accent={index === 1 ? "gold" : ""}>
                    <div className="tier-card__top">
                      <div>
                        <span className="icon-orb">
                          <TierIcon size={18} aria-hidden="true" />
                        </span>
                        <h3 style={{ margin: 0 }}>{tier.title}</h3>
                        <p style={{ margin: "0.35rem 0 0" }}>{tier.level}</p>
                      </div>
                      <span className="tier-card__price">{tier.price}</span>
                    </div>

                    <ul className="detail-list">
                      <li>{tier.duration}</li>
                      <li>{tier.delivery}</li>
                    </ul>

                    <ul className="tier-list">
                      {tier.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>

                    <Button href={tierLink} target="_blank" rel="noopener noreferrer">
                      Select package
                      <ArrowRight size={16} aria-hidden="true" />
                    </Button>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="support" className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="grid-2">
            <Reveal>
              <GlassCard className="support-card" accent="gold">
                <div className="button-row">
                  <span className="chip chip--gold">
                    <ShieldCheck size={14} aria-hidden="true" />
                    Transparent add-ons
                  </span>
                  <span className="chip">
                    <Lock size={14} aria-hidden="true" />
                    Clear support policy
                  </span>
                </div>

                <h3 style={{ marginBottom: "0.8rem", fontFamily: "var(--font-family-display)", fontSize: "2rem" }}>
                  Add-ons and support stay transparent.
                </h3>
                <ul className="policy-list">
                  <li>INR 200 adds personalization for song tweaks and preference alignment.</li>
                  <li>INR 500 adds a rehearsal video for practice support.</li>
                  <li>Paid bundle and custom buyers receive implementation support.</li>
                </ul>

                <div className="button-row">
                  <Button href={genericServiceLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} aria-hidden="true" />
                    Start quote
                  </Button>
                  <Button to="/" variant="secondary">
                    Back to home
                  </Button>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.08}>
              <GlassCard className="support-card">
                <div className="media-panel" style={{ minHeight: "14rem" }}>
                  <img
                    src={supportStudioImage}
                    alt="Dance instructor support visual"
                    loading="lazy"
                    width="1200"
                    height="800"
                    decoding="async"
                  />
                  <div className="media-panel__copy">
                    <span className="chip chip--gold">FAQ and CTA</span>
                  </div>
                </div>

                <h3 style={{ margin: 0, fontFamily: "var(--font-family-display)", fontSize: "1.85rem" }}>
                  Ready to calculate your custom quote?
                </h3>

                <ul className="tier-list">
                  {FAQ_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="button-row">
                  <Button href={genericServiceLink} target="_blank" rel="noopener noreferrer">
                    <WhatsApp size={16} aria-hidden="true" />
                    Start on WhatsApp
                  </Button>
                  <Button to="/checkout?pay=1" variant="ghost">
                    View mastery bundle
                  </Button>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

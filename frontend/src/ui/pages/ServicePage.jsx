import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Lock,
  MessageCircle,
  Music,
  ShieldCheck,
  Target,
  WhatsApp,
  Zap,
  Flame,
} from "../icons.jsx";
import Footer from "../components/Footer.jsx";
import heroStudioImage from "../../assets/bg/DanceTut.webp";
import supportStudioImage from "../../assets/bg/t14.webp";

const SUPPORT_NUMBER = "918825602356";

const SERVICE_TIERS = [
  {
    id: "basic",
    title: "Basic",
    icon: Target,
    duration: "30 seconds song",
    level: "Easy level",
    delivery: "Delivery: 24 hours",
    price: "INR 300",
    points: ["Simple steps", "Beginner friendly structure", "Clean count flow"],
  },
  {
    id: "advanced",
    title: "Advanced",
    icon: Zap,
    duration: "30 seconds song",
    level: "Medium to hard",
    delivery: "Delivery: 24-48 hours",
    price: "INR 400 - INR 500",
    points: ["Moderate / fast transitions", "Performance-ready energy", "Song-synced choreography"],
  },
  {
    id: "extended",
    title: "Extended",
    icon: Flame,
    duration: "2 minutes song",
    level: "Premium custom",
    delivery: "Delivery: timeline based",
    price: "Custom / Premium",
    points: ["Structured routine build", "Event-focused choreography", "Priority planning support"],
  },
];

const PROCESS_STEPS = [
  {
    id: "song",
    title: "Song Share",
    icon: Music,
    body: "Song and duration anupunga. 30s or 2min clear-ah mention pannunga.",
  },
  {
    id: "level",
    title: "Level Lock",
    icon: Target,
    body: "Basic / Advanced / Extended choose panni, exact requirement confirm pannuvom.",
  },
  {
    id: "build",
    title: "Choreo Build",
    icon: Zap,
    body: "Song rhythm-ku match pannitu practical choreography prepare pannuvom.",
  },
  {
    id: "delivery",
    title: "Delivery + Support",
    icon: Clock,
    body: "Delivery apram paid buyers-ku instruction doubts clear pannuvom.",
  },
];

const FAQ_ITEMS = [
  "Course and service rendu separate offers.",
  "Service pricing level and duration based transparent-ah irukum.",
  "Free instruction support course buyers and service buyers-ku mattum.",
  "Music used is for demonstration & practice purposes.",
];

function buildWhatsAppLink(message) {
  return `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ServicePage() {
  const genericServiceLink = useMemo(
    () =>
      buildWhatsAppLink(
        "Hi AS DANCE, enakku custom dance service details venum. Song anupina choreography process explain pannunga."
      ),
    []
  );

  return (
    <>
      <div className="service-page-shell">
        <header className="service-page-topbar">
          <Link to="/" className="service-brand">
            AS DANCE
          </Link>
          <div className="service-top-actions">
            <Link to="/" className="service-top-link">
              Home
            </Link>
            <a href={genericServiceLink} target="_blank" rel="noopener noreferrer" className="service-top-wa">
              <WhatsApp size={16} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </header>

        <main className="service-page-main">
          <section className="service-card service-hero">
            <div className="service-hero-content">
              <p className="service-kicker">Custom Dance Service</p>
              <h1>Song anupina, difficulty and duration-ku match pannitu choreography create pannuvom.</h1>
              <p>
                Idhu dedicated custom choreography service. INR 499 guided course separate offer.
                Need-ku match aana tier select pannitu direct WhatsApp-la start pannalaam.
              </p>

              <div className="service-hero-actions">
                <a href={genericServiceLink} target="_blank" rel="noopener noreferrer" className="service-btn service-btn-primary">
                  Send Song on WhatsApp
                </a>
                <Link to="/checkout?pay=1" className="service-btn">
                  Course Checkout
                </Link>
              </div>

              <p className="service-hero-note">Music used is for demonstration &amp; practice purposes.</p>
            </div>

            <div className="service-hero-media">
              <img
                src={heroStudioImage}
                alt="Dance choreography rehearsal visual"
                width="1200"
                height="800"
                decoding="async"
              />
              <div className="service-hero-overlay" aria-hidden="true" />
              <span className="service-hero-chip">
                <Music size={16} aria-hidden="true" />
                Spotlight choreography workflow
              </span>
            </div>
          </section>

          <section className="service-section">
            <div className="service-section-head">
              <h2>How It Works</h2>
              <p>Simple, compact process. No confusion, no unnecessary waiting.</p>
            </div>

            <div className="service-process-grid">
              {PROCESS_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <article key={step.id} className="service-card service-process-step">
                    <span className="service-step-number">{index + 1}</span>
                    <span className="service-step-icon">
                      <StepIcon size={17} aria-hidden="true" />
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="service-card service-support-split">
            <div className="service-support-content">
              <div className="service-policy-head">
                <ShieldCheck size={18} aria-hidden="true" />
                <Lock size={18} aria-hidden="true" />
                <h2>Free Instruction Support - How It Works</h2>
              </div>

              <p>
                Free instruction support clear policy oda irukum. Paid users-ku transparent support coverage kudukrom.
              </p>

              <ul className="service-policy-list">
                <li>Course buyers-ku free instruction support available.</li>
                <li>Service buyers-ku free instruction support available.</li>
                <li>Non-paid users-ku free instruction support available illa.</li>
              </ul>

              <a href={genericServiceLink} target="_blank" rel="noopener noreferrer" className="service-btn">
                <MessageCircle size={16} aria-hidden="true" />
                Chat Support
              </a>
            </div>

            <div className="service-support-media">
              <img
                src={supportStudioImage}
                alt="Dance instructor support visual"
                loading="lazy"
                width="1200"
                height="800"
                decoding="async"
              />
              <div className="service-support-overlay" aria-hidden="true" />
            </div>
          </section>

          <section className="service-section">
            <div className="service-section-head">
              <h2>Service Pricing Structure</h2>
              <p>Three clear tiers for quick decision making.</p>
            </div>

            <div className="service-tier-grid">
              {SERVICE_TIERS.map((tier) => {
                const TierIcon = tier.icon;
                const tierLink = buildWhatsAppLink(
                  `Hi AS DANCE, ${tier.title} tier (${tier.price}) custom choreography start panna aasai. Song share pannuren.`
                );

                return (
                  <article key={tier.id} className="service-card service-tier-card">
                    <div className="service-tier-head">
                      <span className="service-tier-icon">
                        <TierIcon size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <h3>{tier.title}</h3>
                        <p>{tier.level}</p>
                      </div>
                    </div>

                    <div className="service-tier-meta">
                      <span>
                        <Clock size={14} aria-hidden="true" />
                        {tier.duration}
                      </span>
                      <span>{tier.delivery}</span>
                    </div>

                    <div className="service-tier-price">{tier.price}</div>

                    <ul className="service-tier-list">
                      {tier.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>

                    <a href={tierLink} target="_blank" rel="noopener noreferrer" className="service-tier-cta">
                      Choose {tier.title}
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="service-faq-final-grid">
            <article className="service-card service-faq-card">
              <h2>FAQ</h2>
              <ul>
                {FAQ_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="service-card service-final-card">
              <p className="service-kicker">Final CTA</p>
              <h2>Ready to start custom choreography?</h2>
              <p>
                Song share pannunga. Requirement clear-ah kudunga. Fast-a best-fit tier suggest pannuvom.
              </p>

              <div className="service-final-actions">
                <a href={genericServiceLink} target="_blank" rel="noopener noreferrer" className="service-btn service-btn-primary">
                  Start on WhatsApp
                </a>
                <Link to="/checkout?pay=1" className="service-btn">
                  Buy INR 499 Course
                </Link>
              </div>

              <p className="service-contact-note">Replies within 24 hours</p>
            </article>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import easyImg from "../../assets/bg/t21.webp";
import mediumImg from "../../assets/bg/t22.webp";
import hardImg from "../../assets/bg/t23.webp";
import "./LevelCards.css";

const SUPPORT_NUMBER = "918825602356";

const SERVICE_LEVELS = [
  {
    key: "easy",
    label: "Easy",
    subtitle: "Customized choreography",
    image: easyImg,
    durations: [
      { label: "30 sec", price: "INR 300" },
      { label: "1 min", price: "INR 600" },
      { label: "2 min", price: "INR 1000" },
      { label: "3 min", price: "INR 1350" },
      { label: "4 min", price: "INR 1600" }
    ]
  },
  {
    key: "medium",
    label: "Medium",
    subtitle: "Choreography pricing",
    image: mediumImg,
    durations: [
      { label: "30 sec", price: "INR 400" },
      { label: "1 min", price: "INR 700" },
      { label: "2 min", price: "INR 1200" },
      { label: "3 min", price: "INR 1550" },
      { label: "4 min", price: "INR 1800" }
    ]
  },
  {
    key: "hard",
    label: "Hard",
    subtitle: "Choreography pricing",
    image: hardImg,
    durations: [
      { label: "30 sec", price: "INR 500" },
      { label: "1 min", price: "INR 800" },
      { label: "2 min", price: "INR 1400" },
      { label: "3 min", price: "INR 1750" },
      { label: "4 min", price: "INR 2000" }
    ]
  }
];

const SERVICE_LEVELS_WITH_LINKS = SERVICE_LEVELS.map((card) => {
  const message = `Hi AS DANCE, I want ${card.label} custom choreography pricing. Starting plan: ${card.durations[0].price}.`;
  return {
    ...card,
    quoteLink: `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`
  };
});

function LevelCards() {

  return (
    <section className="section section-compact bg-services section-anim level-cards-section" id="services">
      <div className="container-max">
        <div className="service-clarity card-glass level-cards-clarity">
          <div>
            <div className="service-clarity-title">Choose The Right Offer</div>
            <p className="service-clarity-copy">
              This section is for custom choreography pricing. Course Access is a separate fixed-price checkout.
            </p>
          </div>
          <Link to="/checkout?pay=1" className="service-course-cta">
            Buy Course Access - INR 499
          </Link>
        </div>

        <h2 className="section-head text-center">Custom Choreography Service</h2>

        <div className="services-row level-cards-grid">
          {SERVICE_LEVELS_WITH_LINKS.map((card, index) => (
            <article
              key={card.key}
              className={`service-card card-3d card-anim tone-${card.key} level-card`}
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="service-title-block">
                <p className="service-top-label">{card.label}</p>
                <p className="service-top-subtitle">{card.subtitle}</p>
                <p className="service-starting-price">Starts from {card.durations[0].price}</p>
                <div className="service-advance">
                  <Award size={16} />
                  <span>Advance Level</span>
                </div>
              </div>

              <div className="service-media">
                <img
                  src={card.image}
                  alt={`${card.label} choreo preview`}
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  sizes="(max-width: 720px) 92vw, (max-width: 1100px) 48vw, 33vw"
                  width="1280"
                  height="720"
                />
              </div>

              <div className="service-info-row level-card-info-row">
                <div className="service-info-column level-card-info-column">
                  {card.durations.slice(0, 3).map((tier) => (
                    <div key={`${card.key}-${tier.label}`} className="service-info-item level-card-info-item">
                      <span className="service-info-title">{tier.label}</span>
                      <span className="service-info-price">{tier.price}</span>
                    </div>
                  ))}
                </div>
                <div className="service-info-column level-card-info-column">
                  {card.durations.slice(3).map((tier) => (
                    <div key={`${card.key}-${tier.label}`} className="service-info-item level-card-info-item">
                      <span className="service-info-title">{tier.label}</span>
                      <span className="service-info-price">{tier.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-note compact">
                <p>Duration and pricing at a glance.</p>
                <p>Custom choreography delivery is within 24-48 hours after payment confirmation.</p>
              </div>

              <a
                href={card.quoteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="service-whatsapp compact level-card-whatsapp"
              >
                Book {card.label} Plan on WhatsApp
              </a>
            </article>
          ))}
        </div>

        <div className="services-trust level-cards-trust">Custom pricing only | WhatsApp support | Course checkout available separately</div>
      </div>
    </section>
  );
}

export default memo(LevelCards);

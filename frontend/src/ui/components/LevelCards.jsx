import React from "react";
import { Award } from "lucide-react";
import easyImg from "../../assets/bg/t21.webp";
import mediumImg from "../../assets/bg/t22.webp";
import hardImg from "../../assets/bg/t23.webp";

const SERVICE_LEVELS = [
  {
    key: "easy",
    label: "Easy",
    subtitle: "Choreo Preview",
    image: easyImg,
    durations: [
      { label: "30 sec", price: "₹300" },
      { label: "1 min", price: "₹600" },
      { label: "2 min", price: "₹1000" },
      { label: "3 min", price: "₹1350" },
      { label: "4 min", price: "₹1600" }
    ]
  },
  {
    key: "medium",
    label: "Medium",
    subtitle: "Choreo Pricing",
    image: mediumImg,
    durations: [
      { label: "30 sec", price: "₹400" },
      { label: "1 min", price: "₹700" },
      { label: "2 min", price: "₹1200" },
      { label: "3 min", price: "₹1550" },
      { label: "4 min", price: "₹1800" }
    ]
  },
  {
    key: "hard",
    label: "Hard",
    subtitle: "Choreo Pricing",
    image: hardImg,
    durations: [
      { label: "30 sec", price: "₹500" },
      { label: "1 min", price: "₹800" },
      { label: "2 min", price: "₹1400" },
      { label: "3 min", price: "₹1750" },
      { label: "4 min", price: "₹2000" }
    ]
  }
];

export default function LevelCards() {
  return (
    <section className="section section-compact bg-services section-anim" id="services">
      <div className="container-max">
        <h2 className="section-head text-center">Service Pricing</h2>
        <div className="services-row">
          {SERVICE_LEVELS.map((card, index) => (
            <article
              key={card.key}
              className={`service-card card-3d card-anim tone-${card.key}`}
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="service-title-block">
                <p className="service-top-label">{card.label}</p>
                <p className="service-top-subtitle">{card.subtitle}</p>
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
                  width="1280"
                  height="720"
                />
              </div>

              <div className="service-info-row">
                <div className="service-info-column">
                  {card.durations.slice(0, 3).map((tier) => (
                    <div key={`${card.key}-${tier.label}`} className="service-info-item">
                      <span className="service-info-title">{tier.label}</span>
                      <span className="service-info-price">{tier.price}</span>
                    </div>
                  ))}
                </div>
                <div className="service-info-column">
                  {card.durations.slice(3).map((tier) => (
                    <div key={`${card.key}-${tier.label}`} className="service-info-item">
                      <span className="service-info-title">{tier.label}</span>
                      <span className="service-info-price">{tier.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-note compact">
                <p>Duration | Price align for quick glance.</p>
                <p>Choreo preview windows lock in real-time delivery.</p>
              </div>

              <a href="https://wa.me/918825602356" className="service-whatsapp compact">
                💬 WhatsApp Enquiry • +918825602356
              </a>
            </article>
          ))}
        </div>
        <div className="services-trust">Duration • Price • Instant Support</div>
      </div>
    </section>
  );
}

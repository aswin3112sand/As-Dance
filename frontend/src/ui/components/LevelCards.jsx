import React, { memo } from "react";
import { Link } from "react-router-dom";
import premiumServiceImage from "../../assets/bg/poster.webp";
import "./LevelCards.css";

const SUPPORT_NUMBER = "918825602356";

const COURSE_WA_TEXT = "Hi AS DANCE, enakku INR 499 639-step course details venum.";
const COURSE_WA_LINK = `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(COURSE_WA_TEXT)}`;

const SERVICE_WA_TEXT = "Hi AS DANCE, custom choreography service details venum.";
const SERVICE_WA_LINK = `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(SERVICE_WA_TEXT)}`;

const COURSE_EXACT = [
  "639 structured dance steps",
  "Level-wise arranged practical flow",
  "Beat understanding training",
  "Basic to intermediate build-up",
  "Self-practice format (daily 20 mins enough)"
];

const COURSE_FOR = [
  "Dance experience illa beginners",
  "Instagram reels paathu kathukanum nu aasai irukra users",
  "College / friends function ku ready aaganum nu irukra learners",
  "Daily 20 mins practice panna mudiyum students"
];

const COURSE_NOT_FOR = [
  "1 day la stage pro aaganum nu expect panravanga",
  "Only live class venum nu strict ah irukra users",
  "Practice panna time allocate panna mudiyatha users"
];

const COURSE_RESULTS = [
  "Camera confidence increase",
  "Beat miss kammi",
  "Body stiffness reduce",
  "Step continuity improve",
  "Smooth flow build aagum"
];

const COURSE_FLOW = [
  "One-time INR 499 payment",
  "Instant dashboard access",
  "639 practical song-based breakdown steps",
  "Self-practice friendly structure"
];

const SERVICE_INCLUDES = [
  "Song analysis",
  "Step-by-step breakdown video",
  "Section-wise practice guidance",
  "Final full dance choreography video",
  "Online guidance till complete ready"
];

const SERVICE_FOR = [
  "College culturals",
  "Wedding sangeet",
  "Stage performance",
  "Special event dance",
  "Couple dance",
  "Group performance"
];

const SERVICE_FLOW = [
  "Customer song share pannuvanga",
  "Difficulty level discuss pannuvom",
  "Step by step choreography create pannuvom",
  "Practice guidance kudupom",
  "Final full dance performance ready pannuvom"
];

const HOW_IT_WORKS = [
  "Step 1: Checkout la INR 499 payment complete pannunga.",
  "Step 2: Payment success apram dashboard open aagum.",
  "Step 3: Google Drive 639-step course access panni practice start pannunga."
];

const COURSE_CTA_TEXT = "Pay INR 499 - Access 639 Steps";
const SERVICE_CTA_TEXT = "Ask Premium Custom Service";

const SERVICE_FACTS = [
  "Idhu course illa. Idhu custom premium service.",
  "Idhu INR 499 course price la include agala.",
  "Course: recorded 639-step practice library.",
  "Service: ungaloda own song-ku personal choreography."
];

const PREMIUM_MEDIA_POINTS = [
  "Song analysis",
  "Step-by-step breakdown",
  "Practice guidance"
];

function LevelCards() {
  return (
    <section className="section section-compact bg-services section-anim sales-section" id="services">
      <div className="container-max sales-shell">
        <div className="sales-hero-clarity card-glass">
          <p className="sales-chip">INR 499 - 639 Step Course (Main Product)</p>
          <h2 className="section-head text-center sales-headline">
            Live class illa. Direct-ah 639-step recorded practical dance course access, one-time INR 499.
          </h2>
          <p className="sales-copy text-center">
            Beginners kuda step by step follow panna mudiyum structured practical library.
            <br />
            <strong>
              🎥 100% Recorded Practical Course
              <br />
              ⏳ Learn Anytime. Practice at Your Pace.
            </strong>
          </p>

          <article className="sales-card card-3d sales-inline-card">
            <h3>Course quick flow</h3>
            <ul className="sales-list">
              {COURSE_FLOW.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <div className="sales-cta-row">
            <Link to="/checkout?pay=1" className="btn btn-cta btn-cta-primary sales-primary-cta">
              {COURSE_CTA_TEXT}
            </Link>
            <a href={COURSE_WA_LINK} target="_blank" rel="noopener noreferrer" className="sales-link-cta">
              Course details on WhatsApp
            </a>
          </div>
        </div>

        <div className="sales-grid-two">
          <article className="sales-card card-3d">
            <h3>Idhu enna course?</h3>
            <ul className="sales-list">
              {COURSE_EXACT.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="sales-card card-3d">
            <h3>Yaarukku idhu set aagum?</h3>
            <ul className="sales-list">
              {COURSE_FOR.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="sales-grid-two">
          <article className="sales-card card-3d">
            <h3>Yaarukku set aagadhu?</h3>
            <ul className="sales-list">
              {COURSE_NOT_FOR.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="sales-card card-3d">
            <h3>2-3 weeks result expectation</h3>
            <ul className="sales-list">
              {COURSE_RESULTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="sales-card card-3d">
          <h3>How course access works</h3>
          <ol className="sales-steps">
            {HOW_IT_WORKS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="sales-card card-3d premium-service-card">
          <p className="sales-chip premium-chip">Custom Song Dance Service (Premium Service)</p>
          <h3>Idhu course illa. Idhu premium custom service.</h3>
          <ul className="sales-list">
            {SERVICE_FACTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <div className="premium-service-layout">
            <div className="premium-service-main">
              <div className="sales-grid-two premium-service-grid">
                <div>
                  <h4>Service includes</h4>
                  <ul className="sales-list">
                    {SERVICE_INCLUDES.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Yaarukku indha service?</h4>
                  <ul className="sales-list">
                    {SERVICE_FOR.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <h4>Service flow</h4>
              <ol className="sales-steps">
                {SERVICE_FLOW.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

              <div className="sales-inline-cta">
                <a href={SERVICE_WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-cta btn-cta-primary sales-primary-cta">
                  {SERVICE_CTA_TEXT}
                </a>
              </div>
            </div>

            <aside className="premium-service-media">
              <img
                src={premiumServiceImage}
                alt="Custom choreography premium service visual for event performance"
                loading="lazy"
                decoding="async"
                className="premium-service-image"
              />
              <div className="premium-service-overlay">
                <h4>Custom choreography for your song</h4>
                <p>Event-ready guidance till final performance</p>
                <ul className="premium-service-points">
                  {PREMIUM_MEDIA_POINTS.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </article>

        <div className="sales-secondary-note">
          Course (INR 499) and custom service (premium quote) are clearly separate offers.
        </div>
      </div>
    </section>
  );
}

export default memo(LevelCards);

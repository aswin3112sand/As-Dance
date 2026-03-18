import React from "react";
import DemoSection from "../components/DemoSection.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function Preview() {
  return (
    <MainLayout
      navProps={{
        links: [
          { key: "home", label: "Home", to: "/" },
          { key: "services", label: "Services", to: "/services" },
        ],
        ctaLabel: "Back to Home",
        ctaTo: "/",
      }}
    >
      <section className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="preview-layout">
            <GlassCard className="form-card" accent="gold">
              <SectionHeader
                eyebrow="Preview route"
                title="Watch how the teaching style feels before you pay."
                description="This route exists to reduce hesitation. It should feel premium, fast, and focused on confidence building."
              />
              <div className="button-row">
                <Button to="/checkout?pay=1">Go to checkout</Button>
                <Button to="/services" variant="secondary">
                  Custom choreography
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="summary-card">
              <h3 style={{ marginTop: 0, fontFamily: "var(--font-family-display)", fontSize: "1.9rem" }}>What to look for</h3>
              <ul className="tier-list">
                <li>Beginner-friendly pacing</li>
                <li>Clear count breakdown and explanation</li>
                <li>Premium visual and teaching confidence</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      <DemoSection />
    </MainLayout>
  );
}

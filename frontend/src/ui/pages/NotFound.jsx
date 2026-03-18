import React from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <MainLayout
      navProps={{
        links: [
          { key: "home", label: "Home", to: "/" },
          { key: "preview", label: "Preview", to: "/preview" },
        ],
        ctaLabel: "Go Home",
        ctaTo: "/",
      }}
    >
      <section className="section-shell">
        <div className="container-max">
          <div className="result-shell">
            <GlassCard className="result-card" accent="red">
              <h1>Page not found</h1>
              <p className="muted">
                This route is handled by React Router. The page shell is still intact, but this specific URL does not exist.
              </p>
              <div className="button-row" style={{ marginTop: "1.5rem" }}>
                <Button to="/">Go Home</Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

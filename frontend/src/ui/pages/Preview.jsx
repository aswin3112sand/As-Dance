import React, { Suspense } from "react";
import { Link } from "react-router-dom";

const DemoSection = React.lazy(() => import("../components/DemoSection.jsx"));

export default function Preview() {
  return (
    <>
      <nav className="navbar-glass">
        <div className="container-max">
          <div className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
            AS DANCE
          </div>
          <Link to="/" className="btn nav-cta nav-cta-secondary">
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="page-content">
        <Suspense fallback={(
          <section id="preview" className="section section-compact section-anim" aria-busy="true">
            <div className="container-max text-center text-white-50 small" style={{ opacity: 0.8 }}>
              Loading preview...
            </div>
          </section>
        )}>
          <DemoSection />
        </Suspense>
      </div>
    </>
  );
}

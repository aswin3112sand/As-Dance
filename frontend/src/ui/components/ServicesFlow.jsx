
import React from "react";
import { MessageCircle, Music, Activity, Layers } from "../icons.jsx";

const SERVICES = [
  {
    title: "Custom Choreography",
    desc: "Personalized routines tailored to your song choice and skill level.",
    icon: <Music size={24} />,
    badge: "Premium"
  },
  {
    title: "Daily Rhythm Drills",
    desc: "30-second rapid-fire exercises to sharpen your timing and musicality.",
    icon: <Activity size={24} />,
    badge: "Daily"
  },
  {
    title: "639 Steps Track",
    desc: "Complete studio-grade breakdown of all 639 moves w/ progressive difficulty.",
    icon: <Layers size={24} />,
    badge: "Core"
  },
  {
    title: "Instant Support",
    desc: "Direct access to technical and dance-related queries via WhatsApp.",
    icon: <MessageCircle size={24} />,
    badge: "24/7"
  }
];

export default function ServicesFlow() {
  return (
    <div className="py-2">
      <h2 className="text-center section-head mx-auto anim-init" data-anim="fadeup">Premium Dance Services</h2>

      <div className="grid-4">
        {SERVICES.map((s, i) => (
          <div key={i} className="card-3d p-4 d-flex flex-column h-100 position-relative overflow-hidden anim-init" data-anim="fadeup" style={{ transitionDelay: i * 0.1 + 's' }}>
            {/* Neon Border Glow */}
            <div className="neon-border-glow"></div>

            <div className="d-flex justify-content-between align-items-start mb-3 position-relative z-1">
              <div style={{ color: "var(--primary)" }}>{s.icon}</div>
              <span className="badge-pill badge-med">{s.badge}</span>
            </div>
            <h3 className="h5 fw-bold mb-3 position-relative z-1">{s.title}</h3>
            <p className="subtle small mb-4 flex-grow-1 position-relative z-1">{s.desc}</p>
            <button className="btn btn-ghost w-100 btn-sm position-relative z-1" disabled>View Service After Login</button>
          </div>
        ))}
      </div>

      <div className="text-center mt-5 anim-init" data-anim="fadeup">
        <button className="btn btn-neon px-5 py-3">Explore Services (Login Required)</button>
      </div>
    </div>
  );
}

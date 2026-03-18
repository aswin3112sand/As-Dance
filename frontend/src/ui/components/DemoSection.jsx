import React, { useEffect, useState } from "react";
import DemoCards from "./DemoCards.jsx";
import Reveal from "./Reveal.jsx";
import { apiFetch } from "../api.js";
import SectionHeader from "./SectionHeader.jsx";

export default function DemoSection() {
  const [demos, setDemos] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await apiFetch("/api/content/demos");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setDemos(data);
      } catch {
        // Fallback links already handled in DemoCards.
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="preview" className="section-shell section-shell--tight">
      <div className="container-max">
        <Reveal>
          <SectionHeader
            eyebrow="Preview lessons"
            title={
              <>
                See How <span className="display-accent">I Teach</span>
              </>
            }
            description="Watch sample lessons before purchase. The pacing, count clarity, and beginner-friendly breakdown are visible up front."
          />
        </Reveal>

        <div style={{ marginTop: "2rem" }}>
          <DemoCards demos={demos} />
        </div>
      </div>
    </section>
  );
}

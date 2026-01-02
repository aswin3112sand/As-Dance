import React, { useEffect, useState } from "react";
import DemoCards from "./DemoCards.jsx";
import { apiFetch } from "../api.js";

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
        // keep graceful fallback
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section section-compact bg-demos section-anim" id="preview">
      <div className="container-max">
        <h2 className="section-head text-center">Demo / Preview</h2>
        <DemoCards demos={demos} />
        <div className="preview-note">
          Click Preview → Google Drive video must open
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { PlayCircle } from "../icons.jsx";
import DemoCards from "./DemoCards.jsx";
import Reveal from "./Reveal.jsx";
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
        // fallback links already handled in DemoCards
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="preview" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">Preview</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">See How I Teach</h2>
          <p className="mt-4 inline-flex items-center gap-2 text-gray-300 text-base leading-relaxed">
            <PlayCircle size={16} aria-hidden="true" className="text-[#3B82F6]" />
            Watch sample lessons before purchase.
          </p>
        </Reveal>

        <div className="mt-10">
          <DemoCards demos={demos} />
        </div>
      </div>
    </section>
  );
}

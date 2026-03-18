import React, { memo } from "react";
import { Activity, Flame, Target } from "../icons.jsx";
import IconInfoCard from "./IconInfoCard.jsx";
import Reveal from "./Reveal.jsx";

const SYSTEM_CARDS = [
  {
    icon: Target,
    title: "196 Easy Steps",
    description: "Rhythm, posture, and clean first moves.",
  },
  {
    icon: Activity,
    title: "219 Medium Steps",
    description: "Flow, timing, and transition drills for stronger control.",
  },
  {
    icon: Flame,
    title: "226 Hard Steps",
    description: "Advanced choreography for stage impact and pressure control.",
  },
];

export default memo(function BrandSystemSection() {
  return (
    <section id="services" className="py-20 md:py-24" aria-labelledby="system-title">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">The Framework</p>
          <h2 id="system-title" className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">
            The 639-Step Structured Dance System
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-300">
            Beginner to performer progression with cleaner sequencing.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {SYSTEM_CARDS.map((card, idx) => (
            <IconInfoCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              delay={idx * 0.06}
            />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8 rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300">
            <span>Beginner</span>
            <div className="h-2 flex-1 min-w-[150px] rounded-full bg-slate-700/70">
              <span className="block h-full w-full rounded-full bg-[#3B82F6]" />
            </div>
            <span>Performer</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
});

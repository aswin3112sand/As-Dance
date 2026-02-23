import React, { memo } from "react";
import { Activity, Layers, ShieldCheck, Sparkles } from "../icons.jsx";
import IconInfoCard from "./IconInfoCard.jsx";
import Reveal from "./Reveal.jsx";

const PROBLEM_CARDS = [
  {
    icon: Activity,
    title: "Random Reel Copy",
    description: "Many beginners copy steps without structure, so retention and confidence stay low.",
  },
  {
    icon: Layers,
    title: "No Progress System",
    description: "Without a clear order, practice becomes inconsistent and choreography memory breaks.",
  },
  {
    icon: ShieldCheck,
    title: "Confidence Gap",
    description: "Stage fear stays longer when training does not move from basics to performance mode.",
  },
  {
    icon: Sparkles,
    title: "Structured Solution",
    description: "The 639-step progression fixes this with practical sequencing and repeatable routines.",
  },
];

export default memo(function BrandProblemSection() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="problem-title">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">Why Learners Struggle</p>
          <h2 id="problem-title" className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">
            Most beginners fail because the path is broken, not because talent is missing.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-300">
            Clarity first. Then practice. Then confidence.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          {PROBLEM_CARDS.map((card, idx) => (
            <IconInfoCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              delay={idx * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

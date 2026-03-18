import React, { memo } from "react";
import Reveal from "./Reveal.jsx";
import storyImage from "../../assets/bg/Asd.webp";

const STORY_POINTS = [
  {
    label: "Structure",
    copy: "639 steps arranged as one clean path instead of random clips.",
  },
  {
    label: "Repeat",
    copy: "Practice stays simple because every level builds on the last one.",
  },
  {
    label: "Access",
    copy: "INR 499 pricing keeps the start point light and reachable.",
  },
];

export default memo(function BrandStorySection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="home-story-grid">
          <Reveal className="home-story-panel rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">Personal Story</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
              Why This 639-Step System Exists
            </h2>
            <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
              Beginner confusion was the biggest problem. So the system was designed to keep progress clear,
              repeatable, and confidence-focused.
            </p>

            <ul className="home-story-bullets">
              {STORY_POINTS.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.copy}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="home-story-media">
            <img
              src={storyImage}
              alt="AS Dance story visual"
              loading="lazy"
              decoding="async"
              width="1200"
              height="1600"
            />
            <div className="home-story-stat">
              <span>story frame</span>
              639 steps. One clean path.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
});

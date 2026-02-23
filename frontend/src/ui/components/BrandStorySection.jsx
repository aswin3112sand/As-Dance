import React, { memo } from "react";
import Reveal from "./Reveal.jsx";

export default memo(function BrandStorySection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">Personal Story</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
            Why This 639-Step System Exists
          </h2>
          <p className="mt-4 text-gray-300 leading-relaxed">
            Beginner confusion was the biggest problem I saw. Random practice gives random results.
            So I built a level-wise structure that keeps learning practical, repeatable, and confidence-focused.
          </p>
          <p className="mt-3 text-gray-300 leading-relaxed">
            INR 499 pricing is intentionally kept accessible so more learners can start with a clear path.
          </p>
        </Reveal>
      </div>
    </section>
  );
});

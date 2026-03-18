import React, { memo } from "react";
import { MessageCircle, Star } from "../icons.jsx";
import Reveal from "./Reveal.jsx";

export default memo(function BrandProofStrip() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Reveal className="rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">Social Proof</p>
            <h3 className="mt-4 flex items-center gap-3 text-2xl font-bold text-white">
              <Star size={18} className="text-[#3B82F6]" />
              Real Learners. Real Progress.
            </h3>
            <p className="mt-3 text-gray-300 leading-relaxed">
              4.8/5 rating. 1,000+ learners on the structured path.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8">
            <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
              <MessageCircle size={18} className="text-[#3B82F6]" />
              Trust Before Purchase
            </h3>
            <p className="mt-3 text-gray-300 leading-relaxed">
              Transparent feedback. No inflated claims.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
});

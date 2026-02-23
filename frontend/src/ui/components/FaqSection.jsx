import React, { memo } from "react";
import { MessageCircle } from "../icons.jsx";
import Reveal from "./Reveal.jsx";

const FAQS = [
  {
    q: "Is this for complete beginners?",
    a: "Yes. The structure starts from basics and progresses level by level.",
  },
  {
    q: "How much should I practice daily?",
    a: "20 minutes daily is enough if done consistently with the structured flow.",
  },
  {
    q: "Will I get lifetime access?",
    a: "Yes. One-time INR 499 payment with lifetime access to the 639-step system.",
  },
  {
    q: "Who gets support?",
    a: "Instruction support is available for paid course buyers and paid service buyers.",
  },
];

function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">FAQ</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
            Common doubts, quick answers
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {FAQS.map((item, idx) => (
            <Reveal
              key={item.q}
              delay={idx * 0.04}
              className="rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8"
            >
              <h3 className="flex items-start gap-3 text-xl font-semibold text-white">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
                  <MessageCircle size={15} />
                </span>
                <span>{item.q}</span>
              </h3>
              <p className="mt-3 text-gray-300 leading-relaxed">{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(FaqSection);

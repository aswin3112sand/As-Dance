import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Music } from "../icons.jsx";
import Reveal from "./Reveal.jsx";
import upsellImage from "../../assets/bg/t14.webp";

const USE_CASES = ["College culturals", "Wedding sangeet", "Stage performances"];

export default memo(function BrandUpsellSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="home-upsell-grid">
          <Reveal className="home-upsell-panel rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8">
            <span className="inline-flex min-h-[32px] items-center rounded-full border border-orange-400/50 bg-orange-400/10 px-3 text-xs font-semibold tracking-wide text-[#F59E0B]">
              Custom Service
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
              Need Custom Choreography?
            </h2>
            <p className="mt-4 max-w-2xl text-gray-300 leading-relaxed">
              Separate premium service for events, songs, and stage-specific performances.
            </p>
            <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {USE_CASES.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-blue-500/20 bg-[#0B1220] p-4 text-gray-200 flex items-center gap-3"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
                    <Music size={15} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/services"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#3B82F6] px-5 py-3 text-white font-semibold transition hover:scale-[1.02]"
            >
              Request Premium Quote
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="home-upsell-media">
            <img
              src={upsellImage}
              alt="Custom choreography visual"
              loading="lazy"
              decoding="async"
              width="1200"
              height="1600"
            />
            <div className="home-upsell-badge">
              <span>event mode</span>
              Song-specific choreography
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
});

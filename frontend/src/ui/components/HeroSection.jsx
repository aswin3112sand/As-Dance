import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Music, ShieldCheck, Zap } from "../icons.jsx";
import dhanushImage from "../../assets/bg/dhanush.webp";
import Reveal from "./Reveal.jsx";

/* Inline styles for hero motion — avoids creating a new CSS module */
const HERO_IMAGE_STYLE = {
  animation: "hero-float 5.5s ease-in-out infinite",
};

const HERO_FLOAT_KEYFRAMES = `
@keyframes hero-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
@keyframes badge-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-image-float { animation: none !important; }
  .hero-badge-chip  { animation: none !important; opacity: 1 !important; }
}
`;


function HeroSection() {
  const nav = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      nav(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    nav(target);
  };

  return (
    <section id="about" className="overflow-x-clip pt-6 pb-20 md:pt-8 md:pb-24">
      {/* Inject keyframes once */}
      <style>{HERO_FLOAT_KEYFRAMES}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#3B82F6]">Structured Digital Dance Training</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">
              Learn Dance With Structure. Not Random Reels.
            </h1>
            <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed">
              Hi, I&apos;m As. I help beginners build real stage confidence step-by-step.
            </p>
            <p className="mt-4 text-base md:text-lg font-semibold leading-relaxed text-white">
              1,000+ learners | Structured 639-step system | Beginner-friendly
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="min-h-[44px] rounded-xl bg-[#3B82F6] px-6 font-semibold text-white shadow-md transition hover:scale-[1.02]"
                onClick={handleCheckout}
              >
                Start With 639 Steps
              </button>
              <a
                className="min-h-[44px] rounded-xl border border-blue-500/40 bg-[#0B1220] px-6 font-semibold text-white transition hover:scale-[1.02] inline-flex items-center justify-center"
                href="#preview"
              >
                Watch How I Teach
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span
                className="hero-badge-chip inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-500/30 bg-[#0B1220] px-3 text-sm text-gray-300"
                style={{ animation: "badge-fade-in 0.55s cubic-bezier(0.22,1,0.36,1) 0.55s both" }}
              >
                <ShieldCheck size={14} aria-hidden="true" />
                Instant access after payment
              </span>
              <span
                className="hero-badge-chip inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-500/30 bg-[#0B1220] px-3 text-sm text-gray-300"
                style={{ animation: "badge-fade-in 0.55s cubic-bezier(0.22,1,0.36,1) 0.72s both" }}
              >
                <Zap size={14} aria-hidden="true" />
                Structured beginner path
              </span>
              <span
                className="hero-badge-chip inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-500/30 bg-[#0B1220] px-3 text-sm text-gray-300"
                style={{ animation: "badge-fade-in 0.55s cubic-bezier(0.22,1,0.36,1) 0.9s both" }}
              >
                <Music size={14} aria-hidden="true" />
                Song-based lessons, stable pacing
              </span>
            </div>

            <p className="mt-6 text-gray-300 text-base leading-relaxed">
              Practice 20 mins daily pothum. Lifetime access with one-time payment.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0B1220] shadow-lg hero-image-float"
              style={HERO_IMAGE_STYLE}
            >
              <img
                src={dhanushImage}
                alt="AS dance performance visual"
                loading="lazy"
                decoding="async"
                width="1200"
                height="900"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1220]/75 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-500/40 bg-[#0B1220]/90 px-3 text-sm text-white">
                  <Music size={14} aria-hidden="true" />
                  Music-led practical training
                </span>
                <Link
                  to="/services"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-blue-500/40 bg-[#0B1220]/90 px-3 text-sm font-medium text-white transition hover:scale-[1.02]"
                >
                  Premium custom choreography
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);

import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Clock, Infinity, PlayCircle, ShieldCheck } from "../icons.jsx";
import Reveal from "./Reveal.jsx";
import offerPoster from "../../assets/bg/poster.webp";

const VALUE_STACK = [
  { label: "639 Structured Step Library", value: "INR 800", icon: PlayCircle },
  { label: "Beat Understanding Training", value: "INR 300", icon: Clock },
  { label: "Section-wise Practice System", value: "INR 200", icon: ShieldCheck },
  { label: "Lifetime Access", value: "INR 200", icon: Infinity },
];

export default memo(function BrandValueOfferSection() {
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
    <section className="py-20 md:py-24" aria-labelledby="offer-title">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-[#3B82F6]">Offer</p>
          <h2
            id="offer-title"
            className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Structured Value Stack + One-Time Offer
          </h2>
          <p className="mt-4 text-gray-300 text-base md:text-lg leading-relaxed">
            Clear pricing. Clear structure. No subscription confusion.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal className="rounded-2xl border border-blue-500/30 bg-[#0F172A] p-6 md:p-8">
            <ul className="space-y-4">
              {VALUE_STACK.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="inline-flex items-start gap-3 text-gray-200">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="text-base leading-relaxed">{item.label}</span>
                    </span>
                    <span className="text-sm font-semibold text-gray-200 whitespace-nowrap">{item.value}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 rounded-2xl border border-orange-400/40 bg-slate-900 p-5">
              <p className="text-gray-300 text-sm">Actual Value</p>
              <p className="text-gray-400 text-lg line-through">INR 1500</p>
              <p className="mt-2 text-gray-200 text-sm">Now Available For</p>
              <p className="text-4xl font-bold text-[#F59E0B] leading-none">INR 499</p>
              <p className="mt-2 text-gray-300 text-sm">One-time payment. Lifetime access.</p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 min-h-[44px] w-full rounded-xl bg-[#3B82F6] px-5 py-3 text-white font-semibold shadow-md transition hover:scale-[1.02]"
            >
              Unlock 639 Steps Now
            </button>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0F172A] shadow-lg">
              <img
                src={offerPoster}
                alt="AS Dance offer visual"
                loading="lazy"
                decoding="async"
                width="1200"
                height="1600"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
});

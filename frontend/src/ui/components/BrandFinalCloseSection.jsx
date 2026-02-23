import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import Reveal from "./Reveal.jsx";

export default memo(function BrandFinalCloseSection() {
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
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="rounded-2xl border border-blue-500/30 bg-[#0F172A] p-6 md:p-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Build Real Dance Confidence?
          </h2>
          <p className="mt-4 text-gray-300">One-time INR 499 | Lifetime access</p>
          <button
            type="button"
            className="mt-6 min-h-[44px] rounded-xl bg-[#3B82F6] px-6 py-3 text-white font-semibold transition hover:scale-[1.02]"
            onClick={handleCheckout}
          >
            Unlock 639 Steps Now
          </button>
        </Reveal>
      </div>
    </section>
  );
});

import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import Reveal from "./Reveal.jsx";

export default memo(function BrandFinalCloseSection() {
  const nav = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (user?.unlocked) {
      nav("/dashboard");
      return;
    }
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
            Ready to move from free start into real progress?
          </h2>
          <p className="mt-4 text-gray-300">
            Start with the free class if you are still deciding. Join the full INR 499 course when you want the full
            639-step path.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#free-class"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-blue-500/30 bg-[#0B1220] px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              Start Free Class
            </a>
            <button
              type="button"
              className="min-h-[44px] rounded-xl bg-[#3B82F6] px-6 py-3 text-white font-semibold transition hover:scale-[1.02]"
              onClick={handleCheckout}
            >
              {user?.unlocked ? "Open Dashboard" : "Unlock 639 Steps Now"}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
});

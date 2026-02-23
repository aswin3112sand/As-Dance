import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Flame, Layers, Trophy, X } from "../icons.jsx";

const STORAGE_KEYS = {
  snoozeUntil: "asdance_offer_popup_snooze_until_v1",
  optOut: "asdance_offer_popup_opt_out_v1",
};

const DEFAULT_INTERVAL_MS = 2 * 60 * 1000;

function OfferPopup({
  isActive = true,
  hasPurchased = false,
  intervalMs = DEFAULT_INTERVAL_MS,
  onPrimaryCta,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(
    (delayMs) => {
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setIsOpen(true);
      }, Math.max(0, delayMs));
    },
    [clearTimer]
  );

  const snoozeAndClose = useCallback(() => {
    const until = Date.now() + intervalMs;
    localStorage.setItem(STORAGE_KEYS.snoozeUntil, String(until));
    setIsOpen(false);
    scheduleOpen(intervalMs);
  }, [intervalMs, scheduleOpen]);

  const stopFutureTriggers = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.optOut, "1");
    localStorage.removeItem(STORAGE_KEYS.snoozeUntil);
    setIsOpen(false);
    clearTimer();
  }, [clearTimer]);

  const onPrimaryClick = useCallback(() => {
    stopFutureTriggers();
    onPrimaryCta?.();
  }, [onPrimaryCta, stopFutureTriggers]);

  useEffect(() => {
    if (!isActive || hasPurchased) {
      setIsOpen(false);
      clearTimer();
      return undefined;
    }

    const optedOut = localStorage.getItem(STORAGE_KEYS.optOut) === "1";
    if (optedOut) {
      setIsOpen(false);
      clearTimer();
      return undefined;
    }

    const now = Date.now();
    const snoozeUntil = Number(localStorage.getItem(STORAGE_KEYS.snoozeUntil) || "0");
    if (!Number.isFinite(snoozeUntil) || snoozeUntil <= now) {
      setIsOpen(true);
      clearTimer();
    } else {
      setIsOpen(false);
      scheduleOpen(snoozeUntil - now);
    }

    return () => clearTimer();
  }, [isActive, hasPurchased, clearTimer, scheduleOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onEscape = (event) => {
      if (event.key === "Escape") {
        snoozeAndClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, snoozeAndClose]);

  const steps = [
    {
      title: "196 Easy Steps",
      note: "Build basics confidently",
      icon: Trophy,
    },
    {
      title: "219 Medium Steps",
      note: "Improve coordination & rhythm",
      icon: Layers,
    },
    {
      title: "226 Hard Steps",
      note: "Stage-ready performance level",
      icon: Flame,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm px-4 py-6 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={snoozeAndClose}
          role="presentation"
        >
          <div className="flex min-h-full items-center justify-center">
            <m.section
              role="dialog"
              aria-modal="true"
              aria-label="Course offer popup"
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-blue-500/35 bg-[#0F172A] p-5 sm:p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={snoozeAndClose}
                className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-600/70 bg-slate-900/70 text-slate-300 transition hover:text-white"
                aria-label="Close offer popup"
              >
                <X size={18} />
              </button>

              <span className="inline-flex min-h-8 items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 text-xs font-medium tracking-wide text-[#3B82F6]">
                Structured 639-Step System
              </span>

              <h2 className="mt-4 pr-12 text-2xl font-bold leading-tight text-white sm:text-3xl">
                Stop Guessing Steps. Follow a Clear System.
              </h2>

              <p className="mt-3 text-base leading-relaxed text-slate-300">
                639 practical steps designed for beginners.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {steps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="rounded-xl border border-sky-300/15 bg-slate-900/65 p-3"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <h3 className="mt-2 text-sm font-semibold text-slate-100">{item.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.note}</p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/70 p-4">
                <p className="text-sm text-gray-300">
                  Actual Value: <span className="ml-1 text-base line-through">INR 1500</span>
                </p>
                <p className="mt-1 text-sm text-gray-300">Now Available For:</p>
                <p className="text-4xl font-bold leading-none text-[#F59E0B]">INR 499</p>
                <p className="mt-2 text-sm text-gray-300">One-time payment. Lifetime access.</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="min-h-11 w-full rounded-xl bg-blue-500 px-4 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-blue-400"
                  onClick={onPrimaryClick}
                >
                  Unlock 639 Steps Now
                </button>
                <button
                  type="button"
                  className="min-h-11 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
                  onClick={snoozeAndClose}
                >
                  Maybe Later
                </button>
              </div>

              <p className="mt-4 text-center text-sm leading-relaxed text-slate-400">
                Over 1,000 learners started from zero.
                <br />
                Structure makes the difference.
              </p>
            </m.section>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(OfferPopup);

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Flame, Layers, Trophy, X } from "../icons.jsx";
import Button from "./Button.jsx";
import GlassCard from "./GlassCard.jsx";

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
      title: "196 easy steps",
      note: "Build the basics confidently.",
      icon: Trophy,
    },
    {
      title: "219 medium steps",
      note: "Improve rhythm, control, and coordination.",
      icon: Layers,
    },
    {
      title: "226 hard steps",
      note: "Move toward stage-ready energy.",
      icon: Flame,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          className="offer-popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={snoozeAndClose}
          role="presentation"
        >
          <m.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <GlassCard accent="gold" className="offer-popup" as="section" role="dialog" aria-modal="true" aria-label="Course offer popup">
              <div className="offer-popup__header">
                <div>
                  <span className="chip chip--gold">Structured 639-step system</span>
                  <h2 style={{ margin: "1rem 0 0.5rem", fontFamily: "var(--font-family-display)", fontSize: "2rem", lineHeight: 1.05 }}>
                    Stop guessing steps. Follow a clear learning arc.
                  </h2>
                  <p className="muted" style={{ margin: 0 }}>
                    AS Dance turns random practice into a guided path for beginners, creators, and performers.
                  </p>
                </div>

                <button type="button" className="icon-button" onClick={snoozeAndClose} aria-label="Close offer popup">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="offer-popup__steps">
                {steps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="offer-popup__step">
                      <span className="icon-orb">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <strong>{item.title}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>{item.note}</p>
                    </article>
                  );
                })}
              </div>

              <GlassCard className="summary-card" accent="red" style={{ marginBottom: "1rem" }}>
                <p className="muted" style={{ marginTop: 0 }}>Actual value: <span style={{ textDecoration: "line-through" }}>INR 1500</span></p>
                <div className="price-block">
                  <strong>INR 499</strong>
                  <span>One-time payment. Lifetime access. Dashboard unlock after payment.</span>
                </div>
              </GlassCard>

              <div className="button-row">
                <Button type="button" onClick={onPrimaryClick}>
                  Unlock 639 steps now
                </Button>
                <Button type="button" variant="secondary" onClick={snoozeAndClose}>
                  Maybe later
                </Button>
              </div>
            </GlassCard>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(OfferPopup);

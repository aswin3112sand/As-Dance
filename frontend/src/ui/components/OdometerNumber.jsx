import React, { useEffect, useId, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { loadScrollTrigger } from "../utils/gsapLoader.js";

const DIGIT_STACK = Array.from({ length: 30 }, (_, index) => index % 10);
const RESET_INDEX = 20;
const RESET_THRESHOLD = 180;
const INITIAL_SPIN = 10;

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

function normalizeValue(value) {
  if (value == null) return "0";
  return typeof value === "number" ? String(value) : String(value);
}

export default function OdometerNumber({
  value,
  prefix = "",
  suffix = "",
  className = "",
  triggerStart = "top 82%",
  duration = 1.2,
  once = true,
}) {
  const rootRef = useRef(null);
  const slotRefs = useRef([]);
  const slotStatesRef = useRef([]);
  const visibleRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const clipBaseId = useId();
  const displayValue = useMemo(() => normalizeValue(value), [value]);
  const tokens = useMemo(() => displayValue.split(""), [displayValue]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    slotRefs.current = slotRefs.current.slice(0, tokens.filter((token) => /\d/.test(token)).length);
  }, [prefersReducedMotion, tokens]);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return undefined;

    let ctx = null;
    let cancelled = false;

    const animateToValue = async (isFirstRun = false) => {
      const { gsap } = await loadScrollTrigger();
      if (!gsap || cancelled) return;

      let digitIndex = 0;

      tokens.forEach((token) => {
        if (!/\d/.test(token)) return;

        const slot = slotRefs.current[digitIndex];
        const nextDigit = Number(token);
        digitIndex += 1;

        if (!slot) return;

        const previousState = slotStatesRef.current[digitIndex - 1] || {
          digit: 0,
          position: RESET_INDEX,
        };

        if (previousState.position > RESET_THRESHOLD) {
          previousState.position = RESET_INDEX + previousState.digit;
          gsap.set(slot, { y: -(previousState.position * 100) });
        }

        const delta = (nextDigit - previousState.digit + 10) % 10;
        const nextPosition =
          previousState.position +
          (isFirstRun ? INITIAL_SPIN + delta : delta);

        slotStatesRef.current[digitIndex - 1] = {
          digit: nextDigit,
          position: nextPosition,
        };

        gsap.to(slot, {
          y: -(nextPosition * 100),
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    const setup = async () => {
      const { gsap, ScrollTrigger } = await loadScrollTrigger();
      if (!gsap || !ScrollTrigger || typeof ScrollTrigger.create !== "function" || cancelled || !rootRef.current) return;

      ctx = gsap.context(() => {
        slotRefs.current.forEach((slot) => {
          if (slot) {
            gsap.set(slot, { y: -(RESET_INDEX * 100) });
          }
        });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: triggerStart,
          once,
          onEnter: () => {
            visibleRef.current = true;
            animateToValue(true);
          },
          onEnterBack: () => {
            if (!once && !visibleRef.current) {
              visibleRef.current = true;
              animateToValue(true);
            }
          },
          onLeaveBack: () => {
            if (!once) {
              visibleRef.current = false;
            }
          },
        });
      }, rootRef);
    };

    setup();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [duration, once, prefersReducedMotion, tokens, triggerStart]);

  useEffect(() => {
    if (prefersReducedMotion || !visibleRef.current) return undefined;

    let cancelled = false;

    const run = async () => {
      const { gsap } = await loadScrollTrigger();
      if (!gsap || cancelled) return;

      let digitIndex = 0;

      tokens.forEach((token) => {
        if (!/\d/.test(token)) return;

        const slot = slotRefs.current[digitIndex];
        const nextDigit = Number(token);
        digitIndex += 1;

        if (!slot) return;

        const previousState = slotStatesRef.current[digitIndex - 1] || {
          digit: 0,
          position: RESET_INDEX,
        };

        if (previousState.position > RESET_THRESHOLD) {
          previousState.position = RESET_INDEX + previousState.digit;
          gsap.set(slot, { y: -(previousState.position * 100) });
        }

        const delta = (nextDigit - previousState.digit + 10) % 10;
        const nextPosition = previousState.position + delta;

        slotStatesRef.current[digitIndex - 1] = {
          digit: nextDigit,
          position: nextPosition,
        };

        gsap.to(slot, {
          y: -(nextPosition * 100),
          duration: Math.min(duration, 0.9),
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [displayValue, duration, prefersReducedMotion, tokens]);

  let digitRefIndex = -1;

  return (
    <span
      ref={rootRef}
      className={joinClasses("odometer", className)}
      aria-label={`${prefix}${displayValue}${suffix}`}
    >
      {prefix ? <span className="odometer__affix">{prefix}</span> : null}

      {prefersReducedMotion ? (
        <span className="odometer__plain">{displayValue}</span>
      ) : (
        <span className="odometer__digits" aria-hidden="true">
          {tokens.map((token, tokenIndex) => {
            if (!/\d/.test(token)) {
              return (
                <span key={`static-${token}-${tokenIndex}`} className="odometer__static">
                  {token}
                </span>
              );
            }

            digitRefIndex += 1;
            const slotIndex = digitRefIndex;
            const clipPathId = `${clipBaseId}-${slotIndex}`;

            return (
              <span key={`digit-${slotIndex}-${tokenIndex}`} className="odometer__slot">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="odometer__svg"
                >
                  <defs>
                    <clipPath id={clipPathId}>
                      <rect x="0" y="0" width="100" height="100" rx="18" ry="18" />
                    </clipPath>
                  </defs>

                  <g
                    ref={(node) => {
                      slotRefs.current[slotIndex] = node;
                    }}
                    clipPath={`url(#${clipPathId})`}
                  >
                    {DIGIT_STACK.map((digit, index) => (
                      <text
                        key={`${digit}-${index}`}
                        x="50"
                        y={74 + index * 100}
                        textAnchor="middle"
                        className="odometer__digit"
                      >
                        {digit}
                      </text>
                    ))}
                  </g>
                </svg>
              </span>
            );
          })}
        </span>
      )}

      {suffix ? <span className="odometer__affix">{suffix}</span> : null}
    </span>
  );
}

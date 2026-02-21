import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Star } from "../icons.jsx";
import { shouldReduceMotion } from "../utils/motion.js";
import "./ReviewLoop.css";

import w1 from "../../assets/bg/w1.webp";
import w2 from "../../assets/bg/w2.webp";
import w3 from "../../assets/bg/w3.webp";
import w4 from "../../assets/bg/w4.webp";
import w5 from "../../assets/bg/w5.webp";
import w6 from "../../assets/bg/w6.webp";
import w7 from "../../assets/bg/w7.webp";
import w8 from "../../assets/bg/w8.webp";
import w9 from "../../assets/bg/w9.webp";
import w10 from "../../assets/bg/w10.webp";
import w11 from "../../assets/bg/w11.webp";
import w12 from "../../assets/bg/w12.webp";
import w13 from "../../assets/bg/w13.webp";
import w14 from "../../assets/bg/w14.webp";
import w15 from "../../assets/bg/w15.webp";
import w16 from "../../assets/bg/w16.webp";

const PROFILE_IMAGES = [
  w1, w2, w3, w4,
  w5, w6, w7, w8,
  w9, w10, w11, w12,
  w13, w14, w15, w16
];

const REVIEWS = [
  { id: 1, name: "Karthi", profileIndex: 0, tagline: "AS DANCE Learner", txt: "Na beginner. 1st week la than confidence increase aachu." },
  { id: 2, name: "Stephan", profileIndex: 1, tagline: "AS DANCE Learner", txt: "Steps easy ah split pannirukanga, daily practice panna romba use aachu." },
  { id: 3, name: "Babu", profileIndex: 2, tagline: "AS DANCE Learner", txt: "Beat follow panna theriyala nu irundhen. Ippo counts clear ah puriyuthu." },
  { id: 4, name: "Godjeni", profileIndex: 3, tagline: "AS DANCE Learner", txt: "WhatsApp support quick. Doubt ketta immediate direction kuduthanga." },
  { id: 5, name: "Rickson", profileIndex: 4, tagline: "AS DANCE Learner", txt: "Short daily drills nala body control improve aaguthu." },
  { id: 6, name: "Akash", profileIndex: 5, tagline: "AS DANCE Learner", txt: "Tamil + English explanation nala confuse agala." },
  { id: 7, name: "Arun", profileIndex: 6, tagline: "AS DANCE Learner", txt: "College culturals ku prepare aagarathukku helpful framework." },
  { id: 8, name: "Wifread", profileIndex: 7, tagline: "AS DANCE Learner", txt: "Access and flow simple ah irundhuchu, mobile la practice panniten." },
  { id: 9, name: "Akish", profileIndex: 8, tagline: "AS DANCE Learner", txt: "Naan stage fear irundhen. Ippo konjam confident ah aadaren." },
  { id: 10, name: "Vishal", profileIndex: 9, tagline: "AS DANCE Learner", txt: "Pacing nalla iruku. Over speed illa, clear progression iruku." },
  { id: 11, name: "Rabi", profileIndex: 10, tagline: "AS DANCE Learner", txt: "Practice routine set pannitu follow panna easy aachu." },
  { id: 12, name: "Rio", profileIndex: 11, tagline: "AS DANCE Learner", txt: "Promise pannina support timing ku reply vandhuchu." },
  { id: 13, name: "Kabi", profileIndex: 12, tagline: "AS DANCE Learner", txt: "Motivation drop aagumbothu guidance helpful ah irundhuchu." },
  { id: 14, name: "PeriyaVijay", profileIndex: 13, tagline: "AS DANCE Learner", txt: "Home la practice panna suitable format." },
  { id: 15, name: "Venkat", profileIndex: 14, tagline: "AS DANCE Learner", txt: "Course path clear. Enna first panna nu direct ah therinjiduchu." },
  { id: 16, name: "Starwin", profileIndex: 15, tagline: "AS DANCE Learner", txt: "Beginner-ku nalla starting point nu feel aachu." }
];

const STAR_KEYS = [1, 2, 3, 4, 5];
const AUTO_SCROLL_PX_PER_SECOND = 26;
const AUTO_RESUME_DELAY = 2200;
const FALLBACK_CARD_STEP = 300;

const ReviewCard = memo(function ReviewCard({ review }) {
  const profile = PROFILE_IMAGES[review.profileIndex % PROFILE_IMAGES.length];

  return (
    <article className="review-loop-card" role="listitem">
      <div className="review-loop-card-head">
        <div className="review-loop-avatar-wrap">
          <img
            src={profile}
            alt={`${review.name} profile`}
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            width="56"
            height="56"
            className="review-loop-avatar"
          />
          <span className="review-loop-badge">{`#${review.id}`}</span>
        </div>
        <div>
          <p className="review-loop-name">{review.name}</p>
          <p className="review-loop-tagline">{review.tagline}</p>
        </div>
      </div>
      <p className="review-loop-copy">"{review.txt}"</p>
      <div className="review-loop-stars" aria-hidden="true">
        {STAR_KEYS.map((star) => (
          <Star key={star} size={16} fill="currentColor" stroke="none" />
        ))}
      </div>
    </article>
  );
});

function ReviewLoop() {
  const [isAnimating, setIsAnimating] = useState(() => {
    if (typeof window === "undefined") return false;
    return !shouldReduceMotion();
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const scrollerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const loopReviews = useMemo(() => (isAnimating ? [...REVIEWS, ...REVIEWS] : REVIEWS), [isAnimating]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const normalizeLoopPosition = useCallback((scroller) => {
    const loopPoint = scroller.scrollWidth / 2;
    if (!loopPoint || !Number.isFinite(loopPoint)) return;
    if (scroller.scrollLeft >= loopPoint) {
      scroller.scrollLeft -= loopPoint;
      return;
    }
    if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft += loopPoint;
    }
  }, []);

  const pauseTemporarily = useCallback(() => {
    if (!isAnimating) return;
    clearResumeTimer();
    setIsPaused(true);
    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, AUTO_RESUME_DELAY);
  }, [clearResumeTimer, isAnimating]);

  const handleBlur = useCallback((event) => {
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
      clearResumeTimer();
      setIsPaused(false);
    }
  }, [clearResumeTimer]);

  const scrollByCard = useCallback((direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const track = scroller.querySelector(".review-loop-track");
    const firstCard = scroller.querySelector(".review-loop-card");
    const trackStyles = track ? window.getComputedStyle(track) : null;
    const gap = trackStyles ? parseFloat(trackStyles.columnGap || trackStyles.gap || "0") : 0;
    const step = (firstCard?.getBoundingClientRect().width || FALLBACK_CARD_STEP) + gap;

    scroller.scrollBy({ left: direction * step, behavior: "smooth" });

    if (isAnimating) {
      pauseTemporarily();
      window.setTimeout(() => {
        const current = scrollerRef.current;
        if (current) normalizeLoopPosition(current);
      }, 360);
    }
  }, [isAnimating, normalizeLoopPosition, pauseTemporarily]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const handleChange = (event) => setIsCoarsePointer(event.matches);

    setIsCoarsePointer(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !isAnimating) return;
    if (scroller.scrollLeft < 1) {
      scroller.scrollLeft = 1;
    }
  }, [isAnimating, loopReviews.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !isAnimating || isPaused) return;

    let lastTime = performance.now();
    const animate = (timestamp) => {
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      scroller.scrollLeft += (AUTO_SCROLL_PX_PER_SECOND * delta) / 1000;
      normalizeLoopPosition(scroller);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAnimating, isPaused, loopReviews.length, normalizeLoopPosition]);

  useEffect(() => {
    return () => {
      clearResumeTimer();
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [clearResumeTimer]);

  return (
    <section id="reviews" className="section review-loop-section section-anim" aria-labelledby="reviews-title">
      <div className="review-loop-fog" aria-hidden="true" />
      <div className="container-max">
        <header className="review-loop-header">
          <h2 className="review-loop-title" id="reviews-title">Real learners, real progress</h2>
          <p className="review-loop-subtitle">
            Fake hype illa. Beginner users regular practice pannitu share pannina honest feedback idhu.
          </p>
        </header>

        <div className="review-loop-shell">
          <div
            ref={scrollerRef}
            className={`review-loop-scroller ${isAnimating ? "is-animating" : "is-static"} ${isCoarsePointer ? "is-touch" : ""}`}
            onMouseEnter={() => {
              if (!isAnimating || isCoarsePointer) return;
              setIsPaused(true);
            }}
            onMouseLeave={() => {
              clearResumeTimer();
              setIsPaused(false);
            }}
            onFocusCapture={() => {
              if (!isAnimating) return;
              setIsPaused(true);
            }}
            onBlurCapture={handleBlur}
            onScroll={() => {
              if (!isAnimating) return;
              const scroller = scrollerRef.current;
              if (scroller) normalizeLoopPosition(scroller);
            }}
            onTouchStart={() => {
              if (!isAnimating) return;
              clearResumeTimer();
              setIsPaused(true);
            }}
            onTouchEnd={pauseTemporarily}
            onTouchCancel={pauseTemporarily}
          >
            <div className="review-loop-track" role="list" aria-label="Customer reviews">
              {loopReviews.map((review, idx) => (
                <ReviewCard key={`review-${review.id}-${idx}`} review={review} />
              ))}
            </div>
          </div>

          <div className="review-loop-controls">
            <button
              type="button"
              className="review-loop-control"
              onClick={() => scrollByCard(-1)}
              aria-label="View previous reviews"
            >
              Prev
            </button>
            <button
              type="button"
              className={`review-loop-control ${isAnimating ? "active" : ""}`}
              onClick={() => {
                clearResumeTimer();
                setIsPaused(false);
                setIsAnimating((prev) => !prev);
              }}
              aria-pressed={isAnimating}
              aria-label={isAnimating ? "Pause review auto scroll" : "Play review auto scroll"}
            >
              {isAnimating ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              className="review-loop-control"
              onClick={() => scrollByCard(1)}
              aria-label="View next reviews"
            >
              Next
            </button>
          </div>
          <p className="review-loop-status" aria-live="polite">
            {isAnimating ? (isPaused ? "Auto scroll paused" : "Auto scroll running") : "Manual swipe mode enabled"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(ReviewLoop);

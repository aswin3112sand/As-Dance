
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "../icons.jsx";
import easyBg from "../../assets/bg/dhanush.webp";
import mediumBg from "../../assets/bg/simbu.webp";
import hardBg from "../../assets/bg/Hrithick.webp";

const DEMO_THUMBS = [
    {
        id: 1,
        title: "Easy",
        tone: "easy",
        steps: "196",
        difficulty: "Easy",
        caption: "Foundations and timing control",
        description: "Foundation drills with clean timing and body lines.",
        img: easyBg
    },
    {
        id: 2,
        title: "Medium",
        tone: "medium",
        steps: "219",
        difficulty: "Medium",
        caption: "Rhythm transitions with stage control",
        description: "Rhythm changes, travel steps, and angle transitions.",
        img: mediumBg
    },
    {
        id: 3,
        title: "Hard",
        tone: "hard",
        steps: "226",
        difficulty: "Hard",
        caption: "Performance pace and spotlight power",
        description: "Performance pace combos with spotlight-ready control.",
        img: hardBg
    },
];

export default function DanceCarousel() {
    const trackRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const intervalRef = useRef(null);
    const hoverRef = useRef(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const getStep = useCallback(() => {
        const track = trackRef.current;
        if (!track) return 0;
        const card = track.querySelector(".carousel-card");
        if (!card) return 0;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap || 0);
        return card.offsetWidth + gap;
    }, []);

    const scrollNext = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const step = getStep();
        if (!step) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const next = track.scrollLeft + step;
        if (next >= maxScroll - 4) {
            track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            track.scrollTo({ left: next, behavior: "smooth" });
        }
    }, [getStep]);

    const scrollPrev = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const step = getStep();
        if (!step) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const next = track.scrollLeft - step;
        if (next <= 0) {
            track.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
            track.scrollTo({ left: next, behavior: "smooth" });
        }
    }, [getStep]);

    const scrollToIndex = useCallback(
        (index) => {
            const track = trackRef.current;
            if (!track) return;
            const step = getStep();
            if (!step) return;
            track.scrollTo({ left: step * index, behavior: "smooth" });
        },
        [getStep]
    );

    const startAuto = useCallback(() => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(scrollNext, 3200);
    }, [scrollNext]);

    const stopAuto = useCallback(() => {
        if (!intervalRef.current) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);

    const scheduleResume = useCallback(() => {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = setTimeout(() => {
            if (!hoverRef.current) startAuto();
        }, 5500);
    }, [startAuto]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return undefined;

        const onEnter = () => {
            hoverRef.current = true;
            stopAuto();
        };

        const onLeave = () => {
            hoverRef.current = false;
            startAuto();
        };

        const onInteract = () => {
            stopAuto();
            scheduleResume();
        };

        track.addEventListener("mouseenter", onEnter);
        track.addEventListener("mouseleave", onLeave);
        track.addEventListener("pointerdown", onInteract);
        track.addEventListener("touchstart", onInteract, { passive: true });

        startAuto();

        return () => {
            stopAuto();
            clearTimeout(resumeTimeoutRef.current);
            track.removeEventListener("mouseenter", onEnter);
            track.removeEventListener("mouseleave", onLeave);
            track.removeEventListener("pointerdown", onInteract);
            track.removeEventListener("touchstart", onInteract);
        };
    }, [scheduleResume, startAuto, stopAuto]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let rafId = null;

        const updateIndex = () => {
            rafId = null;
            const step = getStep();
            if (!step) return;
            const index = Math.round(track.scrollLeft / step);
            setActiveIndex(Math.min(Math.max(index, 0), DEMO_THUMBS.length - 1));
        };

        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(updateIndex);
        };

        track.addEventListener("scroll", onScroll, { passive: true });
        updateIndex();

        return () => {
            track.removeEventListener("scroll", onScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [getStep]);

    const handleNav = (direction) => {
        stopAuto();
        if (direction === "next") {
            scrollNext();
        } else {
            scrollPrev();
        }
        scheduleResume();
    };

    const handleDot = (index) => {
        stopAuto();
        scrollToIndex(index);
        scheduleResume();
    };

    return (
        <section className="dance-carousel stage-carousel" aria-label="AS DANCE premium stage carousel">
            <div className="stage-atmosphere" aria-hidden="true">
                <div className="stage-crowd"></div>
                <div className="stage-spotlights">
                    <span className="stage-spotlight beam-left"></span>
                    <span className="stage-spotlight beam-center"></span>
                    <span className="stage-spotlight beam-right"></span>
                </div>
            </div>

            <div className="stage-carousel-header">
                <p className="stage-kicker">AS DANCE - 639 Premium Step Curriculum</p>
                <h3 className="stage-overlay-text">
                    Stage Ready &bull; Competition Worthy &bull; Crowd Impress Guaranteed
                </h3>
            </div>

            <div className="stage-carousel-shell">
                <button
                    className="carousel-nav prev"
                    type="button"
                    aria-label="Previous stage card"
                    onClick={() => handleNav("prev")}
                >
                    <span className="nav-arrow" aria-hidden="true"></span>
                </button>
                <div className="carousel-track" ref={trackRef}>
                    {DEMO_THUMBS.map((item) => (
                        <div className={`carousel-card tone-${item.tone}`} key={item.id}>
                            <div className="carousel-card-motion">
                                <div className="carousel-card-inner">
                                    <div className="carousel-card-face carousel-card-front">
                                        <div
                                            className="carousel-silhouette"
                                            style={{ backgroundImage: `url(${item.img})` }}
                                        ></div>
                                        <div className="carousel-front-content">
                                            <span className={`carousel-badge badge-${item.tone}`}>
                                                {item.difficulty}
                                            </span>
                                            <div className="carousel-step">{item.steps}</div>
                                            <div className="carousel-step-label">Steps</div>
                                            <div className="carousel-front-caption">{item.caption}</div>
                                        </div>
                                    </div>
                                    <div className="carousel-card-face carousel-card-back">
                                        <div
                                            className="carousel-dancer"
                                            style={{ backgroundImage: `url(${item.img})` }}
                                        ></div>
                                        <div className="carousel-back-content">
                                            <h4>{item.title} Spotlight</h4>
                                            <p>{item.description}</p>
                                            <a className="carousel-cta" href="#preview">
                                                <Play size={14} />
                                                Watch Stage Demo
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-nav next"
                    type="button"
                    aria-label="Next stage card"
                    onClick={() => handleNav("next")}
                >
                    <span className="nav-arrow" aria-hidden="true"></span>
                </button>
            </div>

            <div className="carousel-dots" role="tablist" aria-label="Stage cards">
                {DEMO_THUMBS.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`carousel-dot ${index === activeIndex ? "is-active" : ""}`}
                        aria-label={`${item.title} steps`}
                        aria-pressed={index === activeIndex}
                        onClick={() => handleDot(index)}
                    ></button>
                ))}
            </div>
        </section>
    );
}

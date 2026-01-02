
import React, { useEffect, useRef } from "react";
import { Eye, Play } from "../icons.jsx";
import easyBg from "../../assets/bg/dhanush.webp";
import mediumBg from "../../assets/bg/simbu.webp";
import hardBg from "../../assets/bg/Hrithick.webp";

const DEMO_THUMBS = [
    {
        id: 1,
        title: "Easy",
        caption: "196 easy steps preview – fundamentals and timing",
        img: easyBg
    },
    {
        id: 2,
        title: "Medium",
        caption: "219 medium steps preview – rhythm and transitions",
        img: mediumBg
    },
    {
        id: 3,
        title: "Hard",
        caption: "226 hard steps preview – performance level moves",
        img: hardBg
    },
];

export default function DanceCarousel() {
    const trackRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const intervalRef = useRef(null);
    const hoverRef = useRef(false);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return undefined;

        const getStep = () => {
            const card = track.querySelector(".carousel-card");
            if (!card) return 0;
            const styles = getComputedStyle(track);
            const gap = parseFloat(styles.gap || styles.columnGap || 0);
            return card.offsetWidth + gap;
        };

        const scrollNext = () => {
            const step = getStep();
            if (!step) return;
            const maxScroll = track.scrollWidth - track.clientWidth;
            const next = track.scrollLeft + step;
            if (next >= maxScroll - 4) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollTo({ left: next, behavior: "smooth" });
            }
        };

        const start = () => {
            if (intervalRef.current) return;
            intervalRef.current = setInterval(scrollNext, 3000);
        };

        const stop = () => {
            if (!intervalRef.current) return;
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };

        const scheduleResume = () => {
            clearTimeout(resumeTimeoutRef.current);
            resumeTimeoutRef.current = setTimeout(() => {
                if (!hoverRef.current) start();
            }, 5500);
        };

        const onEnter = () => {
            hoverRef.current = true;
            stop();
        };

        const onLeave = () => {
            hoverRef.current = false;
            start();
        };

        const onInteract = () => {
            stop();
            scheduleResume();
        };

        track.addEventListener("mouseenter", onEnter);
        track.addEventListener("mouseleave", onLeave);
        track.addEventListener("pointerdown", onInteract);
        track.addEventListener("touchstart", onInteract, { passive: true });

        start();

        return () => {
            stop();
            clearTimeout(resumeTimeoutRef.current);
            track.removeEventListener("mouseenter", onEnter);
            track.removeEventListener("mouseleave", onLeave);
            track.removeEventListener("pointerdown", onInteract);
            track.removeEventListener("touchstart", onInteract);
        };
    }, []);

    return (
        <div className="dance-carousel">
            <div className="carousel-track" ref={trackRef}>
                {DEMO_THUMBS.map((item) => (
                    <div
                        className="carousel-card"
                        key={item.id}
                        style={{
                            backgroundImage: `url(${item.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <div className="carousel-overlay">
                            <div className="carousel-status">
                                <Play size={16} />
                            </div>
                            <div className="carousel-info">
                                <h4>{item.title}</h4>
                                <div className="carousel-meta">
                                    <Eye size={12} /> {item.caption}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import React, { useLayoutEffect, useRef } from "react";
import { loadScrollTrigger } from "../utils/gsapLoader.js";
import { shouldReduceMotion } from "../utils/motion.js";

export default function ParallaxBackgrounds() {
    const rootRef = useRef(null);

    // Generate stars only once
    const stars = React.useMemo(() => {
        const reduceMotion = typeof window !== "undefined" && shouldReduceMotion();
        const count = reduceMotion ? 24 : 60;
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1 + "px",
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.7 + 0.3,
            colorClass: Math.random() > 0.7 ? (Math.random() > 0.5 ? "blue" : "purple") : ""
        }));
    }, []);

    useLayoutEffect(() => {
        if (shouldReduceMotion()) return undefined;
        let ctx = null;
        let cancelled = false;

        const run = async () => {
            const { gsap } = await loadScrollTrigger();
            if (!gsap || cancelled) return;
            ctx = gsap.context(() => {
                // Animate Nebula Clouds instead of mesh-orbs
                gsap.to(".nebula-cloud", {
                    y: -30,
                    x: 10,
                    scale: 1.1,
                    duration: 8,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    force3D: true, // Hardware acceleration
                    stagger: {
                        each: 0.5,
                        from: "random"
                    }
                });

                // Section-specific background triggers
                const sections = [
                    { id: "top", bgClass: ".bg-layer-hero" },
                    { id: "routines", bgClass: ".bg-layer-stats" },
                    { id: "styles", bgClass: ".bg-layer-offer" },
                    { id: "demos", bgClass: ".bg-layer-demo" },
                    { id: "reviews", bgClass: ".bg-layer-reviews" },
                    { id: "contact", bgClass: ".bg-layer-contact" }
                ];

                sections.forEach(({ id, bgClass }) => {
                    const sectionEl = document.getElementById(id);
                    const bgEl = rootRef.current.querySelector(bgClass);

                    if (sectionEl && bgEl) {
                        gsap.fromTo(bgEl,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                scrollTrigger: {
                                    trigger: sectionEl,
                                    start: "top center",
                                    end: "bottom center",
                                    toggleActions: "play reverse play reverse",
                                    scrub: 1
                                }
                            }
                        );
                    }
                });
            }, rootRef);
        };

        run();
        return () => {
            cancelled = true;
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <div className="parallax-root" ref={rootRef} aria-hidden="true">
            {/* Main Star Field Layer - Persistent */}
            <div className="star-field">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className={`galaxy-star ${star.colorClass}`}
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                            "--delay": star.animationDelay
                        }}
                    />
                ))}
            </div>

            {/* Hero Nebula */}
            <div className="parallax-container bg-layer-hero" style={{ opacity: 1 }}>
                <div className="nebula-cloud" style={{ top: "10%", left: "10%", width: "500px", height: "500px", opacity: 0.4 }} />
                <div className="nebula-cloud is-purple" style={{ bottom: "5%", right: "-10%", width: "600px", height: "600px", opacity: 0.3 }} />
            </div>

            {/* Stats Nebula */}
            <div className="parallax-container bg-layer-stats" style={{ opacity: 0 }}>
                <div className="nebula-cloud is-blue" style={{ top: "20%", left: "60%", width: "550px", height: "550px", opacity: 0.25 }} />
            </div>

            {/* Services/Offer Nebula */}
            <div className="parallax-container bg-layer-offer" style={{ opacity: 0 }}>
                <div className="nebula-cloud is-pink" style={{ top: "15%", right: "15%", width: "400px", height: "400px", opacity: 0.3 }} />
                <div className="nebula-cloud" style={{ bottom: "-10%", left: "5%", width: "450px", height: "450px", opacity: 0.25 }} />
            </div>

            {/* Demo Nebula */}
            <div className="parallax-container bg-layer-demo" style={{ opacity: 0 }}>
                <div className="nebula-cloud is-purple" style={{ top: "-10%", right: "-5%", width: "500px", height: "500px", opacity: 0.3 }} />
                <div className="nebula-cloud is-blue" style={{ bottom: "10%", left: "-10%", width: "400px", height: "400px", opacity: 0.25 }} />
            </div>

            {/* Reviews Nebula */}
            <div className="parallax-container bg-layer-reviews" style={{ opacity: 0 }}>
                <div className="nebula-cloud is-purple" style={{ top: "20%", left: "30%", width: "350px", height: "350px", opacity: 0.2 }} />
            </div>

            {/* Contact Nebula */}
            <div className="parallax-container bg-layer-contact" style={{ opacity: 0 }}>
                <div className="nebula-cloud is-blue" style={{ top: "40%", right: "20%", width: "600px", height: "600px", opacity: 0.15 }} />
            </div>
        </div>
    );
}

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBackgrounds() {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (!prefersReducedMotion) {
                gsap.to(".mesh-orb", {
                    y: -40,
                    x: 18,
                    duration: 6,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    stagger: {
                        each: 0.6,
                        from: "random"
                    }
                });
            }

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

        return () => ctx.revert();
    }, []);

    return (
        <div className="parallax-root" ref={rootRef} aria-hidden="true">
            {/* Hero BG */}
            <div className="parallax-container bg-layer-hero" style={{ opacity: 1 }}>
                <div className="mesh-orb" style={{ top: "8%", left: "6%", width: "420px", height: "420px", opacity: 0.4 }} />
                <div className="mesh-orb is-purple" style={{ bottom: "-10%", right: "-5%", width: "380px", height: "380px", opacity: 0.35 }} />
                <div className="mesh-orb is-amber" style={{ top: "30%", right: "35%", width: "220px", height: "220px", opacity: 0.3 }} />
            </div>

            {/* Stats BG */}
            <div className="parallax-container bg-layer-stats" style={{ opacity: 0 }}>
                <div className="mesh-orb is-ink" style={{ top: "30%", left: "60%", width: "520px", height: "520px", opacity: 0.2 }} />
                <div className="mesh-orb" style={{ top: "60%", left: "10%", width: "260px", height: "260px", opacity: 0.18 }} />
            </div>

            {/* Services/Offer BG */}
            <div className="parallax-container bg-layer-offer" style={{ opacity: 0 }}>
                <div className="mesh-orb" style={{ top: "15%", right: "12%", width: "360px", height: "360px", opacity: 0.3 }} />
                <div className="mesh-orb is-amber" style={{ bottom: "0%", left: "10%", width: "260px", height: "260px", opacity: 0.28 }} />
            </div>

            {/* Demo BG */}
            <div className="parallax-container bg-layer-demo" style={{ opacity: 0 }}>
                <div className="mesh-orb" style={{ top: "-5%", right: "0%", width: "420px", height: "420px", opacity: 0.3 }} />
                <div className="mesh-orb is-purple" style={{ bottom: "-5%", left: "-8%", width: "320px", height: "320px", opacity: 0.32 }} />
                <div className="mesh-orb is-amber" style={{ bottom: "20%", right: "30%", width: "200px", height: "200px", opacity: 0.25 }} />
            </div>

            {/* Reviews BG */}
            <div className="parallax-container bg-layer-reviews" style={{ opacity: 0 }}>
                <div className="mesh-orb is-purple" style={{ top: "10%", left: "20%", width: "260px", height: "260px", opacity: 0.28 }} />
                <div className="mesh-orb" style={{ bottom: "10%", right: "10%", width: "240px", height: "240px", opacity: 0.22 }} />
            </div>

            {/* Contact BG */}
            <div className="parallax-container bg-layer-contact" style={{ opacity: 0 }}>
                <div className="mesh-orb is-ink" style={{ top: "40%", left: "40%", width: "420px", height: "420px", opacity: 0.15 }} />
            </div>
        </div>
    );
}

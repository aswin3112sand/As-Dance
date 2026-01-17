
import React, { useEffect, useRef } from "react";
import { loadScrollTrigger } from "../utils/gsapLoader.js";
import { shouldReduceMotion } from "../utils/motion.js";

export default function StatsStrip() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (shouldReduceMotion()) return;
        let ctx = null;
        let cancelled = false;

        const run = async () => {
            const { gsap } = await loadScrollTrigger();
            if (!gsap || cancelled) return;
            ctx = gsap.context(() => {
                gsap.from(".stat-val", {
                    textContent: 0,
                    duration: 2.5,
                    ease: "power2.out",
                    snap: { textContent: 1 },
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%"
                    }
                });
            }, containerRef);
        };

        run();
        return () => {
            cancelled = true;
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section className="section stats-strip section-wrapper bg-stats" ref={containerRef}>
            <div className="container-max">
                <div className="stats-card card-3d">
                    <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap text-center py-2">
                        <div className="d-flex align-items-center gap-3 px-4 border-end border-secondary border-opacity-25">
                            <h2 className="display-4 fw-bold text-white mb-0 animate-count stat-val">639</h2>
                            <div className="text-start text-white-50 lh-1">
                                <div className="small text-uppercase">Total</div>
                                <div className="fw-bold text-white">STEPS</div>
                            </div>
                        </div>

                        <div className="d-flex gap-4">
                            <div className="text-center">
                                <div className="fs-3 fw-bold text-neon-blue mb-0 stat-val">196</div>
                                <div className="small text-muted text-uppercase">Easy</div>
                            </div>
                            <div className="vr bg-secondary opacity-25"></div>
                            <div className="text-center">
                                <div className="fs-3 fw-bold text-neon-purple mb-0 stat-val">219</div>
                                <div className="small text-muted text-uppercase">Medium</div>
                            </div>
                            <div className="vr bg-secondary opacity-25"></div>
                            <div className="text-center">
                                <div className="fs-3 fw-bold text-neon-pink mb-0 stat-val">226</div>
                                <div className="small text-muted text-uppercase">Hard</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

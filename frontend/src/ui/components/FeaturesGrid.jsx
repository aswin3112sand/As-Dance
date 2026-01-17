import React, { useEffect, useRef } from 'react';
import { Video, Layers, Calendar, Star } from 'lucide-react';
import { loadScrollTrigger } from "../utils/gsapLoader.js";
import { shouldReduceMotion } from "../utils/motion.js";

const features = [
    {
        icon: <Video size={32} color="#b026ff" />,
        title: "Online Recording",
        desc: "Choose a convenient training day and time",
        action: "Select"
    },
    {
        icon: <Layers size={32} color="#26dcff" />,
        title: "Different Format",
        desc: "A pure space where you can reveal yourself",
        action: null
    },
    {
        icon: <Calendar size={32} color="#ff26b9" />,
        title: "Regular Events",
        desc: "Professional filming, reportage, themed photo sessions",
        action: null
    },
    {
        icon: <Star size={32} color="#ffffff" />,
        title: "Creative Atmosphere",
        desc: "A pure space where you can reveal yourself and get support",
        action: null
    }
];

const FeaturesGrid = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        if (shouldReduceMotion()) return;
        let ctx = null;
        let cancelled = false;

        const run = async () => {
            const { gsap } = await loadScrollTrigger();
            if (!gsap || cancelled) return;
            ctx = gsap.context(() => {
                gsap.fromTo(
                    el.children,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.2,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        }
                    }
                );
            }, el);
        };

        run();
        return () => {
            cancelled = true;
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section className="py-5 bg-dark position-relative">
            <div className="container-max">
                <div ref={sectionRef} className="row g-4">
                    {features.map((feature, idx) => (
                        <div className="col-lg-3 col-md-6" key={idx}>
                            <div className="glass-panel p-4 h-100 d-flex flex-column hover-lift transition-all duration-300" style={{ minHeight: '220px', borderTop: `2px solid ${idx % 2 === 0 ? 'var(--neon-purple)' : 'var(--neon-blue)'}` }}>
                                <div className="mb-3 p-3 rounded-circle d-inline-block" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    {feature.icon}
                                </div>
                                <h5 className="fw-bold mb-2 text-white">{feature.title}</h5>
                                <p className="text-muted small mb-3 flex-grow-1">{feature.desc}</p>

                                {feature.action && (
                                    <button className="btn btn-sm btn-outline-light rounded-pill px-3">
                                        {feature.action}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;

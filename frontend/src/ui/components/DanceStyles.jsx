import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { loadScrollTrigger } from "../utils/gsapLoader.js";
import { shouldReduceMotion } from "../utils/motion.js";

const styles = [
    { id: 1, title: 'High Heels', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1887&auto=format&fit=crop', desc: 'Femininity, confidence and grace on heels.' },
    { id: 2, title: 'Strip Plastic', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop', desc: 'Sensuality, fluidity and liberation through dance.' },
    { id: 3, title: 'Jazz Funk', img: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop', desc: 'Expressive, flashy, rhythmic mix of movement.' },
    { id: 4, title: 'Stretching', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop', desc: 'Flexibility, elasticity - the basis for any dancer.' },
];

const DanceStyles = () => {
    const gridRef = useRef(null);

    const tiltEnabledRef = useRef(false);

    useEffect(() => {
        tiltEnabledRef.current = !shouldReduceMotion() && !window.matchMedia("(pointer: coarse)").matches;
    }, []);

    useEffect(() => {
        if (!gridRef.current) return;
        if (shouldReduceMotion()) return;
        let ctx = null;
        let cancelled = false;

        const run = async () => {
            const { gsap } = await loadScrollTrigger();
            if (!gsap || cancelled) return;
            ctx = gsap.context(() => {
                gsap.fromTo(
                    gridRef.current.children,
                    { opacity: 0, y: 40, rotationX: 10 },
                    {
                        opacity: 1, y: 0, rotationX: 0,
                        stagger: 0.15,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 80%"
                        }
                    }
                );
            }, gridRef);
        };

        run();
        return () => {
            cancelled = true;
            if (ctx) ctx.revert();
        };
    }, []);

    const handleTilt = (e, card) => {
        if (!tiltEnabledRef.current) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8; // -8 to +8 (inverted Y)
        const rotateY = ((x - centerX) / centerX) * 12; // -12 to +12

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleReset = (card) => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <section className="py-5 position-relative">
            <div className="container-max">
                <div className="text-center mb-5">
                    <h2 className="section-title">Our Directions</h2>
                    <p className="text-muted">Click on a card to learn more about each direction</p>
                </div>

                <div ref={gridRef} className="row g-4">
                    {styles.map((style) => (
                        <div className="col-lg-3 col-md-6 col-sm-12" key={style.id}>
                            <div
                                className="style-card position-relative overflow-hidden rounded-4 card-3d"
                                style={{ height: '400px', cursor: 'pointer', transition: 'transform 0.1s ease-out' }}
                                onMouseMove={(e) => handleTilt(e, e.currentTarget)}
                                onMouseLeave={(e) => handleReset(e.currentTarget)}
                            >
                                {/* Background Image */}
                                <div
                                    className="w-100 h-100"
                                    style={{
                                        backgroundImage: `url(${style.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        transition: 'transform 0.5s ease',
                                    }}
                                ></div>

                                {/* Overlay */}
                                <div className="position-absolute bottom-0 start-0 w-100 p-4"
                                    style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}>
                                    <h4 className="text-white fw-bold text-uppercase mb-2">{style.title}</h4>
                                    <p className="text-white-50 small mb-3">{style.desc}</p>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-neon-blue small fw-bold">Learn More</span>
                                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                            <ArrowUpRight size={18} color="#000" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DanceStyles;

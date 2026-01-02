import React, { useEffect, useRef } from 'react';

const NewHeroHeader = () => {
    const navRef = useRef(null);
    const starsRef = useRef(null);

    useEffect(() => {
        // Navbar slide animation on load
        const nav = navRef.current;
        if (nav) {
            const links = nav.querySelectorAll('.nhh-nav-links a');
            links.forEach((link, idx) => {
                link.style.animation = `slideInNav 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.08}s both`;
            });
        }

        // Generate stars
        const starsContainer = starsRef.current;
        if (starsContainer) {
            // Avoid duplicates in React strict mode dev (effect can mount twice)
            starsContainer.innerHTML = '';

            for (let i = 0; i < 80; i++) {
                const star = document.createElement('div');
                star.className = 'night-star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 40 + '%';

                const size = 1 + Math.random() * 1.8;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.opacity = (0.25 + Math.random() * 0.7).toFixed(2);

                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (2 + Math.random() * 3) + 's';
                starsContainer.appendChild(star);
            }

            // Shooting stars
            for (let i = 0; i < 3; i++) {
                const shootingStar = document.createElement('div');
                shootingStar.className = 'shooting-star';

                shootingStar.style.left = (8 + Math.random() * 84) + '%';
                shootingStar.style.top = (6 + Math.random() * 22) + '%';

                const duration = 14 + Math.random() * 10;
                shootingStar.style.animationDuration = `${duration}s`;
                shootingStar.style.animationDelay = `${Math.random() * duration}s`;
                shootingStar.style.setProperty('--shoot-distance', `${280 + Math.random() * 220}px`);
                shootingStar.style.setProperty('--shoot-angle', `${35 + Math.random() * 20}deg`);

                starsContainer.appendChild(shootingStar);
            }
        }
    }, []);

    return (
        <div className="nhh-container">
            {/* Night Sky Background */}
            <div className="night-sky-bg">
                {/* Sky gradient */}
                <div className="sky-gradient"></div>

                {/* Fog/Smoke layer */}
                <div className="night-fog-layer"></div>

                {/* Stars container */}
                <div className="night-stars-container" ref={starsRef}></div>

                {/* Moon */}
                <div className="night-moon">
                    <div className="moon-surface"></div>
                    <div className="moon-glow"></div>
                </div>

                {/* Neon edge lighting */}
                <div className="neon-edge-top"></div>
                <div className="neon-edge-bottom"></div>
            </div>

            {/* Tech Mesh Grid Overlay */}
            <div className="nhh-grid-overlay"></div>

            {/* Animated Navbar */}
            <nav className="nhh-navbar" ref={navRef}>
                <div className="nhh-logo">AS DANCE</div>
                <div className="nhh-nav-links">
                    <a href="#preview">Preview</a>
                    <a href="#bundle">Bundle</a>
                    <a href="#curriculum">Curriculum</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>

            {/* Scrolling Text Strip */}
            <div className="nhh-tagline-strip">
                <div className="nhh-scrolling-text">
                    COMPETITION WORTHY • CROWD IMPRESS GUARANTEED • 100% STUDIO GRADE • NEON ENERGY •
                    COMPETITION WORTHY • CROWD IMPRESS GUARANTEED • 100% STUDIO GRADE • NEON ENERGY •
                </div>
            </div>

            {/* Hero Content */}
            <div className="nhh-hero-content">
                <div className="nhh-text-col">
                    <h1>Premium Neon <br />Dance Curriculum</h1>
                    <p>
                        Master the moves that mesmerize. Competition-ready routines
                        broken down for every level.
                    </p>
                    <button className="nhh-cta-btn">Start Your Journey</button>
                </div>

                <div className="nhh-visual-col">
                    <div className="nhh-glow-backdrop"></div>
                    <div className="nhh-circle-wrapper">
                        <img
                            src="https://via.placeholder.com/400x600/transparent/FFFFFF?text=Dancer+Image"
                            alt="Dancer"
                            className="nhh-dancer-img"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewHeroHeader;

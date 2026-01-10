import React, { useEffect, useRef } from 'react';

const NewHeroHeader = () => {
    const navRef = useRef(null);
    const starsRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const reduceStars = prefersReducedMotion || isSmallScreen || isCoarsePointer;

        // Navbar slide animation on load
        const nav = navRef.current;
        const navLinks = nav?.querySelector('.nhh-nav-links');
        if (nav && !prefersReducedMotion) {
            const links = nav.querySelectorAll('.nhh-nav-links a');
            links.forEach((link, idx) => {
                link.style.animation = `slideInNav 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.08}s both`;
            });
        }

        let navRafId = null;
        const handleNavMove = (event) => {
            if (!nav || !navLinks) return;
            if (navRafId) return;
            const rect = nav.getBoundingClientRect();
            const offset = (event.clientX - rect.left - rect.width / 2) / rect.width;
            const clamped = Math.max(Math.min(offset, 0.35), -0.35);
            navRafId = window.requestAnimationFrame(() => {
                navRafId = null;
                navLinks.style.setProperty('--nav-glide-x', `${(clamped * 18).toFixed(2)}px`);
            });
        };

        const handleNavLeave = () => {
            if (!navLinks) return;
            navLinks.style.setProperty('--nav-glide-x', '0px');
        };

        if (nav && navLinks && !prefersReducedMotion && !isCoarsePointer) {
            nav.addEventListener('pointermove', handleNavMove);
            nav.addEventListener('pointerleave', handleNavLeave);
        }

        // Generate stars
        const starsContainer = starsRef.current;
        if (starsContainer) {
            // Avoid duplicates in React strict mode dev (effect can mount twice)
            starsContainer.innerHTML = '';
            const fragment = document.createDocumentFragment();
            const starCount = reduceStars ? 40 : 80;
            const shootingStarCount = prefersReducedMotion ? 0 : (isSmallScreen ? 1 : 3);

            for (let i = 0; i < starCount; i++) {
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
                fragment.appendChild(star);
            }

            // Shooting stars
            for (let i = 0; i < shootingStarCount; i++) {
                const shootingStar = document.createElement('div');
                shootingStar.className = 'shooting-star';

                shootingStar.style.left = (8 + Math.random() * 84) + '%';
                shootingStar.style.top = (6 + Math.random() * 22) + '%';

                const duration = 14 + Math.random() * 10;
                shootingStar.style.animationDuration = `${duration}s`;
                shootingStar.style.animationDelay = `${Math.random() * duration}s`;
                shootingStar.style.setProperty('--shoot-distance', `${280 + Math.random() * 220}px`);
                shootingStar.style.setProperty('--shoot-angle', `${35 + Math.random() * 20}deg`);

                fragment.appendChild(shootingStar);
            }
            starsContainer.appendChild(fragment);
        }

        return () => {
            if (nav && navLinks && !prefersReducedMotion && !isCoarsePointer) {
                nav.removeEventListener('pointermove', handleNavMove);
                nav.removeEventListener('pointerleave', handleNavLeave);
            }
            if (navRafId) {
                window.cancelAnimationFrame(navRafId);
            }
        };
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
                            loading="lazy"
                            decoding="async"
                            width="400"
                            height="600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewHeroHeader;

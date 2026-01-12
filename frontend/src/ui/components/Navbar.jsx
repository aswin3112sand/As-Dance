import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useRealTimeAnimations } from "../hooks/useRealTimeAnimations.js";
import { Menu, X } from "../icons.jsx";

const NAV_SECTIONS = ["bundle", "services", "preview", "reviews", "contacts"];

export default function Navbar({ activeSection, loaded, isScrolled, isNavHidden }) {
    const { triggerAnimation } = useRealTimeAnimations();
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const navEl = navRef.current;
        if (!navEl) return;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;
        const brand = navEl.querySelector(".brand");
        const links = Array.from(navEl.querySelectorAll(".nav-center .nav-link"));
        const actions = navEl.querySelector(".header-actions");
        const items = [brand, ...links, actions].filter(Boolean);
        if (!items.length) return;

        const tl = gsap.timeline({
            defaults: { duration: 0.6, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
        });
        tl.fromTo(
            items,
            { y: -20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.06, clearProps: "transform" }
        );
        return () => tl.kill();
    }, []);

    // --- NAVBAR HORIZONTAL GLIDE (SCROLL REACTIVE) ---
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const isSaveData = navigator?.connection?.saveData === true;
        if (prefersReducedMotion || isSmallScreen || isCoarsePointer || isSaveData) return;

        const glideTargets = Array.from(document.querySelectorAll(".nav-center, .nhh-nav-links"));
        if (!glideTargets.length) return;

        let lastY = window.scrollY || document.documentElement.scrollTop || 0;
        let rafId = null;
        let resetTimer = null;

        const setShift = (value) => {
            glideTargets.forEach((el) => el.style.setProperty("--nav-glide-x", `${value}px`));
        };

        const onScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                const y = window.scrollY || document.documentElement.scrollTop || 0;
                const dy = y - lastY;
                lastY = y;
                const shift = Math.max(-18, Math.min(18, dy * 0.65));
                setShift(shift);

                if (resetTimer) window.clearTimeout(resetTimer);
                resetTimer = window.setTimeout(() => setShift(0), 140);
            });
        };

        setShift(0);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
            if (resetTimer) window.clearTimeout(resetTimer);
            setShift(0);
        };
    }, []);

    // --- MOBILE MENU ANIMATION ---
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        const menu = mobileMenuRef.current;

        if (mobileMenuOpen) {
            gsap.to(menu, {
                x: '0%',
                duration: 0.5,
                ease: 'power3.out',
                display: 'flex'
            });
            // Stagger links
            gsap.fromTo(menu.querySelectorAll('.mobile-nav-link, .mobile-menu-actions .btn'),
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.08, delay: 0.15, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            gsap.to(menu, {
                x: '100%',
                duration: 0.4,
                ease: 'power3.in',
                display: 'none',
                delay: 0.1 // wait for internal fades if any, or just quick exit
            });
        }
    }, [mobileMenuOpen]);

    return (
        <>
            <nav
                ref={navRef}
                className={`navbar-glass${loaded ? " is-nav-animated" : ""}${isScrolled ? " is-scrolled" : ""}${isNavHidden ? " is-hidden" : ""}`}
            >
                <div className="container-max">
                    <div className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>AS DANCE</div>

                    <div className="nav-center">
                        <a
                            href="#bundle"
                            className={`nav-link${activeSection === "bundle" ? " is-active" : ""}`}
                            aria-current={activeSection === "bundle" ? "location" : undefined}
                        >
                            <span className="nav-label">Bundle</span>
                            <span className="nav-emoji" aria-hidden="true">📦</span>
                        </a>
                        <a
                            href="#services"
                            className={`nav-link${activeSection === "services" ? " is-active" : ""}`}
                            aria-current={activeSection === "services" ? "location" : undefined}
                        >
                            <span className="nav-label">Services</span>
                            <span className="nav-emoji" aria-hidden="true">⚙</span>
                        </a>
                        <a
                            href="#preview"
                            className={`nav-link${activeSection === "preview" ? " is-active" : ""}`}
                            aria-current={activeSection === "preview" ? "location" : undefined}
                        >
                            <span className="nav-label">Preview</span>
                            <span className="nav-emoji" aria-hidden="true">▶</span>
                        </a>
                        <a
                            href="#reviews"
                            className={`nav-link${activeSection === "reviews" ? " is-active" : ""}`}
                            aria-current={activeSection === "reviews" ? "location" : undefined}
                        >
                            <span className="nav-label">Reviews</span>
                            <span className="nav-emoji" aria-hidden="true">⭐</span>
                        </a>
                        <a href="#contacts" className="nav-link">
                            <span className="nav-label">Contacts</span>
                            <span className="nav-emoji" aria-hidden="true">📞✉</span>
                        </a>
                    </div>

                    <div className="header-actions">
                        <Link
                            to="/login"
                            className="btn nav-cta nav-cta-primary d-none d-md-inline-flex"
                            onClick={() => triggerAnimation('pulse', '.nav-cta')}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="btn nav-cta nav-cta-primary d-none d-md-inline-flex"
                            onClick={() => triggerAnimation('glow', '.nav-cta')}
                        >
                            Create Account
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            className="nav-toggle-btn d-md-none"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open Menu"
                        >
                            <Menu size={24} color="#fff" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            <div
                ref={mobileMenuRef}
                className={`mobile-menu-overlay ${mobileMenuOpen ? 'is-open' : ''}`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="mobile-menu-header">
                    <div className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>AS DANCE</div>
                    <button
                        className="nav-close-btn"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close Menu"
                    >
                        <X size={28} color="#fff" />
                    </button>
                </div>
                <div className="mobile-menu-links">
                    {NAV_SECTIONS.map((sec) => (
                        <a
                            key={sec}
                            href={`#${sec}`}
                            className="mobile-nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {sec.charAt(0).toUpperCase() + sec.slice(1)}
                        </a>
                    ))}
                    <div className="mobile-menu-actions">
                        <Link to="/login" className="btn btn-hero btn-cta-primary w-100 mb-3" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="btn btn-hero btn-neon w-100" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

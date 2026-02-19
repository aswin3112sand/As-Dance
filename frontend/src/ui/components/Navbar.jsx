import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "../icons.jsx";

const NAV_SECTIONS = ["about", "services", "preview", "reviews", "contacts"];
const BANNER_POINTS = [
    "Course access INR 499",
    "Custom choreography plans available",
    "Secure checkout and instant confirmation",
    "Digital delivery in 24-48 hours",
    "Preview before you buy",
    "WhatsApp support for quick help"
];

export default function Navbar({ activeSection, loaded, isScrolled }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tickerPaused, setTickerPaused] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname, location.search, location.hash]);

    useEffect(() => {
        const onEscape = (event) => {
            if (event.key === "Escape") {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            window.addEventListener("keydown", onEscape);
        }

        return () => {
            window.removeEventListener("keydown", onEscape);
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 769px)");
        const handleViewportChange = (event) => {
            if (event.matches) {
                setMobileMenuOpen(false);
            }
        };

        if (mq.matches) {
            setMobileMenuOpen(false);
        }

        if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", handleViewportChange);
            return () => mq.removeEventListener("change", handleViewportChange);
        }

        mq.addListener(handleViewportChange);
        return () => mq.removeListener(handleViewportChange);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("mobile-menu-open", mobileMenuOpen);
        return () => {
            document.body.classList.remove("mobile-menu-open");
        };
    }, [mobileMenuOpen]);

    const handleTickerBlur = (event) => {
        const related = event.relatedTarget;
        if (!related || !event.currentTarget.contains(related)) {
            setTickerPaused(false);
        }
    };

    return (
        <>
            <div
                className={`scroll-banner${tickerPaused ? " is-paused" : ""}`}
                aria-label="AS DANCE highlights"
                onMouseEnter={() => setTickerPaused(true)}
                onMouseLeave={() => setTickerPaused(false)}
                onFocusCapture={() => setTickerPaused(true)}
                onBlurCapture={handleTickerBlur}
            >
                <div className="track">
                    {BANNER_POINTS.concat(BANNER_POINTS).map((item, index) => (
                        <span className="scroll-item" key={`${item}-${index}`}>{item}</span>
                    ))}
                </div>
            </div>

            <nav className={`navbar${loaded ? " is-nav-animated" : ""}${isScrolled ? " is-scrolled" : ""}`}>
                <div className="container-max">
                    <Link to="/" className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                        AS DANCE
                    </Link>

                    <div className="nav-center">
                        <a
                            href="#about"
                            className={`nav-link${activeSection === "about" ? " is-active" : ""}`}
                            aria-current={activeSection === "about" ? "location" : undefined}
                        >
                            <span className="nav-label">About</span>
                        </a>
                        <a
                            href="#services"
                            className={`nav-link${activeSection === "services" ? " is-active" : ""}`}
                            aria-current={activeSection === "services" ? "location" : undefined}
                        >
                            <span className="nav-label">Services</span>
                        </a>
                        <a
                            href="#preview"
                            className={`nav-link${activeSection === "preview" ? " is-active" : ""}`}
                            aria-current={activeSection === "preview" ? "location" : undefined}
                        >
                            <span className="nav-label">Preview</span>
                        </a>
                        <a
                            href="#reviews"
                            className={`nav-link${activeSection === "reviews" ? " is-active" : ""}`}
                            aria-current={activeSection === "reviews" ? "location" : undefined}
                        >
                            <span className="nav-label">Reviews</span>
                        </a>
                        <a
                            href="#contacts"
                            className={`nav-link${activeSection === "contacts" ? " is-active" : ""}`}
                            aria-current={activeSection === "contacts" ? "location" : undefined}
                        >
                            <span className="nav-label">Contacts</span>
                        </a>
                    </div>

                    <div className="header-actions">
                        <Link to="/login" className="btn btn--ghost nav-cta nav-action-link">
                            <span className="cta-text">Login</span>
                        </Link>
                        <Link to="/register" className="btn btn--primary nav-cta nav-action-link">
                            <span className="cta-text">Create Account</span>
                        </Link>

                        <button
                            className="nav-toggle-btn"
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open Menu"
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu-overlay"
                        >
                            <Menu size={24} color="#fff" />
                        </button>
                    </div>
                </div>
            </nav>

            <div
                id="mobile-menu-overlay"
                className={`mobile-menu-overlay ${mobileMenuOpen ? "is-open" : ""}`}
                aria-hidden={!mobileMenuOpen}
                role="dialog"
                aria-modal="true"
            >
                <div className="mobile-menu-header">
                    <Link
                        to="/"
                        className="brand fs-4 text-white fw-bold tracking-wider"
                        style={{ fontFamily: "var(--font-display)" }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        AS DANCE
                    </Link>
                    <button
                        className="nav-close-btn"
                        type="button"
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
                            className={`mobile-nav-link${activeSection === sec ? " is-active" : ""}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {sec.charAt(0).toUpperCase() + sec.slice(1)}
                        </a>
                    ))}
                    <div className="mobile-menu-actions">
                        <Link to="/login" className="btn btn-outline-light w-100 mb-3" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="btn btn-hero btn-cta-primary w-100" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

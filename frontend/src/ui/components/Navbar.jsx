import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "../icons.jsx";

const NAV_SECTIONS = ["bundle", "services", "preview", "reviews", "contacts"];
const BANNER_POINTS = [
    "639-Step Premium Neon Dance System",
    "Stage-Ready Performance Training",
    "Competition-Level Choreography",
    "Power + Flow + Expression Mastery",
    "Beginner to Pro Structured Path",
    "Crowd-Impact Guarantee"
];

export default function Navbar({ activeSection, loaded, isScrolled }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="scroll-banner" aria-label="AS DANCE premium highlights">
                <div className="track">
                    {BANNER_POINTS.concat(BANNER_POINTS).map((item, index) => (
                        <span className="scroll-item" key={`${item}-${index}`}>{item}</span>
                    ))}
                </div>
            </div>
            <nav
                className={`navbar${loaded ? " is-nav-animated" : ""}${isScrolled ? " is-scrolled" : ""}`}
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
                            className="btn btn--ghost nav-cta d-none d-md-inline-flex"
                        >
                            <span className="cta-icon" aria-hidden="true">🔐</span>
                            <span className="cta-text">Login</span>
                        </Link>
                        <Link
                            to="/register"
                            className="btn btn--primary nav-cta d-none d-md-inline-flex"
                        >
                            <span className="cta-icon" aria-hidden="true">✨</span>
                            <span className="cta-text">Create Account</span>
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


            </nav >

            {/* MOBILE MENU OVERLAY */}
            <div
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
            </div >
        </>
    );
}

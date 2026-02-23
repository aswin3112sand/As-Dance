import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "../icons.jsx";

const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "preview", label: "Preview" },
  { id: "reviews", label: "Reviews" },
  { id: "contacts", label: "Contact" },
];

export default function Navbar({ activeSection, loaded, isScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileMenuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`navbar${loaded ? " is-nav-animated" : ""}${isScrolled ? " is-scrolled" : ""}`}>
        <div className="container-max">
          <Link to="/" className="brand fs-4 text-white fw-bold tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
            AS DANCE
          </Link>

          <div className="nav-center">
            {NAV_SECTIONS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link${activeSection === item.id ? " is-active" : ""}`}
                aria-current={activeSection === item.id ? "location" : undefined}
              >
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="header-actions">
            <Link to="/login" className="nav-login-link nav-action-link">
              Login
            </Link>
            <Link to="/register" className="btn nav-cta nav-access-btn nav-action-link">
              <span className="cta-text">Get Access</span>
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
          {NAV_SECTIONS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`mobile-nav-link${activeSection === item.id ? " is-active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mobile-menu-actions">
            <Link to="/login" className="btn btn-outline-light w-100 mb-3" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="btn btn-hero btn-cta-primary w-100" onClick={() => setMobileMenuOpen(false)}>
              Get Access
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

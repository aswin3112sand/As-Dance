import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Sparkles, X } from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import Button from "./Button.jsx";

const DEFAULT_LINKS = [
  { key: "home", label: "Home", to: "/" },
  { key: "preview", label: "639 Bundle", to: "/preview" },
  { key: "services", label: "Custom Choreo", to: "/services" },
];

const DEFAULT_WHATSAPP_LINK =
  "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20free%20style-check%20preview%20venum%20before%20the%20INR%20499%20bundle.";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

function NavLinkItem({ item, activeKey, onClick }) {
  const isActive = item.key && item.key === activeKey;
  const classes = joinClasses("site-nav__link", isActive ? "is-active" : "");

  if (item.to) {
    return (
      <Link to={item.to} className={classes} onClick={onClick} aria-current={isActive ? "page" : undefined}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} className={classes} onClick={onClick} aria-current={isActive ? "location" : undefined}>
      {item.label}
    </a>
  );
}

export default function Navbar({
  links = DEFAULT_LINKS,
  activeKey = "",
  isScrolled = false,
  ctaLabel = "Free WhatsApp Preview",
  ctaHref = DEFAULT_WHATSAPP_LINK,
  ctaTo = "",
  secondaryLabel = "",
  secondaryTo = "",
  secondaryHref = "",
}) {
  const location = useLocation();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const utilityLink = useMemo(() => {
    if (secondaryLabel) {
      return secondaryTo
        ? { label: secondaryLabel, to: secondaryTo }
        : { label: secondaryLabel, href: secondaryHref };
    }

    if (user) {
      return { label: "Dashboard", to: "/dashboard" };
    }

    return { label: "Login", to: "/login" };
  }, [secondaryHref, secondaryLabel, secondaryTo, user]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", onEscape);
      document.body.classList.add("mobile-menu-open");
    }

    return () => {
      window.removeEventListener("keydown", onEscape);
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="site-header">
        <nav className={joinClasses("site-nav", isScrolled ? "is-scrolled" : "")} aria-label="Primary">
          <div className="site-nav__inner">
            <Link to="/" className="site-brand" aria-label="AS Dance home">
              <span className="site-brand__mark">
                <Sparkles size={16} aria-hidden="true" />
              </span>
              <span>AS Dance</span>
            </Link>

            <div className="site-nav__links">
              {links.map((item) => (
                <NavLinkItem key={item.key || item.label} item={item} activeKey={activeKey} />
              ))}
            </div>

            <div className="site-nav__actions">
              {utilityLink.to ? (
                <Button to={utilityLink.to} variant="ghost" className="site-nav__desktop-link">
                  {utilityLink.label}
                </Button>
              ) : (
                <Button
                  href={utilityLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  className="site-nav__desktop-link"
                >
                  {utilityLink.label}
                </Button>
              )}

              {ctaTo ? (
                <Button to={ctaTo}>{ctaLabel}</Button>
              ) : (
                <Button href={ctaHref} target={ctaHref?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {ctaLabel}
                </Button>
              )}

              <button
                className="site-nav__toggle"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-controls="site-nav-drawer"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        id="site-nav-drawer"
        className={joinClasses("site-nav__drawer", mobileMenuOpen ? "is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="site-nav__drawer-panel">
          <div className="site-nav__drawer-header">
            <span className="site-brand">
              <span className="site-brand__mark">
                <Sparkles size={16} aria-hidden="true" />
              </span>
              <span>AS Dance</span>
            </span>
            <button
              type="button"
              className="site-nav__close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="site-nav__drawer-links">
            {links.map((item) => (
              <NavLinkItem
                key={`drawer-${item.key || item.label}`}
                item={item}
                activeKey={activeKey}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
            <NavLinkItem
              item={utilityLink}
              activeKey={activeKey}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          <div className="button-row" style={{ marginTop: "1rem" }}>
            {ctaTo ? (
              <Button to={ctaTo} className="w-full" onClick={() => setMobileMenuOpen(false)}>
                {ctaLabel}
              </Button>
            ) : (
              <Button
                href={ctaHref}
                target={ctaHref?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

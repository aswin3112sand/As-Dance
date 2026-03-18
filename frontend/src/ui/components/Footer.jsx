import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, PhoneCall, ShieldCheck, WhatsApp } from "../icons.jsx";

const SUPPORT_LINK = "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20I%20need%20help.";

function Footer() {
  return (
    <footer id="contacts" className="site-footer">
      <div className="container-max">
        <div className="glass-card glass-card--gold site-footer__inner">
          <div className="site-footer__grid">
            <section className="site-footer__group">
              <h3>AS Dance</h3>
              <p className="muted">
                639-step mastery training for beginners, reels, culturals, and wedding-ready performers. Start with a
                free style check, unlock the INR 499 bundle, or request tiered custom choreography.
              </p>
              <span className="chip chip--gold">
                <ShieldCheck size={14} aria-hidden="true" />
                Preview first, one-time unlock, human support
              </span>
            </section>

            <section className="site-footer__group">
              <h4>Navigate</h4>
              <div className="site-footer__links">
                <Link to="/">Home</Link>
                <Link to="/preview">639 Bundle</Link>
                <Link to="/services">Custom Choreo Tiers</Link>
                <Link to="/dashboard">Student Dashboard</Link>
              </div>
            </section>

            <section className="site-footer__group">
              <h4>Contact and policy</h4>
              <div className="site-footer__links">
                <a href={SUPPORT_LINK} target="_blank" rel="noopener noreferrer">
                  <WhatsApp size={14} aria-hidden="true" /> WhatsApp preview + quote help
                </a>
                <a href="mailto:businessaswin@gmail.com">
                  <Mail size={14} aria-hidden="true" /> businessaswin@gmail.com
                </a>
                <span>
                  <PhoneCall size={14} aria-hidden="true" /> Replies within 24 hours
                </span>
                <span>Bundle refund applies only if access is not delivered.</span>
              </div>
            </section>
          </div>

          <div className="site-footer__bottom">
            <span>&copy; {new Date().getFullYear()} AS Dance. Music used only for demo, practice, and choreography reference.</span>
            <a href={SUPPORT_LINK} target="_blank" rel="noopener noreferrer" className="chip">
              Need preview or quote
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);

import React, { memo } from "react";
import { WhatsApp, Mail, ShieldCheck, Infinity, Zap, Headphones, PhoneCall } from "../icons.jsx";

function Footer() {
  return (
    <footer className="site-footer section-anim bg-contact" id="contacts">
      <div className="container-max footer-grid">
        <div className="footer-col footer-brand">
          <div className="footer-title">AS DANCE - 639-Step Practical Dance Course</div>
          <p className="footer-copy">
            Ithu live online class illa. Recorded practical dance step library.
            INR 499 payment apram dashboard + Google Drive access available.
          </p>
          <div className="footer-icons">
            <a href="https://wa.me/918825602356" target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="WhatsApp">
              <WhatsApp size={18} color="#fff" />
            </a>
            <a href="mailto:businessaswin@gmail.com" className="footer-icon" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Contact Us</div>
          <div className="footer-list footer-contact">
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>Email: businessaswin@gmail.com</span>
            </div>
            <div className="footer-contact-item">
              <PhoneCall size={16} />
              <span>Phone: +91 88256 02356</span>
            </div>
            <div className="footer-contact-item">WhatsApp response: usually within a few hours</div>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Delivery and Refund Policy</div>
          <div className="footer-list">
            <span>Payment success apram dashboard page open aagum.</span>
            <span>Google Drive moolama 639 practical steps access.</span>
            <span>Support on WhatsApp for onboarding and doubts.</span>
            <span>Refund applies only if access is not delivered.</span>
            <span>After access delivery, digital sale is final.</span>
          </div>
        </div>
      </div>

      <div className="footer-divider" aria-hidden="true"></div>
      <div className="footer-trust">
        <div className="footer-trust-item">
          <ShieldCheck size={16} />
          Secure Payment
        </div>
        <div className="footer-trust-item">
          <Infinity size={16} />
          Learn at your pace
        </div>
        <div className="footer-trust-item">
          <Zap size={16} />
          Fast onboarding
        </div>
        <div className="footer-trust-item">
          <Headphones size={16} />
          WhatsApp support
        </div>
      </div>

      <div className="footer-signature">Aswin - AS DANCE Creator</div>
    </footer>
  );
}

export default memo(Footer);

import React from 'react';
import { WhatsApp, Mail, ShieldCheck, Infinity, Zap, Headphones, PhoneCall } from "../icons.jsx";

export default function Footer() {
    return (
        <footer className="site-footer section-anim bg-contact" id="contacts">
            <div className="container-max footer-grid">
                <div className="footer-col footer-brand">
                    <div className="footer-title">AS DANCE — 639-Step Premium Curriculum</div>
                    <p className="footer-copy">
                        Fast skill progression for students, fitness dancers, wedding choreo learners, and stage performers.
                    </p>
                    <div className="footer-icons">
                        <a href="https://wa.me/918825602356" target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="WhatsApp">
                            <WhatsApp size={18} color="#fff" />
                        </a>
                        <a href="mailto:bussinessaswin@gmail.com" className="footer-icon" aria-label="Email">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>
                <div className="footer-col">
                    <div className="footer-title">Contact</div>
                    <div className="footer-list footer-contact">
                        <div className="footer-contact-item">
                            <Mail size={16} />
                            <span>Email: bussinessaswin@gmail.com</span>
                        </div>
                        <div className="footer-contact-item">
                            <PhoneCall size={16} />
                            <span>Phone: +91 88256 02356</span>
                        </div>
                        <div className="footer-contact-item">Song Used: "Dance Dhoom Mix 2025"</div>
                        <div className="footer-contact-item">Beat Sync: Always Matching Step For Beaat</div>
                    </div>
                </div>
                <div className="footer-col">
                    <div className="footer-title">Support</div>
                    <div className="footer-list">
                        <span>Secure Payment</span>
                        <span>Lifetime Access</span>
                        <span>Instant Unlock</span>
                        <span>24/7 Support</span>
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
                    Lifetime Access
                </div>
                <div className="footer-trust-item">
                    <Zap size={16} />
                    Instant Unlock
                </div>
                <div className="footer-trust-item">
                    <Headphones size={16} />
                    24/7 Support
                </div>
            </div>
            <div className="footer-signature">
                Aswin —  AS DANCE Creator
            </div>
        </footer>
    );
}

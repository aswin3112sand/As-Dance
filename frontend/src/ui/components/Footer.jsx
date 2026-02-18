import React, { memo } from 'react';
import { WhatsApp, Mail, ShieldCheck, Infinity, Zap, Headphones, PhoneCall } from "../icons.jsx";

function Footer() {
    return (
        <footer className="site-footer section-anim bg-contact" id="contacts">
            <div className="container-max footer-grid">
                <div className="footer-col footer-brand">
                    <div className="footer-title">AS DANCE - Online Dance Training and Customized Choreography</div>
                    <p className="footer-copy">
                        An online service delivering customized choreography with original dance steps, plus online dance training
                        for every level. We do not sell copyrighted songs or third-party digital products.
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
                        <div className="footer-contact-item">Response time: within 24-48 hours</div>
                    </div>
                </div>
                <div className="footer-col">
                    <div className="footer-title">Delivery Method & Refund Policy</div>
                    <div className="footer-list">
                        <span>Delivery within 24-48 hours after payment.</span>
                        <span>Access via Google Drive or private online access.</span>
                        <span>Refunds apply only if access is not delivered.</span>
                        <span>No refunds after access is provided.</span>
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
                    Course Access
                </div>
                <div className="footer-trust-item">
                    <Zap size={16} />
                    Delivery 24-48 hours
                </div>
                <div className="footer-trust-item">
                    <Headphones size={16} />
                    Support
                </div>
            </div>
            <div className="footer-signature">
                Aswin —  AS DANCE Creator
            </div>
        </footer>
    );
}

export default memo(Footer);

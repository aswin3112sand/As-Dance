import React from "react";
import { useNavigate } from "react-router-dom";
import { WhatsApp, Mail } from "../icons.jsx";
import { useAuth } from "../auth.jsx";

export default function PaymentSection() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const handleCheckout = () => {
    if (loading) return;
    if (user) {
      nav("/checkout");
      return;
    }
    nav("/login", { state: { from: "/checkout" } });
  };

  return (
    <section className="section section-compact bg-payment section-anim" id="payment">
      <div className="container-max">
        <div className="payment-card card-3d card-float card-anim">
          <div className="payment-header">
            <div className="payment-title">AS DANCE 639-Step Bundle</div>
            <div className="payment-subtitle">₹499 Only • One-Time Payment • Lifetime Access</div>
            <div className="payment-subtitle">Instant Unlock After Payment</div>
          </div>

          <div className="payment-icons">
            <span className="payment-chip">
              <WhatsApp size={16} />
              WhatsApp Support
            </span>
            <span className="payment-chip">
              <Mail size={16} />
              Email Receipt
            </span>
          </div>

          <div className="payment-actions">
            <button
              type="button"
              className="btn btn-cta btn-hero btn-cta-primary payment-cta"
              onClick={handleCheckout}
              disabled={loading}
            >
              UNLOCK 639-STEP BUNDLE FOR ₹499
            </button>
          </div>

          <div className="payment-note">
            Video opens instantly in Google Drive after payment
          </div>
          <div className="payment-note">
            Email receipt will be sent automatically
          </div>
        </div>
      </div>
    </section>
  );
}

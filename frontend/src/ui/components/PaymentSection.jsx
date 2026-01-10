import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import profileImage from "../../assets/bg/poster.webp";

export default function PaymentSection() {
  const { user } = useAuth();
  const nav = useNavigate();
  const displayName = user?.fullName || user?.email?.split("@")[0] || "AS DANCE Learner";

  const handleCheckout = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      nav("/login", { state: { from: target } });
      return;
    }
    nav(target);
  };

  return (
    <section className="section section-compact bg-payment section-anim" id="payment">
      <div className="container-max">
        <div className="payment-card payment-card-modern card-3d card-anim">
          <div className="payment-profile">
            <div className="payment-avatar-frame">
              <img
                src={profileImage}
                alt={`${displayName} profile`}
                className="payment-avatar"
                loading="lazy"
                decoding="async"
                width="100"
                height="100"
              />
            </div>
            <div className="payment-user">{displayName}</div>
            <div className="payment-plan">639-Step Stage-Ready Bundle</div>
            <div className="payment-price">₹499</div>
          </div>

          <div className="payment-form">
            <label className="payment-label" htmlFor="card-number">Card Number</label>
            <div className="payment-input-wrap">
              <CreditCard size={16} />
              <input
                id="card-number"
                className="payment-input"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                aria-label="Card number"
              />
            </div>

            <div className="payment-row">
              <div className="payment-field">
                <label className="payment-label" htmlFor="card-exp">Expiry</label>
                <div className="payment-input-wrap">
                  <input
                    id="card-exp"
                    className="payment-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    aria-label="Expiry date"
                  />
                </div>
              </div>
              <div className="payment-field">
                <label className="payment-label" htmlFor="card-cvv">CVV</label>
                <div className="payment-input-wrap">
                  <input
                    id="card-cvv"
                    className="payment-input"
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="***"
                    aria-label="CVV"
                  />
                </div>
              </div>
            </div>

            <div className="payment-methods" aria-label="Payment methods">
              <span className="payment-method payment-visa">VISA</span>
              <span className="payment-method payment-master">MASTERCARD</span>
              <span className="payment-method payment-upi">UPI</span>
            </div>

            <button
              id="payBtn"
              type="button"
              className="buy-now-btn"
              onClick={handleCheckout}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { loadFailure } from "../paymentStorage.js";

export default function PaymentFailed() {
  const { user } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const state = loc.state || {};
  const storedFailure = loadFailure(user?.id);
  const reason = state.reason || storedFailure?.reason || "Payment failed or was cancelled.";

  const handleRetry = () => {
    nav("/checkout?pay=1");
  };

  return (
    <section className="section payment-result-page">
      <div className="container-max">
        <div className="payment-result-card card-glass">
          <div className="payment-result-icon is-failed" aria-hidden="true">!</div>
          <h1 className="payment-result-title">Payment Failed</h1>
          <p className="payment-result-subtitle">{reason}</p>

          <div className="payment-result-actions">
            <button className="btn btn-cta btn-hero btn-cta-primary" type="button" onClick={handleRetry}>
              Retry Payment
            </button>
            <Link className="btn btn-outline-light" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

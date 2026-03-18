import React from "react";
import { AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { loadFailure } from "../paymentStorage.js";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";

export default function PaymentFailed() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const storedFailure = loadFailure(user?.id);
  const reason = state.reason || storedFailure?.reason || "Payment failed or was cancelled.";

  return (
    <MainLayout
      navProps={{
        links: [
          { key: "checkout", label: "Checkout", to: "/checkout?pay=1" },
          { key: "home", label: "Home", to: "/" },
        ],
        ctaLabel: "Retry payment",
        ctaTo: "/checkout?pay=1",
      }}
    >
      <section className="section-shell">
        <div className="container-max">
          <div className="result-shell">
            <GlassCard className="result-card" accent="red">
              <div className="result-icon result-icon--failed">
                <AlertCircle size={24} aria-hidden="true" />
              </div>
              <h1>Payment failed</h1>
              <p className="muted">{reason}</p>

              <div className="button-row" style={{ marginTop: "1.5rem" }}>
                <Button type="button" onClick={() => navigate("/checkout?pay=1")}>
                  Retry payment
                </Button>
                <Button to="/" variant="secondary">
                  Back to Home
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

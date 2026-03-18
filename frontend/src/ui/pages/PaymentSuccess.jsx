import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown, ShieldCheck } from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import { apiFetch } from "../api.js";
import { loadReceipt } from "../paymentStorage.js";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";

const formatAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "INR 499";
  return `INR ${Math.round(amount / 100)}`;
};

export default function PaymentSuccess() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state || {};
  const storedReceipt = useMemo(() => loadReceipt(user?.id), [user?.id]);
  const orderId = state.orderId || storedReceipt?.orderId || "";
  const paymentId = state.paymentId || storedReceipt?.paymentId || "";
  const amount = formatAmount(
    state.amountPaise ?? state.amount ?? storedReceipt?.amountPaise ?? storedReceipt?.amount
  );
  const googleDriveUrl = state.googleDriveUrl || storedReceipt?.googleDriveUrl || "";
  const paidAt = state.paidAt || storedReceipt?.paidAt || null;
  const [status, setStatus] = useState(null);
  const resolvedGoogleDriveUrl = googleDriveUrl || status?.unlockedVideoUrl || "";

  useEffect(() => {
    let active = true;

    async function verifyStatus() {
      try {
        const res = await apiFetch("/api/payment/status");
        const data = await res.json().catch(() => null);
        if (!active) return;
        setStatus(data && res.ok ? data : { unlocked: false });
      } catch {
        if (active) setStatus({ unlocked: false });
      }
    }

    verifyStatus();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (resolvedGoogleDriveUrl && status?.unlocked !== false) {
      const timer = window.setTimeout(() => {
        const opened = window.open(resolvedGoogleDriveUrl, "_blank", "noopener,noreferrer");
        if (!opened) {
          window.location.href = resolvedGoogleDriveUrl;
        }
      }, 2000);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [resolvedGoogleDriveUrl, status?.unlocked]);

  const paidAtLabel = paidAt ? new Date(paidAt).toLocaleString() : "";
  const showVerifyWarning = status && !status.unlocked;

  return (
    <MainLayout
      navProps={{
        links: [
          { key: "dashboard", label: "Dashboard", to: "/dashboard" },
          { key: "home", label: "Home", to: "/" },
        ],
        ctaLabel: "Go to Dashboard",
        ctaTo: "/dashboard",
      }}
    >
      <section className="section-shell">
        <div className="container-max">
          <div className="result-shell">
            <GlassCard className="result-card" accent="gold">
              <div className="result-icon">
                <ShieldCheck size={24} aria-hidden="true" />
              </div>
              <h1>Payment successful</h1>
              <p className="muted">
                Payment confirmed. Dashboard opens with your 639-step course access.
              </p>

              <div className="payment-meta" style={{ marginTop: "1.2rem" }}>
                <div className="meta-row">
                  <span>Amount</span>
                  <strong>{amount}</strong>
                </div>
                {orderId ? (
                  <div className="meta-row">
                    <span>Order ID</span>
                    <strong>{orderId}</strong>
                  </div>
                ) : null}
                {paymentId ? (
                  <div className="meta-row">
                    <span>Payment ID</span>
                    <strong>{paymentId}</strong>
                  </div>
                ) : null}
                {paidAtLabel ? (
                  <div className="meta-row">
                    <span>Paid at</span>
                    <strong>{paidAtLabel}</strong>
                  </div>
                ) : null}
              </div>

              <div className="button-row" style={{ marginTop: "1.5rem" }}>
                {resolvedGoogleDriveUrl ? (
                  <Button href={resolvedGoogleDriveUrl}>
                    Open 639-step access
                  </Button>
                ) : null}
                <Button to="/dashboard" variant="secondary">
                  Go to Dashboard
                </Button>
                <Button to="/" variant="ghost">
                  Back to Home
                </Button>
              </div>

              {resolvedGoogleDriveUrl && status?.unlocked !== false ? (
                <p className="inline-note" style={{ marginTop: "1rem" }}>
                  Access link available na adhu 2 seconds-la open aagum.
                </p>
              ) : null}

              {showVerifyWarning ? (
                <div className="message-pill" role="alert" style={{ marginTop: "1rem" }}>
                  Payment verify issue irundha dashboard check pannunga illa WhatsApp support contact pannunga.
                </div>
              ) : null}
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

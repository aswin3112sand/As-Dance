import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { apiFetch } from "../api.js";
import { loadReceipt } from "../paymentStorage.js";

const formatAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "₹499";
  return `₹${Math.round(amount / 100)}`;
};

export default function PaymentSuccess() {
  const { user } = useAuth();
  const loc = useLocation();
  const state = loc.state || {};
  const storedReceipt = useMemo(() => loadReceipt(user?.id), [user?.id]);
  const orderId = state.orderId || storedReceipt?.orderId || "";
  const paymentId = state.paymentId || storedReceipt?.paymentId || "";
  const amount = formatAmount(
    state.amountPaise ?? state.amount ?? storedReceipt?.amountPaise ?? storedReceipt?.amount
  );
  const googleDriveUrl = state.googleDriveUrl || storedReceipt?.googleDriveUrl || "";
  const paidAt = state.paidAt || storedReceipt?.paidAt || null;
  const [status, setStatus] = useState(null);

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
    if (googleDriveUrl && status?.unlocked !== false) {
      const timer = setTimeout(() => {
        window.location.href = googleDriveUrl;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [googleDriveUrl, status?.unlocked]);

  const paidAtLabel = paidAt ? new Date(paidAt).toLocaleString() : "";
  const showVerifyWarning = status && !status.unlocked;

  return (
    <section className="section payment-result-page">
      <div className="container-max">
        <div className="payment-result-card card-glass">
          <div className="payment-result-icon is-success" aria-hidden="true">OK</div>
          <h1 className="payment-result-title">Payment Successful</h1>
          <p className="payment-result-subtitle">
            Your 639-step bundle is unlocked. Thank you for the purchase.
          </p>

          <div className="payment-result-meta">
            <div><span>Amount:</span> {amount}</div>
            {orderId && <div><span>Order ID:</span> {orderId}</div>}
            {paymentId && <div><span>Payment ID:</span> {paymentId}</div>}
            {paidAtLabel && <div><span>Paid:</span> {paidAtLabel}</div>}
          </div>

          <div className="payment-result-actions">
            {googleDriveUrl && (
              <a href={googleDriveUrl} className="btn btn-cta btn-hero btn-cta-primary">
                Access Google Drive Folder
              </a>
            )}
            <Link className="btn btn-cta btn-hero btn-cta-primary" to="/dashboard">
              Go to Dashboard
            </Link>
            <Link className="btn btn-outline-light" to="/">
              Back to Home
            </Link>
          </div>
          {googleDriveUrl && status?.unlocked !== false && (
            <p className="payment-result-subtitle" style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              Redirecting to Google Drive in 2 seconds...
            </p>
          )}
          {showVerifyWarning && (
            <p className="payment-result-subtitle" role="alert" style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              We could not verify your payment on refresh. Please check your dashboard or contact support.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

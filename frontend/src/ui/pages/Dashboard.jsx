import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { apiFetch } from "../api.js";
import accessPreview from "../../assets/bg/DanceTut.webp";
import accountPreview from "../../assets/bg/Ayan.webp";
import routinePreview from "../../assets/bg/Jeyam2.webp";

export default function Dashboard() {
  const { user, refresh, logout } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    async function loadStatus() {
      const res = await apiFetch("/api/payment/status");
      const data = await res.json().catch(() => ({}));
      setStatus(data);
    }
    loadStatus();
  }, []);

  const unlocked = status?.unlocked || user?.unlocked;
  const unlockedUrl = status?.unlockedVideoUrl || "";
  const statusLine = unlocked
    ? "✔ 639 Steps Unlocked – Lifetime Access"
    : "🔒 639 Bundle Locked – Unlock for ₹499";

  const openVideo = () => {
    apiFetch("/api/payment/downloaded", { method: "POST" }).catch(() => {});
    const url = unlockedUrl || "https://drive.google.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const scrollToRoutines = () => {
    const el = document.getElementById("my-routines");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="section dashboard-page">
      <div className="container-max">
        <div className="dashboard-header">
          <div>
            <div className="brand">AS DANCE</div>
            <div className="subtle small">Dashboard</div>
          </div>
          {user?.email && <div className="dashboard-email subtle small">{user.email}</div>}
        </div>

        {user && (
          <div className="dashboard-nav" role="navigation" aria-label="Dashboard actions">
            <button className="btn btn-neon btn-neo" onClick={() => nav("/checkout")}>
              Get Bundle @ ₹499
            </button>
            <button className="btn btn-ghost btn-neo" onClick={scrollToRoutines}>
              My Routines
            </button>
            <a className="btn btn-ghost btn-neo" href="https://wa.me/918825602356" target="_blank" rel="noreferrer">
              Support
            </a>
            <button className="btn btn-ghost btn-neo" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="card-glass dashboard-card">
            <div className="dashboard-card-media">
              <img
                src={accessPreview}
                alt="Access preview"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              />
            </div>
            <div className="status-label">Access</div>
            <div className={`status-pill ${unlocked ? "is-unlocked" : ""}`}>
              {unlocked ? "Unlocked" : "Locked"}
            </div>
            <div className="status-message">{statusLine}</div>
            <div className="dashboard-actions">
              {unlocked ? (
                <button className="btn btn-cta btn-neo" onClick={openVideo}>
                  Preview
                </button>
              ) : (
                <div className="subtle small">Unlock access using the Get Bundle button above.</div>
              )}
            </div>
          </div>

          <div className="card-glass dashboard-card">
            <div className="dashboard-card-media">
              <img
                src={accountPreview}
                alt="Account preview"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              />
            </div>
            <div className="status-label">Account</div>
            <h2 className="text-section">Welcome back.</h2>
            <p className="text-body subtle">Signed in as {user?.email || "Guest"}</p>
            <div className="dashboard-metrics">
              <div className="metric-item">
                <span className="metric-label">Bundle</span>
                <span className="metric-value">{unlocked ? "Lifetime Access" : "Locked"}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Steps</span>
                <span className="metric-value">639 Total</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Support</span>
                <span className="metric-value">Priority Help</span>
              </div>
            </div>
          </div>

          <div className="card-glass dashboard-card" id="my-routines">
            <div className="dashboard-card-media">
              <img
                src={routinePreview}
                alt="My routines preview"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              />
            </div>
            <div className="status-label">My Routines</div>
            <p className="text-body subtle">Your routine library appears here once unlocked.</p>
            <div className="routine-pills">
              <span className="pill">Easy</span>
              <span className="pill">Medium</span>
              <span className="pill">Hard</span>
            </div>
            <div className="subtle small">Lifetime updates included.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

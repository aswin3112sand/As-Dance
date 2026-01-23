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
    ? "Course access active - check your delivery link."
    : "Course access locked - complete payment.";

  const openVideo = () => {
    apiFetch("/api/payment/downloaded", { method: "POST" }).catch(() => {});
    const url = unlockedUrl || "https://drive.google.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLogout = async () => {
    await logout();
    nav("/", { replace: true });
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
            <button className="btn btn-neon btn-neo" onClick={() => nav("/checkout?pay=1")}>
              Get Course Access
            </button>
            <button className="btn btn-ghost btn-neo" onClick={scrollToRoutines}>
              My Training
            </button>
            <a className="btn btn-ghost btn-neo" href="https://wa.me/918825602356" target="_blank" rel="noopener noreferrer">
              Support
            </a>
            <button className="btn btn-ghost btn-neo" onClick={handleLogout}>
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
            <div className="status-label">Course Access</div>
            <div className={`status-pill ${unlocked ? "is-unlocked" : ""}`}>
              {unlocked ? "Unlocked" : "Locked"}
            </div>
            <div className="status-message">{statusLine}</div>
            <div className="dashboard-actions">
              {unlocked ? (
                <button className="btn btn-cta btn-neo" onClick={openVideo}>
                  Open Access
                </button>
              ) : (
                <div className="subtle small">Unlock access using the Get Course Access button above.</div>
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
                <span className="metric-label">Course Access</span>
                <span className="metric-value">{unlocked ? "Active" : "Locked"}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Training</span>
                <span className="metric-value">Guided videos</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Support</span>
                <span className="metric-value">Email + WhatsApp</span>
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
            <div className="status-label">My Training</div>
            <p className="text-body subtle">Your routine library appears here once unlocked.</p>
            <div className="routine-pills">
              <span className="pill">Beginner</span>
              <span className="pill">Intermediate</span>
              <span className="pill">Advanced</span>
            </div>
            <div className="subtle small">Updates included with active access.</div>
          </div>
        </div>
      </div>
    </div>
  );
}



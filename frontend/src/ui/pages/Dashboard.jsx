import React, { useEffect, useState } from "react";
import { Crown, Mail, ShieldCheck, Trophy, Users, WhatsApp } from "../icons.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { apiFetch } from "../api.js";
import accessPreview from "../../assets/bg/DanceTut.webp";
import accountPreview from "../../assets/bg/Ayan.webp";
import routinePreview from "../../assets/bg/Jeyam2.webp";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Dashboard() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
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

  const openVideo = () => {
    apiFetch("/api/payment/downloaded", { method: "POST" }).catch(() => {});
    const url = unlockedUrl || "https://drive.google.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <MainLayout
      navProps={{
        links: [
          { key: "home", label: "Home", to: "/" },
          { key: "services", label: "Services", to: "/services" },
          { key: "preview", label: "Preview", to: "/preview" },
        ],
        ctaLabel: unlocked ? "Open 639 steps" : "Unlock course",
        ctaTo: unlocked ? "/dashboard" : "/checkout?pay=1",
      }}
    >
      <section className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="page-topbar">
            <div>
              <span className={`status-badge ${unlocked ? "status-badge--emerald" : "status-badge--gold"}`}>
                {unlocked ? "Unlocked" : "Locked"}
              </span>
              <h1 style={{ margin: "1rem 0 0.5rem", fontFamily: "var(--font-family-display)", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                Welcome back to AS Dance.
              </h1>
              <p className="muted" style={{ margin: 0 }}>
                Signed in as {user?.email || "Guest"}. Keep the dashboard clear, useful, and premium.
              </p>
            </div>

            <div className="action-cluster">
              <Button type="button" variant="secondary" onClick={() => navigate("/checkout?pay=1")}>
                Unlock 639 Steps
              </Button>
              <Button href="https://wa.me/918825602356" target="_blank" rel="noopener noreferrer" variant="ghost">
                Support
              </Button>
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          <SectionHeader
            eyebrow="Dashboard status"
            title="One place for course access, support, and next actions."
            description="A premium dashboard should reduce confusion after payment and keep important actions visible."
          />

          <div className="dashboard-grid">
            <Reveal>
              <GlassCard className="dashboard-card" accent="gold">
                <div className="media-panel" style={{ minHeight: "14rem" }}>
                  <img src={accessPreview} alt="Course access preview" loading="lazy" decoding="async" width="640" height="360" />
                  <div className="media-panel__copy">
                    <span className="chip chip--gold">Course access</span>
                  </div>
                </div>
                <strong className="stat-number">{unlocked ? "Unlocked" : "Locked"}</strong>
                <p style={{ margin: 0 }}>
                  {unlocked
                    ? "Your 639-step course is unlocked. Open the delivery link any time."
                    : "Complete INR 499 payment to unlock the full 639-step learning path."}
                </p>
                <div className="button-row">
                  {unlocked ? (
                    <Button type="button" onClick={openVideo}>
                      Open 639 Steps
                    </Button>
                  ) : (
                    <Button to="/checkout?pay=1">Go to checkout</Button>
                  )}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.05}>
              <GlassCard className="dashboard-card">
                <div className="media-panel" style={{ minHeight: "14rem" }}>
                  <img src={accountPreview} alt="Account summary preview" loading="lazy" decoding="async" width="640" height="360" />
                  <div className="media-panel__copy">
                    <span className="chip">Account and support</span>
                  </div>
                </div>
                <div className="summary-list">
                  <div className="summary-row">
                    <span>Account email</span>
                    <strong>{user?.email || "Guest"}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Support path</span>
                    <strong>Email + WhatsApp</strong>
                  </div>
                  <div className="summary-row">
                    <span>Course format</span>
                    <strong>Recorded practical training</strong>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.1}>
              <GlassCard className="dashboard-card">
                <div className="media-panel" style={{ minHeight: "14rem" }}>
                  <img src={routinePreview} alt="Training roadmap preview" loading="lazy" decoding="async" width="640" height="360" />
                  <div className="media-panel__copy">
                    <span className="chip">Training roadmap</span>
                  </div>
                </div>
                <ul className="tier-list">
                  <li>Beginner confidence and rhythm control</li>
                  <li>Intermediate flow and body coordination</li>
                  <li>Advanced stage-ready movement language</li>
                </ul>
              </GlassCard>
            </Reveal>
          </div>

          <div className="grid-3" style={{ marginTop: "2rem" }}>
            <Reveal>
              <GlassCard className="detail-card">
                <span className="icon-orb">
                  <Crown size={18} aria-hidden="true" />
                </span>
                <strong>Main product</strong>
                <p style={{ margin: 0 }}>639-step structured dance course with one-time payment access.</p>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.05}>
              <GlassCard className="detail-card">
                <span className="icon-orb">
                  <Users size={18} aria-hidden="true" />
                </span>
                <strong>Support layer</strong>
                <p style={{ margin: 0 }}>Visible human help through WhatsApp and email if clarity is needed.</p>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.1}>
              <GlassCard className="detail-card">
                <span className="icon-orb">
                  <Trophy size={18} aria-hidden="true" />
                </span>
                <strong>Goal</strong>
                <p style={{ margin: 0 }}>From unsure beginner to confident performer with a cleaner, guided journey.</p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

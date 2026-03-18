import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Sparkles } from "../icons.jsx";
import { apiFetch } from "../api.js";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import OdometerNumber from "../components/OdometerNumber.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

const formatAmount = (paise) => {
  if (paise == null) return "INR 0";
  const amount = Number(paise) / 100;
  return `INR ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN");
};

export default function Admin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loadPurchases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/admin/purchases");
      if (res.status === 401 || res.status === 403) {
        setAuthRequired(true);
        setRows([]);
        return;
      }
      if (!res.ok) throw new Error("Unable to load purchases");
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
      setAuthRequired(false);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const res = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || "Invalid admin credentials");
      }
      setEmail("");
      setPassword("");
      setAuthRequired(false);
      loadPurchases();
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    setRows([]);
    setAuthRequired(true);
  };

  const stats = useMemo(() => {
    const paidRows = rows.filter((row) => row.status?.toLowerCase() === "captured" || row.status?.toLowerCase() === "paid");
    const totalRevenue = paidRows.reduce((sum, row) => sum + Number(row.amountPaise || 0), 0);
    const downloadedCount = rows.filter((row) => row.downloadedAt).length;

    return [
      { label: "Purchases", value: rows.length, odometerValue: String(rows.length) },
      {
        label: "Paid revenue",
        value: formatAmount(totalRevenue),
        odometerValue: Math.round(totalRevenue / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        prefix: "INR ",
      },
      { label: "Downloads", value: downloadedCount, odometerValue: String(downloadedCount) },
      { label: "Paid users", value: paidRows.length, odometerValue: String(paidRows.length) },
    ];
  }, [rows]);

  return (
    <MainLayout
      navProps={{
        links: [
          { key: "home", label: "Home", to: "/" },
          { key: "dashboard", label: "Dashboard", to: "/dashboard" },
        ],
        ctaLabel: "Back to home",
        ctaTo: "/",
      }}
    >
      <section className="section-shell section-shell--tight">
        <div className="container-max">
          <div className="page-topbar">
            <div>
              <span className="chip chip--gold">Admin dashboard</span>
              <h1 style={{ margin: "1rem 0 0.5rem", fontFamily: "var(--font-family-display)", fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
                User purchase control
              </h1>
              <p className="muted" style={{ margin: 0 }}>
                Keep the admin route functional, readable, and visually aligned with the premium frontend.
              </p>
            </div>

            <div className="action-cluster">
              {!authRequired ? (
                <Button type="button" variant="secondary" onClick={loadPurchases}>
                  Refresh
                </Button>
              ) : null}
              {!authRequired ? (
                <Button type="button" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              ) : null}
              <Button to="/" variant="ghost">
                Home
              </Button>
            </div>
          </div>

          {authRequired ? (
            <div className="grid-2">
              <GlassCard className="auth-info-card" accent="gold">
                <span className="chip chip--gold">
                  <Sparkles size={14} aria-hidden="true" />
                  Protected admin entry
                </span>
                <h2 style={{ margin: "1rem 0 0.75rem", fontFamily: "var(--font-family-display)", fontSize: "2.2rem" }}>
                  Sign in to view purchases
                </h2>
                <p className="muted">
                  Admin access should feel clean and intentional too. No backend behavior changes here; only the shell and experience are improved.
                </p>
                <ul className="tier-list" style={{ marginTop: "1rem" }}>
                  <li>Review paid orders and payment status.</li>
                  <li>See delivery and download activity quickly.</li>
                  <li>Use a simple, trustworthy login screen.</li>
                </ul>
              </GlassCard>

              <GlassCard className="form-card">
                <span className="chip">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Admin sign in
                </span>
                <h2 style={{ margin: "1rem 0 0.6rem", fontFamily: "var(--font-family-display)", fontSize: "2.1rem" }}>
                  Enter admin credentials
                </h2>
                <p className="muted" style={{ marginTop: 0 }}>
                  Use your admin email and password to view purchases.
                </p>

                {error ? (
                  <div className="message-pill" role="alert" style={{ marginBottom: "1rem" }}>
                    {error}
                  </div>
                ) : null}

                <form className="form-stack" onSubmit={handleLogin}>
                  <FormField
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    label="Email"
                    autoComplete="username"
                    required
                  />
                  <FormField
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    label="Password"
                    autoComplete="current-password"
                    required
                  />
                  <Button type="submit">Sign In</Button>
                </form>
              </GlassCard>
            </div>
          ) : (
            <>
              <SectionHeader
                eyebrow="Admin overview"
                title="Revenue, users, and downloads in one clear table."
                description="The admin surface should be fast to scan, not overloaded with visual noise."
              />

              <div className="admin-stats" style={{ marginBottom: "2rem" }}>
                {stats.map((item, index) => (
                  <GlassCard key={item.label} className="detail-card" accent={index === 1 ? "gold" : ""}>
                    <span className="chip">{item.label}</span>
                    <strong className="stat-number">
                      {item.odometerValue ? (
                        <OdometerNumber
                          value={item.odometerValue}
                          prefix={item.prefix || ""}
                          className={index === 1 ? "odometer--gold" : ""}
                        />
                      ) : (
                        item.value
                      )}
                    </strong>
                  </GlassCard>
                ))}
              </div>

              <GlassCard className="table-card">
                {loading ? <div className="app-loading-inline"><span className="spinner-dot" aria-hidden="true" />Loading purchases...</div> : null}
                {error ? (
                  <div className="message-pill" role="alert" style={{ marginBottom: "1rem" }}>
                    {error}
                  </div>
                ) : null}
                {!loading && !error && rows.length === 0 ? <p className="muted">No paid purchases yet.</p> : null}

                {!loading && rows.length > 0 ? (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Order ID</th>
                          <th>Payment ID</th>
                          <th>Paid At</th>
                          <th>Downloaded</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.purchaseId}>
                            <td>{row.fullName || "-"}</td>
                            <td>{row.email || "-"}</td>
                            <td>{formatAmount(row.amountPaise)}</td>
                            <td>{row.status || "-"}</td>
                            <td className="mono">{row.razorpayOrderId || "-"}</td>
                            <td className="mono">{row.razorpayPaymentId || "-"}</td>
                            <td>{formatDate(row.paidAt)}</td>
                            <td>{row.downloadedAt ? "Yes" : "No"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </GlassCard>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

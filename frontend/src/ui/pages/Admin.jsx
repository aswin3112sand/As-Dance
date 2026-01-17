import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api.js";

const formatAmount = (paise) => {
  if (paise == null) return "—";
  const amount = Number(paise) / 100;
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
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

  return (
    <div className="section admin-page">
      <div className="container-max">
        <div className="checkout-header admin-header">
          <div className="checkout-brand">
            <div className="brand">AS DANCE</div>
            <div className="checkout-title">User Purchase</div>
            <div className="checkout-subtitle">Admin dashboard • paid orders</div>
          </div>
          <div className="checkout-actions">
            {!authRequired && (
              <button className="btn btn-outline-light" onClick={loadPurchases}>Refresh</button>
            )}
            <Link className="btn btn-outline-light" to="/">Home</Link>
            {!authRequired && (
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>

        <div className="card-glass admin-card">
          {authRequired ? (
            <form className="admin-login" onSubmit={handleLogin}>
              <div className="checkout-title-sm">Admin Sign In</div>
              <p className="subtle">Use your admin email and password to view purchases.</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label subtle" htmlFor="admin-email">Email</label>
                <input
                  id="admin-email"
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="mb-3">
                <label className="form-label subtle" htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button className="btn btn-neon w-100" type="submit">Sign In</button>
            </form>
          ) : (
            <>
              {loading && <div className="subtle">Loading purchases…</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              {!loading && !error && rows.length === 0 && (
                <div className="subtle">No paid purchases yet.</div>
              )}

              {!loading && rows.length > 0 && (
                <div className="admin-table-wrap">
                  <table className="admin-table">
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
                          <td>{row.fullName || "—"}</td>
                          <td>{row.email || "—"}</td>
                          <td>{formatAmount(row.amountPaise)}</td>
                          <td>{row.status || "—"}</td>
                          <td className="admin-mono">{row.razorpayOrderId || "—"}</td>
                          <td className="admin-mono">{row.razorpayPaymentId || "—"}</td>
                          <td>{formatDate(row.paidAt)}</td>
                          <td>{row.downloadedAt ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

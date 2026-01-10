import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const redirectParam = params.get("redirect");
  const targetPath = redirectParam || (typeof loc.state?.from === "string" ? loc.state.from : "/checkout?pay=1");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof loc.state?.email === "string") {
      setEmail(loc.state.email);
    }
  }, [loc.state]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      nav(targetPath, { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cinematic-auth login-page">
      <div className="cinematic-bg">
        <div className="bg-gradient"></div>
        <div className="particle-field">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`login-p-${i}`}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`
              }}
            ></div>
          ))}
        </div>
        <div className="light-beam beam-1"></div>
        <div className="light-beam beam-2"></div>
      </div>

      <div className={`cinematic-card login-card ${mounted ? "mounted" : ""}`}>
        <div className="card-glow"></div>

        <div className="auth-header">
          <h1 className="auth-main-title">ENTER AS DANCE</h1>
          <p className="auth-subtitle">Unlock Your 639-Step Performance System</p>
          <p className="auth-micro-text">
            One login. Lifetime access.<br />Built for stage, competition &amp; mastery.
          </p>
        </div>

        {err && <div className="auth-error">{err}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">@</span>
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            <span className="btn-text">{loading ? "Entering..." : "Enter the Stage"}</span>
            <span className="btn-glow"></span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to AS DANCE? <Link to={`/register?redirect=${encodeURIComponent(targetPath)}`} className="auth-link">Start Your Journey</Link>
          </p>
          <Link to="/" className="back-link">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

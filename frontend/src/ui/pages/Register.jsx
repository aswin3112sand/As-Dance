import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { shouldReduceMotion } from "../utils/motion.js";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const redirectParam = params.get("redirect");
  const redirectFromState = typeof loc.state?.redirect === "string" ? loc.state.redirect : "";
  const redirectTarget = redirectParam || redirectFromState;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const particleCount = useMemo(() => {
    if (typeof window === "undefined") return 10;
    const reduceMotion = shouldReduceMotion();
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    return reduceMotion || isSmallScreen ? 10 : 25;
  }, []);
  const particles = useMemo(
    () => Array.from({ length: particleCount }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`
    })),
    [particleCount]
  );

  useEffect(() => {
    setMounted(true);
    if (typeof loc.state?.email === "string") {
      setEmail(loc.state.email);
    }
  }, [loc.state]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const normalizedName = fullName.trim();
      const fallbackName = email.split("@")[0] || "AS DANCE User";
      const safeName = normalizedName || fallbackName;
      await register(safeName, email, password);
      setOk("Account created! Redirecting...");
      const loginTarget = redirectTarget
        ? `/login?redirect=${encodeURIComponent(redirectTarget)}`
        : "/login";
      setTimeout(() => nav(loginTarget, { state: { email } }), 800);
    } catch (ex) {
      if (ex?.message === "EMAIL_NOT_ALLOWED") {
        setErr("This email is not allowed for access.");
      } else {
        setErr(ex?.message || "Register failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cinematic-auth register-page">
      <div className="cinematic-bg">
        <div className="bg-gradient register-gradient"></div>
        <div className="particle-field">
          {particles.map((particle, i) => (
            <div
              key={`register-p-${i}`}
              className="particle register-particle"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay
              }}
            ></div>
          ))}
        </div>
        <div className="light-beam beam-1 register-beam"></div>
        <div className="light-beam beam-2 register-beam"></div>
        <div className="light-pulse"></div>
      </div>

      <div className={`cinematic-card register-card ${mounted ? "mounted" : ""}`}>
        <div className="card-glow register-glow"></div>

        <div className="auth-header">
          <h1 className="auth-main-title">BEGIN YOUR JOURNEY</h1>
          <p className="auth-subtitle">Create Your AS DANCE Access</p>
          <p className="auth-micro-text">Every performance starts with a single step.</p>
        </div>

        {err && <div className="auth-error">{err}</div>}
        {ok && <div className="auth-success">{ok}</div>}

        <form onSubmit={onSubmit} className="auth-form register-form">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">
              Full Name <span className="optional">(Optional)</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">N</span>
              <input
                id="reg-name"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">@</span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone" className="form-label">
              WhatsApp <span className="optional">(Optional)</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">#</span>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+91 88256 02356"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn register-btn" disabled={loading}>
            <span className="btn-text">{loading ? "Creating Access..." : "Create My Access"}</span>
            <span className="btn-glow"></span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have access? <Link to="/login" className="auth-link">Enter the Stage</Link>
          </p>
          <Link to="/" className="back-link">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

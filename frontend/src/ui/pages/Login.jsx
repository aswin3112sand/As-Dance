import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const failureMessage = "Login failed - Create account or retry";
  const targetPath = typeof loc.state?.from === "string" ? loc.state.from : "/checkout";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = "#050814";
    document.body.style.background = "#050814";
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  async function onSubmit(e){
    e.preventDefault();
    setErr("");
    setLoading(true);
    try{
      await login(email, password);
      nav(targetPath, { replace: true });
    }catch(ex){
      const code = ex?.message;
      if (code === "USER_NOT_FOUND") {
        setErr("Login Failed — Create Account Required");
      } else if (code === "INVALID_PASSWORD") {
        setErr("Invalid email or password.");
      } else if (code === "ACCOUNT_DISABLED") {
        setErr("Account disabled. Please contact support.");
      } else if (code === "EMAIL_NOT_ALLOWED") {
        setErr("This email is not allowed for access.");
      } else {
        setErr(failureMessage);
      }
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <p className="auth-brand">AS DANCE</p>
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">639 Steps Curriculum Access</p>
          <div className="auth-microcopy">
            <span>One-Time Login for Lifetime Unlock</span>
            <span>Built for Stage & Competition Performance</span>
          </div>
        </div>

        {err && <div className="auth-alert">{err}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">Email</label>
          <input
            type="email"
            className="auth-input"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            className="auth-input"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="auth-cta" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          New user? <Link to="/register">Create account</Link>
        </p>
        <Link to="/" className="auth-back">← Back to Home</Link>
      </div>
    </div>
  );
}

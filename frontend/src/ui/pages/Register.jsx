import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [fullName, setFullName] = useState("Aswin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof loc.state?.email === "string") {
      setEmail(loc.state.email);
    }
  }, [loc.state]);

  async function onSubmit(e){
    e.preventDefault();
    setErr(""); setOk("");
    setLoading(true);
    try{
      await register(fullName, email, password);
      setOk("Account created! Please login.");
      setTimeout(()=>nav("/login"), 700);
    }catch(ex){
      if (ex?.message === "EMAIL_NOT_ALLOWED") {
        setErr("This email is not allowed for access.");
      } else {
        setErr(ex.message || "Register failed");
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">639 Steps Curriculum Access</p>
          <div className="auth-microcopy">
            <span>One-Time Login for Lifetime Unlock</span>
            <span>Built for Stage & Competition Performance</span>
          </div>
        </div>

        {err && <div className="auth-alert">{err}</div>}
        {ok && <div className="auth-ok">{ok}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label">Full Name</label>
          <input
            className="auth-input"
            autoComplete="name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />

          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            className="auth-input"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button className="auth-cta" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <Link to="/" className="auth-back">← Back to Home</Link>
      </div>
    </div>
  );
}

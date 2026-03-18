import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Crown, ShieldCheck, Sparkles } from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import stageImage from "../../assets/bg/w10.webp";
import supportImage from "../../assets/bg/DanceTut.webp";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  const targetPath = redirectParam || (typeof location.state?.from === "string" ? location.state.from : "/checkout?pay=1");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof location.state?.email === "string") {
      setEmail(location.state.email);
    }
  }, [location.state]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout
      footer={false}
      navProps={{
        links: [
          { key: "home", label: "Home", to: "/" },
          { key: "preview", label: "Preview", to: "/preview" },
        ],
        ctaLabel: "Create account",
        ctaTo: `/register?redirect=${encodeURIComponent(targetPath)}`,
      }}
    >
      <section className="section-shell">
        <div className="container-max">
          <div className="auth-shell">
            <GlassCard className="auth-info-card" accent="gold">
              <span className="chip chip--gold">
                <Sparkles size={14} aria-hidden="true" />
                Premium student entry
              </span>
              <h1 style={{ margin: "1rem 0 0.75rem", fontFamily: "var(--font-family-display)", fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.02 }}>
                Enter the stage.
              </h1>
              <p className="muted">
                Login keeps the payment and dashboard journey protected, but the experience should still feel premium,
                warm, and trust-building.
              </p>

              <div className="auth-visual-grid">
                <img src={stageImage} alt="AS Dance stage mood" loading="lazy" decoding="async" width="900" height="1200" />
                <img src={supportImage} alt="AS Dance trainer support visual" loading="lazy" decoding="async" width="900" height="1200" />
              </div>

              <ul className="tier-list" style={{ marginTop: "1.2rem" }}>
                <li>Access checkout, dashboard, and payment follow-up without friction.</li>
                <li>Support remains visible before the user spends money.</li>
                <li>Design should feel like a premium academy, not a generic auth form.</li>
              </ul>
            </GlassCard>

            <GlassCard className="form-card">
              <span className="chip">
                <Crown size={14} aria-hidden="true" />
                Student login
              </span>
              <h2 style={{ margin: "1rem 0 0.6rem", fontFamily: "var(--font-family-display)", fontSize: "2.2rem" }}>
                Access your learning flow
              </h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Continue to checkout or open the dashboard after verification.
              </p>

              {error ? (
                <div className="message-pill" role="alert" style={{ marginBottom: "1rem" }}>
                  {error}
                </div>
              ) : null}

              <form className="form-stack" onSubmit={onSubmit}>
                <FormField
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  label="Email"
                  autoComplete="email"
                  required
                />

                <FormField
                  id="login-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  label="Password"
                  autoComplete="current-password"
                  trailingAction={
                    <button
                      type="button"
                      className="form-field-action"
                      onClick={() => setIsPasswordVisible((current) => !current)}
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                      aria-pressed={isPasswordVisible}
                    >
                      {isPasswordVisible ? "Hide" : "Show"}
                    </button>
                  }
                  required
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Authorizing..." : "Enter the Stage"}
                </Button>
              </form>

              <div className="divider" style={{ marginBlock: "1.2rem" }} />

              <div className="button-row">
                <Button to={`/register?redirect=${encodeURIComponent(targetPath)}`} variant="secondary">
                  Start your journey
                </Button>
                <Button to="/" variant="ghost">
                  Back to home
                </Button>
              </div>

              <p className="inline-note" style={{ marginTop: "1rem" }}>
                Need help first? <a href="mailto:businessaswin@gmail.com">Email support</a> or ask on WhatsApp after login.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

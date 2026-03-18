import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, UserPlus } from "../icons.jsx";
import { useAuth } from "../auth.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import practiceImage from "../../assets/bg/w12.webp";
import performanceImage from "../../assets/bg/Ayan.webp";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  const redirectFromState = typeof location.state?.redirect === "string" ? location.state.redirect : "";
  const redirectTarget = redirectParam || redirectFromState;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof location.state?.email === "string") {
      setEmail(location.state.email);
    }
  }, [location.state]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const normalizedName = fullName.trim();
      const fallbackName = email.split("@")[0] || "AS DANCE User";
      const safeName = normalizedName || fallbackName;
      await register(safeName, email, password);
      setSuccess("Account created! Redirecting...");
      const loginTarget = redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : "/login";
      window.setTimeout(() => navigate(loginTarget, { state: { email } }), 800);
    } catch (err) {
      setError(err?.message || "Register failed");
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
          { key: "login", label: "Login", to: "/login" },
        ],
        ctaLabel: "Back to home",
        ctaTo: "/",
      }}
    >
      <section className="section-shell">
        <div className="container-max">
          <div className="auth-shell">
            <GlassCard className="auth-info-card" accent="gold">
              <span className="chip chip--gold">
                <Sparkles size={14} aria-hidden="true" />
                Create your student access
              </span>
              <h1 style={{ margin: "1rem 0 0.75rem", fontFamily: "var(--font-family-display)", fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.02 }}>
                Begin your journey.
              </h1>
              <p className="muted">
                Registration should feel premium, clear, and low-friction. The user is not just making an account;
                they are entering the AS Dance brand experience.
              </p>

              <div className="auth-visual-grid">
                <img src={practiceImage} alt="Dance practice visual" loading="lazy" decoding="async" width="900" height="1200" />
                <img src={performanceImage} alt="Dance performance visual" loading="lazy" decoding="async" width="900" height="1200" />
              </div>

              <ul className="tier-list" style={{ marginTop: "1.2rem" }}>
                <li>Use a name or let the system create a safe fallback for you.</li>
                <li>Login and payment flow remain unchanged after registration.</li>
                <li>WhatsApp support can guide the user before they pay.</li>
              </ul>
            </GlassCard>

            <GlassCard className="form-card">
              <span className="chip">
                <UserPlus size={14} aria-hidden="true" />
                Student registration
              </span>
              <h2 style={{ margin: "1rem 0 0.6rem", fontFamily: "var(--font-family-display)", fontSize: "2.2rem" }}>
                Create your premium access
              </h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Set up your login now, then move directly into preview, checkout, and dashboard flow.
              </p>

              {error ? (
                <div className="message-pill" role="alert" style={{ marginBottom: "1rem" }}>
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="chip chip--gold" style={{ marginBottom: "1rem" }}>
                  {success}
                </div>
              ) : null}

              <form className="form-stack" onSubmit={onSubmit}>
                <FormField
                  id="reg-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  label="Full Name"
                />

                <FormField
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  label="Email"
                  autoComplete="email"
                  required
                />

                <FormField
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  label="WhatsApp"
                  autoComplete="tel"
                />

                <FormField
                  id="reg-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  label="Password"
                  autoComplete="new-password"
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

                <FormField
                  id="reg-confirm"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  label="Confirm Password"
                  autoComplete="new-password"
                  trailingAction={
                    <button
                      type="button"
                      className="form-field-action"
                      onClick={() => setIsConfirmPasswordVisible((current) => !current)}
                      aria-label={isConfirmPasswordVisible ? "Hide confirm password" : "Show confirm password"}
                      aria-pressed={isConfirmPasswordVisible}
                    >
                      {isConfirmPasswordVisible ? "Hide" : "Show"}
                    </button>
                  }
                  required
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Access..." : "Create My Access"}
                </Button>
              </form>

              <div className="divider" style={{ marginBlock: "1.2rem" }} />

              <div className="button-row">
                <Button to="/login" variant="secondary">
                  Already have access?
                </Button>
                <Button to="/" variant="ghost">
                  Back to home
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

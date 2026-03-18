import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Clock,
  CreditCard,
  Infinity,
  Mail,
  ShieldCheck,
  Sparkles,
  Unlock,
  WhatsApp,
} from "../icons.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { createPaymentOrder, fetchPaymentStatus, verifyPayment } from "../paymentApi.js";
import { clearFailure, clearReceipt, saveFailure } from "../paymentStorage.js";
import bundlePreview from "../../assets/bg/poster.webp";
import MainLayout from "../layouts/MainLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";

const CUSTOM_QUOTE_URL =
  "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20I%20need%20a%20tiered%20custom%20choreography%20quote.";

const HERO_METRICS = [
  { label: "Total mastery path", value: "639 steps" },
  { label: "Level structure", value: "213 x 3" },
  { label: "Access window", value: "Lifetime" },
];

const HERO_CHIPS = [
  { Icon: ShieldCheck, label: "Secure Checkout" },
  { Icon: Unlock, label: "Instant unlock path" },
  { Icon: Infinity, label: "Dashboard + Drive access" },
];

const PAYMENT_PROMISES = [
  {
    Icon: CreditCard,
    title: "Razorpay secure flow",
    copy: "One direct payment path without confusing upsells or extra steps.",
  },
  {
    Icon: Clock,
    title: "Fast student unlock",
    copy: "Verification mudinja udane dashboard route and bundle access open aagum.",
  },
  {
    Icon: WhatsApp,
    title: "Human support ready",
    copy: "Optional WhatsApp number fill pannina support follow-up quick-a panna mudiyum.",
  },
];

const BUNDLE_INCLUDES = [
  "213 Easy steps for clean beginner entry.",
  "213 Medium steps for timing, sync, and stronger performance control.",
  "213 Hard steps for advanced combinations and pro-finish confidence.",
  "Single dashboard route with Google Drive delivery after unlock.",
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const courseId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("courseId");
    return id ? Number(id) : 123;
  }, []);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const processingRef = useRef(false);
  const razorpayReadyRef = useRef(false);

  useEffect(() => {
    const checkStatus = async () => {
      const { ok, data } = await fetchPaymentStatus();
      if (ok && data.unlocked) {
        navigate("/dashboard");
      }
    };

    checkStatus();
  }, [navigate]);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const scriptId = "razorpay-checkout-js";

      if (typeof window !== "undefined" && window.Razorpay) {
        razorpayReadyRef.current = true;
        return resolve(true);
      }

      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        razorpayReadyRef.current = true;
        resolve(true);
      };

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });

  const normalizePhone = (value) => (value || "").replace(/[^\d]/g, "");

  const getValidatedPhone = (value) => {
    const digits = normalizePhone(value);
    if (!digits) return "";
    if (digits.length < 10) return null;
    return digits;
  };

  const handlePayment = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    setMessages([]);
    clearFailure();
    clearReceipt();

    const name = nameRef.current?.value?.trim() || "";
    const rawPhone = phoneRef.current?.value || "";
    const validatedPhone = getValidatedPhone(rawPhone);

    if (validatedPhone === null) {
      setMessages(["Enter a valid WhatsApp number or leave it blank."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    const phone = validatedPhone || "";
    const prefillName = name || user?.fullName || user?.email?.split("@")[0] || "";

    let orderResult;
    try {
      orderResult = await createPaymentOrder({ buyerName: name, buyerPhone: phone, courseId });
    } catch {
      setMessages(["Unable to reach the payment server. Please try again."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    const { ok, data } = orderResult;
    if (!ok) {
      const message =
        data.message === "PAYMENT_CONFIG_MISSING"
          ? "Payment config missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend."
          : data.message || "Failed to create payment order";
      setMessages([message]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      setMessages(["Failed to load payment gateway. Please try again."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const resolvedKey = data.keyId || razorpayKey;

    if (!resolvedKey || !data.orderId) {
      setMessages(["Payment configuration missing. Please contact support."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    const options = {
      key: resolvedKey,
      amount: data.amount,
      currency: "INR",
      name: "As Dance",
      description: "639-step mastery bundle unlock",
      image: bundlePreview,
      order_id: data.orderId,
      handler: async (response) => {
        let verifyRes;
        try {
          verifyRes = await verifyPayment({
            orderId: response.razorpay_order_id || data.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        } catch {
          const failurePayload = { reason: "Payment verification failed. Please try again." };
          saveFailure(failurePayload, user?.id);
          setProcessing(false);
          processingRef.current = false;
          navigate("/payment-failed", { state: failurePayload });
          return;
        }

        if (verifyRes.ok) {
          setProcessing(false);
          processingRef.current = false;
          navigate(`/dashboard?courseId=${courseId}`);
        } else {
          const reason = verifyRes.data?.message || "Payment failed. Please try again.";
          const failurePayload = { reason };
          saveFailure(failurePayload, user?.id);
          setProcessing(false);
          processingRef.current = false;
          navigate("/payment-failed", { state: failurePayload });
        }
      },
      prefill: {
        name: prefillName,
        email: user?.email || undefined,
        contact: phone,
      },
      theme: {
        color: "#d4af37",
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
          processingRef.current = false;
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        const reason = response?.error?.description || "Payment failed. Please try again.";
        const failurePayload = { reason };
        saveFailure(failurePayload, user?.id);
        setProcessing(false);
        processingRef.current = false;
        navigate("/payment-failed", { state: failurePayload });
      });
      rzp.open();
    } catch {
      setMessages(["Failed to open payment gateway. Please try again."]);
      setProcessing(false);
      processingRef.current = false;
    }
  };

  return (
    <MainLayout
      footer={false}
      navProps={{
        links: [
          { key: "home", label: "Home", to: "/" },
          { key: "services", label: "Custom Choreo", to: "/services" },
        ],
        ctaLabel: "639 Bundle Preview",
        ctaTo: "/preview",
      }}
    >
      <section className="section-shell checkout-shell">
        <div className="container-max checkout-page">
          <GlassCard className="checkout-hero-card" accent="gold">
            <div className="checkout-page-topbar">
              <span className="chip chip--gold">Secure Checkout</span>

              <div className="top-actions">
                <Button to="/" variant="ghost">
                  Home
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>
            </div>

            <div className="checkout-hero__grid">
              <div className="checkout-hero__copy">
                <p className="checkout-hero__eyebrow">Mastery bundle checkout</p>
                <h1 className="checkout-hero__title">Unlock the 639 Mastery Bundle with one clear payment flow.</h1>
                <p className="checkout-hero__description">
                  INR 499-ku direct student unlock. Payment verify aana udane dashboard route and Google Drive delivery open aagum.
                  Live batches and custom choreography intha checkout-kulla include pannala.
                </p>

                <div className="checkout-chip-row" aria-label="Checkout highlights">
                  {HERO_CHIPS.map(({ Icon, label }) => (
                    <span key={label} className="checkout-chip">
                      <Icon size={15} aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>

                <div className="checkout-hero__metrics" aria-label="Bundle summary">
                  {HERO_METRICS.map(({ label, value }) => (
                    <div key={label} className="checkout-hero__metric">
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="checkout-offer-card">
                <div className="checkout-offer-card__header">
                  <span className="checkout-offer-card__kicker">One-time student unlock</span>
                  <strong className="checkout-offer-card__price">INR 499</strong>
                  <p className="checkout-offer-card__copy">
                    213 Easy + 213 Medium + 213 Hard. One purchase, one unlock path, lifetime access.
                  </p>
                </div>

                <div className="checkout-offer-card__list">
                  <div className="checkout-offer-card__row">
                    <span>Delivery</span>
                    <strong>Dashboard + Drive</strong>
                  </div>
                  <div className="checkout-offer-card__row">
                    <span>Support route</span>
                    <strong>WhatsApp + Email</strong>
                  </div>
                  <div className="checkout-offer-card__row">
                    <span>Best for</span>
                    <strong>Beginner to performance prep</strong>
                  </div>
                </div>

                <div className="checkout-offer-card__actions">
                  <Button href="#checkout-payment" className="checkout-button--wide">
                    Pay INR 499 Now
                    <ArrowRight size={17} aria-hidden="true" />
                  </Button>
                  <Button
                    href={CUSTOM_QUOTE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    className="checkout-button--wide"
                  >
                    Tiered custom quote
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="checkout-layout checkout-layout--premium">
            <GlassCard className="summary-card checkout-summary-card-premium">
              <div className="media-panel checkout-media-panel">
                <img
                  src={bundlePreview}
                  alt="639 mastery bundle preview"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                />
                <div className="media-panel__copy checkout-media-panel__copy">
                  <span className="chip chip--gold">Instant digital unlock</span>
                  <h2>What opens after payment</h2>
                  <p>Structured bundle access without extra friction.</p>
                </div>
              </div>

              <div className="summary-list checkout-summary-list">
                <div className="summary-row">
                  <span>Bundle unlock</span>
                  <strong>INR 499</strong>
                </div>
                <div className="summary-row">
                  <span>Access method</span>
                  <strong>Dashboard + Google Drive</strong>
                </div>
                <div className="summary-row">
                  <span>Support coverage</span>
                  <strong>WhatsApp + Email</strong>
                </div>
              </div>

              <div className="checkout-summary-section">
                <p className="checkout-summary-section__label">Included in the mastery path</p>
                <ul className="tier-list">
                  {BUNDLE_INCLUDES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="checkout-summary-section">
                <p className="checkout-summary-section__label">Support and policy</p>
                <div className="support-stack checkout-support-stack">
                  <div className="support-item checkout-support-item">
                    <span className="icon-orb checkout-support-item__icon">
                      <WhatsApp size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>WhatsApp support</strong>
                      <p>+91 88256 02356</p>
                    </div>
                  </div>
                  <div className="support-item checkout-support-item">
                    <span className="icon-orb checkout-support-item__icon">
                      <Mail size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>Email support</strong>
                      <p>businessaswin@gmail.com</p>
                    </div>
                  </div>
                  <div className="support-item checkout-support-item">
                    <span className="icon-orb checkout-support-item__icon">
                      <ShieldCheck size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>Refund note</strong>
                      <p>Refund applies only if paid access is not delivered.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-row checkout-summary-actions">
                <Button type="button" onClick={handlePayment} disabled={processing} className="checkout-button--wide">
                  {processing ? "Processing..." : "Pay INR 499 Now"}
                </Button>
                <Button href="/preview" variant="ghost" className="checkout-button--wide">
                  View preview first
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="form-card checkout-form-card" accent="gold" id="checkout-payment">
              <div className="checkout-note-banner">
                <Sparkles size={16} aria-hidden="true" />
                <span>
                  Need tiered custom choreography instead?{" "}
                  <a href={CUSTOM_QUOTE_URL} target="_blank" rel="noopener noreferrer">
                    Get WhatsApp quote
                  </a>
                </span>
              </div>

              <div className="status-steps" aria-label="Checkout progress">
                <span className="status-step">Details</span>
                <span className="status-step is-active">Payment</span>
                <span className="status-step">Unlock</span>
              </div>

              <div className="checkout-form-card__header">
                <p className="checkout-form-card__eyebrow">Student payment form</p>
                <h2>Complete your secure checkout without the blank, confusing flow.</h2>
                <p className="muted">
                  Name optional. WhatsApp optional. If support reach pannalam-na number kudunga; இல்லனா direct-a payment continue pannalaam.
                </p>
              </div>

              <div className="checkout-proof-grid">
                {PAYMENT_PROMISES.map(({ Icon, title, copy }) => (
                  <div key={title} className="checkout-proof-card">
                    <span className="icon-orb checkout-proof-card__icon">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <p>{copy}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="form-stack"
                onSubmit={(event) => {
                  event.preventDefault();
                  handlePayment();
                }}
              >
                <FormField
                  ref={nameRef}
                  id="checkout-name"
                  type="text"
                  label="Full Name"
                  autoComplete="name"
                  hint="Optional. We will use your account name if this stays blank."
                />

                <FormField
                  ref={phoneRef}
                  id="checkout-phone"
                  type="tel"
                  label="WhatsApp"
                  autoComplete="tel"
                  inputMode="tel"
                  hint="Enter 10+ digits or leave blank."
                />

                <Button type="submit" disabled={processing} className="checkout-button--wide">
                  {processing ? "Processing..." : "Pay INR 499 Now"}
                </Button>
              </form>

              {processing ? (
                <div className="processing-pill checkout-processing-pill" aria-live="polite">
                  <span className="spinner-dot" aria-hidden="true" />
                  Payment window is loading...
                </div>
              ) : null}

              {messages.length ? (
                <div className="message-stack" role="alert">
                  {messages.map((message) => (
                    <div key={message} className="message-pill">
                      {message}
                    </div>
                  ))}
                </div>
              ) : null}

              <p className="inline-note checkout-form-footnote">
                This checkout is only for the digital 639 bundle. Live batches and custom choreography remain separate premium offers.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

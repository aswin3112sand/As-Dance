import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { apiFetch } from "../api.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, ShieldCheck, Zap, WhatsApp, Mail } from "../icons.jsx";
import bundlePreview from "../../assets/bg/As Dance.webp";

const SUPPORT_WHATSAPP = "+91 88256 02356";
const SUPPORT_EMAIL = "businessaswin@gmail.com";
const RAZORPAY_PLACEHOLDER_KEY = "rzp_test_placeholder";

export default function Checkout() {
  const { user, refresh, logout } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState(null);
  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState("");
  const [unlockedUrl, setUnlockedUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const rootRef = useRef(null);
  const phoneRef = useRef("");
  const lastOrderPhoneRef = useRef("");
  const prefetchTimerRef = useRef(null);
  const prefetchingRef = useRef(false);

  async function loadStatus() {
    const res = await apiFetch("/api/payment/status");
    const data = await res.json();
    setStatus(data);
  }

  useEffect(() => { loadStatus(); }, []);

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }
    const existing = document.getElementById("razorpay-checkout-js");
    if (existing) {
      existing.addEventListener("load", () => setRazorpayReady(true), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setMsg("Payment gateway failed to load. Please refresh.");
    document.body.appendChild(script);
    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%"
          }
        }
      );

      const items = gsap.utils.toArray(".checkout-anim");
      if (!items.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%"
          }
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const normalizePhone = (value) => (value || "").replace(/[^\d]/g, "");

  const validatePhone = (value) => {
    const digits = normalizePhone(value);
    return digits.length >= 10 ? digits : "";
  };

  const handlePhoneChange = (value) => {
    phoneRef.current = value;
    setPhone(value);
  };

  async function finalizePayment(payload) {
    setMsg("");
    const res = await apiFetch("/api/payment/webhook/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      setMsg(data.message || "Payment verification failed.");
      return;
    }
    setMsg(data.message || "Payment Success ✔ Bundle Unlocked!");
    if (data.unlocked) {
      const url = data.unlockedVideoUrl || "";
      setUnlockedUrl(url);
      await refresh();
      await loadStatus();
      setTimeout(() => nav("/", { replace: true }), 800);
    }
  }

  async function requestOrder(normalizedPhone, { silent } = {}) {
    if (!user?.email) {
      if (!silent) setMsg("Please login to create an order.");
      return null;
    }
    const res = await apiFetch("/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerPhone: normalizedPhone })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      if (!silent) setMsg(data.message || "Order create failed");
      return null;
    }
    setOrder(data);
    lastOrderPhoneRef.current = normalizedPhone;
    return data;
  }

  async function createOrder() {
    setMsg("");
    const normalizedPhone = validatePhone(phoneRef.current);
    if (!normalizedPhone) {
      setMsg("Enter a valid WhatsApp phone number to continue.");
      return;
    }
    setIsProcessing(true);
    let data = order;
    if (!data || lastOrderPhoneRef.current !== normalizedPhone) {
      data = await requestOrder(normalizedPhone);
    }
    if (!data) {
      setIsProcessing(false);
      return;
    }
    if (data.mode === "MOCK") {
      setMsg("Demo mode: Razorpay placeholder checkout.");
    }
    if (!razorpayReady || !window.Razorpay) {
      setMsg("Payment gateway is loading. Please wait a moment.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: data.keyId || RAZORPAY_PLACEHOLDER_KEY,
      order_id: data.orderId || undefined,
      amount: data.amountPaise,
      currency: data.currency,
      name: "AS DANCE",
      description: "639-Step Bundle",
      prefill: {
        name: user.fullName || "AS DANCE User",
        email: user.email,
        contact: normalizedPhone
      },
      modal: {
        ondismiss: () => setIsProcessing(false)
      },
      handler: (response) => {
        const payload = {
          order_id: data.orderId,
          payment_id: response?.razorpay_payment_id || `pay_test_${Date.now()}`
        };
        finalizePayment(payload).finally(() => setIsProcessing(false));
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      setMsg(response?.error?.description || "Payment failed. Please try again.");
      setIsProcessing(false);
    });
    rzp.open();
  }

  async function completeMockPayment() {
    if (!order?.orderId) return;
    const payload = {
      order_id: order.orderId,
      payment_id: "pay_mock_" + Date.now()
    };
    setIsProcessing(true);
    await finalizePayment(payload);
    setIsProcessing(false);
  }

  const unlocked = status?.unlocked || user?.unlocked;
  const handleOpenVideo = () => {
    apiFetch("/api/payment/downloaded", { method: "POST" }).catch(() => { });
    const url = unlockedUrl || status?.unlockedVideoUrl;
    if (!url) {
      setMsg("Unlocked video link is not configured yet.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!user?.email) return;
    const normalizedPhone = validatePhone(phone);
    if (!normalizedPhone) return;
    if (normalizedPhone === lastOrderPhoneRef.current) return;
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current);
    }
    prefetchTimerRef.current = setTimeout(() => {
      const latest = validatePhone(phoneRef.current);
      if (!latest || latest === lastOrderPhoneRef.current) return;
      if (prefetchingRef.current) return;
      prefetchingRef.current = true;
      requestOrder(latest, { silent: true })
        .finally(() => {
          prefetchingRef.current = false;
        });
    }, 450);
    return () => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, [phone, user?.email]);

  return (
    <div className="checkout-page section" ref={rootRef}>
      <div className="container-max checkout-shell">
        <div className="checkout-top-actions checkout-anim">
          <Link className="btn btn-outline-light" to="/">Home</Link>
          <button className="btn btn-outline-light" onClick={logout}>Logout</button>
        </div>

        <div className="checkout-float">
          <div className="checkout-left checkout-anim">
            <div className="checkout-brandline">AS DANCE — 639-Step Bundle</div>
            <div className="checkout-micro-stats">
              639 Steps (Easy 196 • Medium 219 • Hard 226)
            </div>
            <div className="checkout-subtitle">Secure Checkout – ₹499 Offer</div>

            <div className="checkout-title-sm">Payment</div>
            <p className="checkout-body">
              Finish your payment to unlock the bundle instantly.
            </p>

            {msg && <div className="checkout-message">{msg}</div>}

            <div className="checkout-field">
              <label className="checkout-field-label" htmlFor="buyer-phone">WhatsApp Number</label>
              <input
                id="buyer-phone"
                type="tel"
                className="checkout-input"
                placeholder="+91 88256 02356"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
              <span className="checkout-hint">Use the number where you want payment confirmation.</span>
            </div>

            <div className="checkout-actions-row">
              <button className="checkout-btn checkout-btn-primary" onClick={createOrder} disabled={isProcessing}>
                <span className="btn-icon" aria-hidden>⚡</span>
                <span>Buy Now</span>
              </button>
              <button
                className="checkout-btn checkout-btn-secondary"
                onClick={completeMockPayment}
                disabled={order?.mode !== "MOCK" || isProcessing}
              >
                <span className="btn-icon" aria-hidden>🔒</span>
                <span>Complete Mock Payment</span>
              </button>
            </div>

            <div className="checkout-trust-divider" aria-hidden="true"></div>
            <div className="checkout-trust-row">
              <div className="checkout-trust-item">
                <ShieldCheck size={16} />
                Secure Payment
              </div>
              <div className="checkout-trust-item">
                <Clock size={16} />
                Lifetime Access
              </div>
              <div className="checkout-trust-item">
                <Zap size={16} />
                Instant Unlock
              </div>
            </div>
            <div className="checkout-receipt">
              Email receipt will be sent automatically after payment.
            </div>

            <div className="checkout-status-line">
              <span className="checkout-label-inline">Status:</span>
              <span className="checkout-status-value">{unlocked ? "Unlocked" : "Locked"}</span>
            </div>

            {unlocked && (
              <button className="checkout-btn checkout-btn-primary checkout-open" onClick={handleOpenVideo}>
                <span className="btn-icon" aria-hidden>⚡</span>
                <span>Preview</span>
              </button>
            )}
          </div>

          <aside className="checkout-right">
            <div className="checkout-summary-card checkout-anim">
              <div className="summary-image">
                <img
                  src={bundlePreview}
                  alt="AS DANCE bundle preview"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                />
              </div>
              <div className="checkout-label">Order Summary</div>
              <div className="checkout-summary-row">
                <span>Bundle</span>
                <span className="checkout-summary-value">₹499</span>
              </div>
              <div className="checkout-summary-row total">
                <span>Total</span>
                <span className="checkout-summary-value">₹499</span>
              </div>

              <div className="checkout-support">
                <div className="checkout-label">Support</div>
                <div className="checkout-support-item">
                  <span className="support-icon"><WhatsApp size={16} color="currentColor" /></span>
                  <span className="support-label">WhatsApp</span>
                  <span className="support-value">{SUPPORT_WHATSAPP}</span>
                </div>
                <div className="checkout-support-item">
                  <span className="support-icon"><Mail size={16} /></span>
                  <span className="support-label">Email</span>
                  <span className="support-value">{SUPPORT_EMAIL}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

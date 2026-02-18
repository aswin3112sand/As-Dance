import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Mail, WhatsApp } from "../icons.jsx";
import { createPaymentOrder, verifyPayment, fetchPaymentStatus } from "../paymentApi.js";
import { clearFailure, clearReceipt, saveFailure } from "../paymentStorage.js";
import bundlePreview from "../../assets/bg/poster.webp";
import "../checkout-styles.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const customQuoteUrl = "https://wa.me/918825602356?text=Hi%20AS%20DANCE%2C%20I%20need%20a%20custom%20choreography%20quote.";

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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
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

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

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
    } catch (err) {
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
      description: "Online dance training access",
      image: bundlePreview,
      order_id: data.orderId,
      handler: async (response) => {
        let verifyRes;
        try {
          verifyRes = await verifyPayment({
            orderId: response.razorpay_order_id || data.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          });
        } catch (err) {
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
        contact: phone
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
          processingRef.current = false;
        }
      }
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
    } catch (err) {
      setMessages(["Failed to open payment gateway. Please try again."]);
      setProcessing(false);
      processingRef.current = false;
    }
  };

  return (
    <section className="checkout-page">
      <div className="checkout-shell container-max">
        <div className="checkout-top-actions">
          <Link className="btn btn-outline-light" to="/">Home</Link>
          <button className="btn btn-outline-light" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="checkout-float">
          <div className="checkout-left">
            <div className="checkout-micro-stats">Secure Checkout</div>
            <div className="checkout-brandline">AS DANCE</div>
            <div className="checkout-title-sm">Course Access Checkout - INR 499</div>
            <div className="checkout-subtitle">Fixed-price course purchase. Access delivered within 24-48 hours.</div>

            <div className="checkout-switch-offer">
              Need custom choreography instead?{" "}
              <a href={customQuoteUrl} target="_blank" rel="noopener noreferrer">
                Get WhatsApp quote
              </a>
            </div>

            <div className="checkout-steps">
              <span className="checkout-step is-complete">Details</span>
              <span className="checkout-step-divider">|</span>
              <span className="checkout-step is-active">Payment</span>
              <span className="checkout-step-divider">|</span>
              <span className="checkout-step">Unlock</span>
            </div>

            <p className="checkout-body">
              This payment is for course access only. Fill in optional contact details so we can confirm and deliver
              access within 24-48 hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
            >
              <div className="checkout-field-grid">
                <div className="checkout-field">
                  <label className="checkout-field-label" htmlFor="checkout-name">
                    Full Name <span className="checkout-optional">(optional)</span>
                  </label>
                  <input
                    id="checkout-name"
                    ref={nameRef}
                    type="text"
                    className="checkout-input"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-field-label" htmlFor="checkout-phone">
                    WhatsApp <span className="checkout-optional">(optional)</span>
                  </label>
                  <input
                    id="checkout-phone"
                    ref={phoneRef}
                    type="tel"
                    className="checkout-input"
                    placeholder="WhatsApp number"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  <span className="checkout-hint">Enter 10+ digits or leave blank.</span>
                </div>
              </div>

              <div className="checkout-actions-row">
                <button
                  className="checkout-btn checkout-btn-primary"
                  type="submit"
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Pay INR 499 Now"}
                </button>
              </div>
            </form>

            {processing && (
              <div className="checkout-processing" aria-live="polite">
                <span className="checkout-spinner" aria-hidden="true"></span>
                Payment window is loading...
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={`checkout-msg-${i}`} className="checkout-message" role="alert">
                {msg}
              </div>
            ))}
          </div>

          <div className="checkout-right">
            <div className="checkout-summary-card">
              <div className="checkout-label">Order Summary</div>
              <div className="bundle-preview">
                <img
                  src={bundlePreview}
                  alt="Course Preview"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                />
              </div>
              <div className="checkout-summary-row">
                <span>Course Access</span>
                <span className="checkout-summary-value">INR 499</span>
              </div>
              <div className="checkout-summary-row">
                <span>Delivery Window</span>
                <span className="checkout-summary-value">24-48h</span>
              </div>
              <div className="checkout-summary-row total">
                <span>Total</span>
                <span className="checkout-summary-value">INR 499</span>
              </div>
              <button
                className="checkout-summary-cta"
                type="button"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay INR 499"}
              </button>

              <div className="checkout-trust-divider"></div>
              <div className="checkout-trust-row">
                <span className="checkout-trust-item">Secure Payment</span>
                <span className="checkout-trust-item">Delivery 24-48 hours</span>
                <span className="checkout-trust-item">Course Access</span>
              </div>
              <div className="checkout-receipt">
                Receipt is sent after payment. Access is delivered within 24-48 hours via Google Drive or private
                online access. Refunds apply only if access is not delivered.
              </div>

              <div className="checkout-support">
                <div className="checkout-support-item">
                  <WhatsApp size={18} className="support-icon" aria-hidden="true" />
                  <div>
                    <div className="support-label">WhatsApp Support</div>
                    <div className="support-value">+91 88256 02356</div>
                  </div>
                </div>
                <div className="checkout-support-item">
                  <Mail size={18} className="support-icon" aria-hidden="true" />
                  <div>
                    <div className="support-label">Email</div>
                    <div className="support-value">
                      <a href="mailto:businessaswin@gmail.com" aria-label="Email support">
                        businessaswin@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="checkout-support-item">
                  <WhatsApp size={18} className="support-icon" aria-hidden="true" />
                  <div>
                    <div className="support-label">Custom Choreo Quote</div>
                    <div className="support-value">
                      <a href={customQuoteUrl} target="_blank" rel="noopener noreferrer">
                        Open WhatsApp quote chat
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="checkout-trust-note">
                This checkout is only for course access. For custom choreography packages, use WhatsApp quote.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { createPaymentOrder, verifyPayment, fetchPaymentStatus } from "../paymentApi.js";
import { clearFailure, clearReceipt, saveFailure, saveReceipt } from "../paymentStorage.js";
import bundlePreview from "../../assets/bg/poster.webp";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [processing, setProcessing] = useState(false);

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
      orderResult = await createPaymentOrder({ buyerName: name, buyerPhone: phone });
    } catch (err) {
      setMessages(["Unable to reach the payment server. Please try again."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }
    const { ok, data } = orderResult;
    if (!ok) {
      setMessages([data.message || "Failed to create payment order"]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    if (data.mode === "MOCK") {
      const mockPaymentId = `pay_mock_${Date.now()}`;
      let verifyRes;
      try {
        verifyRes = await verifyPayment({
          orderId: data.orderId,
          paymentId: mockPaymentId,
          signature: ""
        });
      } catch (err) {
        setMessages(["Payment verification failed. Please try again."]);
        setProcessing(false);
        processingRef.current = false;
        return;
      }
      if (verifyRes.ok) {
        const receiptPayload = {
          orderId: data.orderId,
          paymentId: mockPaymentId,
          amountPaise: data.amountPaise,
          googleDriveUrl: verifyRes.data?.unlockedVideoUrl
        };
        saveReceipt(receiptPayload, user?.id);
        setProcessing(false);
        processingRef.current = false;
        navigate("/payment-success", { state: receiptPayload });
      } else {
        const reason = verifyRes.data?.message || "Payment failed. Please try again.";
        const failurePayload = { reason };
        saveFailure(failurePayload, user?.id);
        setProcessing(false);
        processingRef.current = false;
        navigate("/payment-failed", { state: failurePayload });
      }
      return;
    }

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      setMessages(["Failed to load payment gateway. Please try again."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    if (!data.keyId || !data.orderId) {
      setMessages(["Payment configuration missing. Please contact support."]);
      setProcessing(false);
      processingRef.current = false;
      return;
    }

    const options = {
      key: data.keyId || "rzp_test_S1mk723Rt4DSsp",
      amount: data.amountPaise,
      currency: data.currency || "INR",
      name: "As Dance",
      description: "Unlock Premium Content",
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
          const receiptPayload = {
            orderId: response.razorpay_order_id || data.orderId,
            paymentId: response.razorpay_payment_id,
            amountPaise: data.amountPaise,
            googleDriveUrl: verifyRes.data?.unlockedVideoUrl
          };
          saveReceipt(receiptPayload, user?.id);
          setProcessing(false);
          processingRef.current = false;
          navigate("/payment-success", { state: receiptPayload });
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
            <div className="checkout-title-sm">Unlock the 639-Step Bundle</div>
            <div className="checkout-subtitle">One-time payment. Instant unlock. Lifetime access.</div>

            <div className="checkout-steps">
              <span className="checkout-step is-complete">Details</span>
              <span className="checkout-step-divider">•</span>
              <span className="checkout-step is-active">Payment</span>
              <span className="checkout-step-divider">•</span>
              <span className="checkout-step">Unlock</span>
            </div>

            <p className="checkout-body">
              Your bundle unlocks 639 curated steps across easy, medium, and hard routines.
              Fill in optional contact details so we can reach you instantly after payment.
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
                  {processing ? "Processing..." : "Buy Now"}
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
                  alt="Bundle Preview"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                />
              </div>
              <div className="checkout-summary-row">
                <span>Bundle Access</span>
                <span className="checkout-summary-value">₹499</span>
              </div>
              <div className="checkout-summary-row total">
                <span>Total</span>
                <span className="checkout-summary-value">₹499</span>
              </div>
              <button
                className="checkout-summary-cta"
                type="button"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay ₹499"}
              </button>

              <div className="checkout-trust-divider"></div>
              <div className="checkout-trust-row">
                <span className="checkout-trust-item">Secure Payment</span>
                <span className="checkout-trust-item">Instant Unlock</span>
                <span className="checkout-trust-item">Lifetime Access</span>
              </div>
              <div className="checkout-receipt">Receipt delivered instantly after payment.</div>

              <div className="checkout-support">
                <div className="checkout-support-item">
                  <div>
                    <div className="support-label">WhatsApp Support</div>
                    <div className="support-value">+91 88256 02356</div>
                  </div>
                </div>
                <div className="checkout-support-item">
                  <div>
                    <div className="support-label">Email</div>
                    <div className="support-value">businessaswin@gmail.com</div>
                  </div>
                </div>
              </div>
              <div className="checkout-trust-note">Complete payment to unlock your dashboard.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

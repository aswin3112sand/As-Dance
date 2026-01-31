import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { createPaymentOrder, fetchPaymentStatus, verifyPayment } from "../paymentApi.js";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const scriptId = "razorpay-checkout-js";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function BuyNowButton({
  courseId = 123,
  label = "Buy Now",
  className = "",
  redirectPath
}) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openUnlockedLink = async () => {
    const status = await fetchPaymentStatus();
    const url = status?.data?.unlockedVideoUrl || "https://drive.google.com/";
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleClick = async () => {
    if (!user) {
      const target = redirectPath || window.location.pathname + window.location.search;
      nav("/login", { state: { from: target } });
      return;
    }

    setLoading(true);
    setError("");

    let orderResult;
    try {
      orderResult = await createPaymentOrder({ courseId });
    } catch {
      setError("Unable to reach the payment server.");
      setLoading(false);
      return;
    }

    if (!orderResult.ok) {
      const message = orderResult?.data?.message || "Unable to create order.";
      if (message === "PAYMENT_CONFIG_MISSING") {
        setError("Payment config missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend.");
      } else if (message === "UNAUTHORIZED") {
        setError("Please login again to continue.");
      } else {
        setError(message);
      }
      setLoading(false);
      return;
    }

    const data = orderResult.data;
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || !data.orderId) {
      setError("Payment configuration missing. Please contact support.");
      setLoading(false);
      return;
    }

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      setError("Failed to load Razorpay. Please try again.");
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: "INR",
      name: "AS DANCE",
      description: "Course access",
      order_id: data.orderId,
      handler: async (response) => {
        try {
          const verifyRes = await verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          });
          if (verifyRes.ok) {
            await openUnlockedLink();
          } else {
            setError(verifyRes?.data?.message || "Payment verification failed.");
          }
        } catch {
          setError("Payment verification failed.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
        }
      },
      prefill: {
        name: user?.fullName || user?.email?.split("@")[0] || "AS DANCE Learner",
        email: user?.email || ""
      },
      theme: {
        color: "#38bdf8"
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        const reason = response?.error?.description || "Payment failed. Please try again.";
        setError(reason);
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError("Unable to open payment gateway.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full rounded-xl bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.45)] transition hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {loading ? "Processing..." : label}
      </button>
      {error && (
        <span className="text-xs text-red-300" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

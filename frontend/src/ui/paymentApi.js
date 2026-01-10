import { apiFetch } from "./api.js";

export async function createPaymentOrder(payload) {
  const res = await apiFetch("/api/payment/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {})
  });
  const data = await res.json().catch(() => ({}));
  return {
    ok: res.ok && data.ok !== false,
    data,
    status: res.status
  };
}

export async function verifyPayment(payload) {
  const res = await apiFetch("/api/payment/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: payload?.orderId,
      razorpay_payment_id: payload?.paymentId,
      razorpay_signature: payload?.signature || ""
    })
  });
  const data = await res.json().catch(() => ({}));
  return {
    ok: res.ok && data.ok !== false,
    data,
    status: res.status
  };
}

export async function fetchPaymentStatus() {
  const res = await apiFetch("/api/payment/status");
  const data = await res.json().catch(() => null);
  return {
    ok: res.ok && !!data,
    data
  };
}

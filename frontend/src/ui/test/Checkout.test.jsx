import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Checkout from "../pages/Checkout.jsx";

vi.mock("../paymentApi.js", () => ({
  fetchPaymentStatus: vi.fn().mockResolvedValue({
    ok: true,
    data: { unlocked: false }
  }),
  createPaymentOrder: vi.fn(),
  verifyPayment: vi.fn()
}));

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({
    user: { email: "testuser@asdance.com", fullName: "Test User" },
    refresh: vi.fn(),
    logout: vi.fn()
  })
}));

test("renders checkout screen", async () => {
  window.Razorpay = function Razorpay() {};

  render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  );

  expect(await screen.findByRole("heading", { name: /unlock the 639 mastery bundle/i })).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /pay inr 499 now/i }).length).toBeGreaterThan(0);
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Checkout from "../pages/Checkout.jsx";

const apiFetchMock = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ unlocked: false })
});

vi.mock("../api.js", () => ({
  apiFetch: (...args) => apiFetchMock(...args)
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

  expect(await screen.findByText(/Secure Checkout/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Buy Now/i })).toBeInTheDocument();
});

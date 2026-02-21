import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "../pages/Home.jsx";

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({ user: null, loading: false })
}));

test("renders updated hero clarity content", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /easy-a start pannunga, step-by-step practice la confident aagunga\./i }))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: /pay inr 499 - access 639 steps/i }))
    .toBeInTheDocument();
  expect(screen.getAllByText(/639 STEP PRACTICAL COURSE/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/^639$/)).toBeInTheDocument();
  expect(screen.getByText(/^Steps$/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /enable hero video audio/i }))
    .toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /live class illa\. direct-ah 639-step recorded practical dance course access, one-time inr 499\./i }))
    .toBeInTheDocument();
  expect(screen.getAllByText(/100% Recorded Practical Course/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Learn Anytime\. Practice at Your Pace\./i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/Idhu recorded self-practice course; live class support include aagathu\./i))
    .not.toBeInTheDocument();
  expect(screen.getAllByText(/One-time INR 499 payment/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Custom Song Dance Service \(Premium Service\)/i)).toBeInTheDocument();
  expect(screen.getByText(/Custom choreography for your song/i)).toBeInTheDocument();
  expect(screen.queryByText(/639 structured steps\. one-time unlock\. practice pannunga\. improve pannunga\./i))
    .not.toBeInTheDocument();
  expect(screen.queryByText(/One-time unlock/i)).not.toBeInTheDocument();
  expect(screen.getAllByText(/AS DANCE/i).length).toBeGreaterThan(0);
});

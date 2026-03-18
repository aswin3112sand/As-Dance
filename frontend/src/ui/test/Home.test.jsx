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

  expect(screen.getByRole("heading", { name: /master dance in 639 steps/i })).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /book free class/i }).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: /pay inr 499 - access 639 steps/i })).toBeInTheDocument();
  expect(screen.getByText(/dance styles we teach/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /real students, real results/i })).toBeInTheDocument();
  expect(screen.getByText(/639-step full course/i)).toBeInTheDocument();
  expect(screen.getByText(/common questions/i)).toBeInTheDocument();
  expect(screen.getAllByText(/AS DANCE/i).length).toBeGreaterThan(0);
});

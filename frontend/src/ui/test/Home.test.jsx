import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "../pages/Home.jsx";

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({ user: null, loading: false })
}));

test("renders hero content", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /customized choreography online dance training/i }))
    .toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /buy course access/i }).length)
    .toBeGreaterThan(0);
  expect(screen.getAllByText(/AS DANCE/i).length).toBeGreaterThan(0);
});

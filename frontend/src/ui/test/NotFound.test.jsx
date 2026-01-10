import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../pages/NotFound.jsx";

test("renders not found message and link", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute("href", "/");
});

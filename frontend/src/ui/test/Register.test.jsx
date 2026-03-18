import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Register from "../pages/Register.jsx";

const registerMock = vi.fn().mockRejectedValue(new Error("This email is not allowed for access."));

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({ register: registerMock })
}));

test("shows error on failed register", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await user.type(screen.getByLabelText(/full name/i), "Test User");
  await user.type(screen.getByLabelText(/^email$/i), "blocked@asdance.com");
  await user.type(screen.getByLabelText(/^password$/i, { selector: "input" }), "pass123");
  await user.type(screen.getByLabelText(/^confirm password$/i, { selector: "input" }), "pass123");
  await user.click(screen.getByRole("button", { name: /create my access/i }));

  expect(await screen.findByText(/not allowed for access/i)).toBeInTheDocument();
});

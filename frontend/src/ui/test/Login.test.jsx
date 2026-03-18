import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../pages/Login.jsx";

const loginMock = vi.fn().mockRejectedValue(new Error("Incorrect email or password."));

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({ login: loginMock })
}));

test("shows error on failed login", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await user.type(screen.getByLabelText(/email/i), "testuser@asdance.com");
  await user.type(screen.getByLabelText(/^password$/i, { selector: "input" }), "pass123");
  await user.click(screen.getByRole("button", { name: /enter the stage/i }));

  expect(await screen.findByText(/incorrect email or password/i)).toBeInTheDocument();
});

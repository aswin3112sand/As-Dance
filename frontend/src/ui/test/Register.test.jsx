import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Register from "../pages/Register.jsx";

const registerMock = vi.fn().mockRejectedValue(new Error("EMAIL_NOT_ALLOWED"));

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({ register: registerMock })
}));

test("shows error on failed register", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  const inputs = container.querySelectorAll("input");
  await user.clear(inputs[0]);
  await user.type(inputs[0], "Test User");
  await user.type(inputs[1], "blocked@asdance.com");
  await user.type(inputs[2], "pass123");
  await user.click(screen.getByRole("button", { name: /create account/i }));

  expect(await screen.findByText(/not allowed/i)).toBeInTheDocument();
});

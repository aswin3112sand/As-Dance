import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../pages/Login.jsx";

const loginMock = vi.fn().mockRejectedValue(new Error("USER_NOT_FOUND"));

vi.mock("../auth.jsx", () => ({
  useAuth: () => ({ login: loginMock })
}));

test("shows error on failed login", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const inputs = container.querySelectorAll("input");
  await user.type(inputs[0], "testuser@asdance.com");
  await user.type(inputs[1], "pass123");
  await user.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByText(/Login Failed/i)).toBeInTheDocument();
});

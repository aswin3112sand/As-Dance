import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Preview from "../pages/Preview.jsx";

vi.mock("../components/DemoSection.jsx", () => ({
  default: () => <div>Demo Section</div>
}));

test("renders preview navigation and demo section", async () => {
  render(
    <MemoryRouter>
      <Preview />
    </MemoryRouter>
  );

  expect(screen.getAllByText(/as dance/i).length).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
  expect(await screen.findByText(/demo section/i)).toBeInTheDocument();
});

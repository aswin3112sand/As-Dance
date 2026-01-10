import { vi } from "vitest";
import { apiFetch } from "../api.js";

test("adds XSRF header for non-GET requests", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true });
  global.fetch = fetchMock;

  document.cookie = "XSRF-TOKEN=abc123";

  await apiFetch("/api/test", { method: "POST" });

  expect(fetchMock).toHaveBeenCalledWith(
    "/api/test",
    expect.objectContaining({
      credentials: "include",
      headers: expect.objectContaining({
        "X-XSRF-TOKEN": "abc123"
      })
    })
  );
});

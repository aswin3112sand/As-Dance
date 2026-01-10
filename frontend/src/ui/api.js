function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function clearOldCache() {
  if ("caches" in window && import.meta.env.PROD) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
}

function initNewCache() {
  if ("caches" in window && import.meta.env.PROD) {
    caches.open("as-dance-v1").catch(() => {});
  }
}

clearOldCache();
initNewCache();

export function apiFetch(url, options = {}) {
  const opts = { credentials: "include", ...options };
  const method = (opts.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const token = getCookie("XSRF-TOKEN");
    if (token) {
      opts.headers = { ...(opts.headers || {}), "X-XSRF-TOKEN": token };
    }
  }
  return fetch(url, opts);
}

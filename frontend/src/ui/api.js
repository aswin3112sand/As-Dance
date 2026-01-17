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

const scheduleCacheWork = () => {
  clearOldCache();
  initNewCache();
};

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(scheduleCacheWork, { timeout: 2000 });
  } else {
    window.setTimeout(scheduleCacheWork, 0);
  }
}

/**
 * API Fetch wrapper with relative paths (same-origin)
 * All URLs should be relative: /api/... (NO localhost, NO IP, NO hardcoded domain)
 */
export function apiFetch(url, options = {}) {
  // Ensure URL is relative (starts with /)
  const relativeUrl = url.startsWith('/') ? url : `/${url}`;
  
  const opts = { 
    credentials: "include",
    ...options 
  };
  
  const method = (opts.method || "GET").toUpperCase();
  
  // Add XSRF token for non-GET requests
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const token = getCookie("XSRF-TOKEN");
    if (token) {
      opts.headers = { ...(opts.headers || {}), "X-XSRF-TOKEN": token };
    }
  }
  
  return fetch(relativeUrl, opts);
}

/**
 * Axios-style API client for convenience
 */
export const apiClient = {
  get: (url) => apiFetch(url, { method: 'GET' }),
  post: (url, data) => apiFetch(url, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  put: (url, data) => apiFetch(url, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  delete: (url) => apiFetch(url, { method: 'DELETE' }),
};

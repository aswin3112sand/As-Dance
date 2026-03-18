const GTM_ID = "GTM-WP7RVV9J";
const META_PIXEL_ID = "3312176042274880";

let analyticsScheduled = false;
let analyticsBooted = false;
const queuedPageViews = [];

function isLocalDev() {
  if (typeof window === "undefined") return false;
  return !import.meta.env.PROD && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
}

function loadExternalScript(id, src) {
  if (typeof document === "undefined") return Promise.resolve(false);

  const existing = document.getElementById(id);
  if (existing) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function ensureMetaPixelStub() {
  if (typeof window === "undefined" || typeof document === "undefined" || typeof window.fbq === "function") {
    return;
  }

  const stub = function fbqStub() {
    stub.callMethod ? stub.callMethod.apply(stub, arguments) : stub.queue.push(arguments);
  };

  stub.queue = [];
  stub.loaded = false;
  stub.version = "2.0";

  window.fbq = stub;
  window._fbq = stub;
}

function emitPageView(path) {
  if (typeof window === "undefined") return;

  const normalizedPath = path || `${window.location.pathname}${window.location.search || ""}`;
  const absoluteUrl = `${window.location.origin}${normalizedPath}`;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_view",
    page_title: document.title,
    page_path: normalizedPath,
    page_location: absoluteUrl,
  });

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

function flushQueuedPageViews() {
  while (queuedPageViews.length) {
    emitPageView(queuedPageViews.shift());
  }
}

function bootAnalytics() {
  if (analyticsBooted || isLocalDev() || typeof window === "undefined") return;
  analyticsBooted = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  ensureMetaPixelStub();
  if (typeof window.fbq === "function") {
    window.fbq("init", META_PIXEL_ID);
  }

  loadExternalScript("gtm-js", `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`).catch(() => {});
  loadExternalScript("meta-pixel-js", "https://connect.facebook.net/en_US/fbevents.js")
    .then(() => {
      if (typeof window.fbq === "function") {
        window.fbq.loaded = true;
      }
      flushQueuedPageViews();
    })
    .catch(() => {});

  flushQueuedPageViews();
}

export function scheduleAnalytics() {
  if (analyticsScheduled || isLocalDev() || typeof window === "undefined") return;
  analyticsScheduled = true;

  const bootWhenReady = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => bootAnalytics(), { timeout: 2200 });
      return;
    }
    window.setTimeout(bootAnalytics, 1200);
  };

  const triggerEarlyBoot = () => {
    window.removeEventListener("pointerdown", triggerEarlyBoot);
    window.removeEventListener("keydown", triggerEarlyBoot);
    window.removeEventListener("touchstart", triggerEarlyBoot);
    bootAnalytics();
  };

  window.addEventListener("pointerdown", triggerEarlyBoot, { once: true, passive: true });
  window.addEventListener("keydown", triggerEarlyBoot, { once: true });
  window.addEventListener("touchstart", triggerEarlyBoot, { once: true, passive: true });

  if (document.readyState === "complete") {
    bootWhenReady();
    return;
  }

  window.addEventListener("load", bootWhenReady, { once: true });
}

export function trackPageView(path, isInitialVisit = false) {
  if (isLocalDev() || typeof window === "undefined") return;

  const normalizedPath = path || `${window.location.pathname}${window.location.search || ""}`;
  if (!analyticsBooted) {
    if (isInitialVisit && queuedPageViews[0] === normalizedPath) {
      return;
    }
    queuedPageViews.push(normalizedPath);
    scheduleAnalytics();
    return;
  }

  emitPageView(normalizedPath);
}

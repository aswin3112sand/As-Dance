const { chromium } = require("playwright");

const TARGET_URL = "http://localhost:8085/";
const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 960, mobile: false },
  { label: "mobile", width: 390, height: 844, mobile: true },
];

async function auditViewport(browser, config) {
  const context = await browser.newContext({
    viewport: { width: config.width, height: config.height },
    isMobile: config.mobile,
    hasTouch: config.mobile,
    userAgent: config.mobile
      ? "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36"
      : undefined,
  });
  const page = await context.newPage();

  const consoleIssues = [];
  const requestFailures = [];

  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleIssues.push(`${msg.type()}: ${msg.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    consoleIssues.push(`pageerror: ${error.message}`);
  });

  page.on("requestfailed", (request) => {
    requestFailures.push(`${request.method()} ${request.url()} -> ${request.failure()?.errorText || "failed"}`);
  });

  await page.addInitScript(() => {
    window.__auditMetrics = {
      cls: 0,
      lcp: 0,
      longTaskBlockingTime: 0,
      longTasks: 0,
      paints: {},
    };

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__auditMetrics.paints[entry.name] = entry.startTime;
        }
      }).observe({ type: "paint", buffered: true });
    } catch {}

    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          window.__auditMetrics.lcp = lastEntry.startTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__auditMetrics.cls += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__auditMetrics.longTasks += 1;
          window.__auditMetrics.longTaskBlockingTime += Math.max(0, entry.duration - 50);
        }
      }).observe({ type: "longtask", buffered: true });
    } catch {}
  });

  await page.goto(TARGET_URL, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(3500);

  const snapshot = await page.evaluate(() => {
    const metrics = window.__auditMetrics || {};
    const navigation = performance.getEntriesByType("navigation")[0];
    const visibleElements = (selector) =>
      Array.from(document.querySelectorAll(selector)).filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      });

    const smallTapTargets = Array.from(
      document.querySelectorAll("a, button, input, textarea, select, [role='button']")
    )
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const label = node.getAttribute("aria-label") || node.innerText?.trim() || node.textContent?.trim() || node.tagName;
        return { label, width: rect.width, height: rect.height };
      })
      .filter((target) => target.width > 0 && target.height > 0 && (target.width < 44 || target.height < 44))
      .slice(0, 12);

    const missingAlt = Array.from(document.images)
      .filter((img) => !img.hasAttribute("alt") || !img.getAttribute("alt")?.trim())
      .map((img) => img.currentSrc || img.src);

    const unnamedInteractive = Array.from(document.querySelectorAll("a, button, [role='button']"))
      .filter((node) => {
        const label =
          node.getAttribute("aria-label") ||
          node.textContent?.trim() ||
          node.getAttribute("title") ||
          node.querySelector("img[alt]")?.getAttribute("alt");
        return !label;
      })
      .map((node) => node.outerHTML.slice(0, 140));

    const headings = Array.from(document.querySelectorAll("h1, h2, h3")).map((node) => ({
      tag: node.tagName,
      text: node.textContent.trim(),
    }));

    const ctas = visibleElements("a, button")
      .filter((node) => /book|contact|preview|unlock|whatsapp|quote|login|register|bundle/i.test(node.textContent || ""))
      .slice(0, 12)
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          text: node.textContent.trim().replace(/\s+/g, " "),
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      });

    return {
      title: document.title,
      nav: navigation
        ? {
            domInteractive: navigation.domInteractive,
            domContentLoaded: navigation.domContentLoadedEventEnd,
            load: navigation.loadEventEnd,
            transferSize: navigation.transferSize,
          }
        : null,
      paints: metrics.paints || {},
      lcp: metrics.lcp || 0,
      cls: metrics.cls || 0,
      longTaskBlockingTime: metrics.longTaskBlockingTime || 0,
      longTasks: metrics.longTasks || 0,
      headings,
      missingAlt,
      unnamedInteractive,
      smallTapTargets,
      ctas,
      bodyClass: document.body.className,
      scrollHeight: document.documentElement.scrollHeight,
    };
  });

  await context.close();

  return {
    viewport: config.label,
    consoleIssues,
    requestFailures,
    snapshot,
  };
}

async function auditSlow3G(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
    connectionType: "cellular3g",
  });

  await page.addInitScript(() => {
    window.__slowAudit = { fcp: 0, lcp: 0 };
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") window.__slowAudit.fcp = entry.startTime;
        }
      }).observe({ type: "paint", buffered: true });
    } catch {}
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) window.__slowAudit.lcp = lastEntry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
  });

  await page.goto(TARGET_URL, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(4500);
  const data = await page.evaluate(() => window.__slowAudit);
  await context.close();
  return data;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const reports = [];

  for (const viewport of VIEWPORTS) {
    reports.push(await auditViewport(browser, viewport));
  }

  const slow3g = await auditSlow3G(browser);
  await browser.close();

  console.log(JSON.stringify({ target: TARGET_URL, reports, slow3g }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

import "@testing-library/jest-dom";
import { vi } from "vitest";

const noop = () => {};

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: noop
  });
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => window.setTimeout(cb, 0);
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
}

const gsapMock = {
  registerPlugin: noop,
  context: (cb) => {
    if (typeof cb === "function") cb();
    return { revert: noop };
  },
  fromTo: noop,
  to: noop,
  set: noop,
  timeline: () => ({ to: noop }),
  utils: { toArray: () => [] }
};

vi.mock("gsap", () => ({
  default: gsapMock,
  ...gsapMock
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {}
}));

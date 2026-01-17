export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return true;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = navigator?.connection;
  const saveData = connection?.saveData === true;
  const effectiveType = connection?.effectiveType || "";
  const slowNetwork = /(^|\\s)(slow-2g|2g)($|\\s)/.test(effectiveType);
  const lowMemory = typeof navigator?.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const lowCpu = typeof navigator?.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  return prefersReduced || saveData || slowNetwork || lowMemory || lowCpu;
};

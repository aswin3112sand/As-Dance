import { useEffect } from "react";

/**
 * Adds `.is-visible` class to each element ref when it enters the viewport.
 * Automatically disconnects the observer once the element is revealed.
 *
 * @param {React.RefObject | React.RefObject[]} refs - single ref or array of refs
 * @param {{ threshold?: number, rootMargin?: string, staggerMs?: number }} options
 */
export function useIntersectionReveal(refs, options = {}) {
    const { threshold = 0.14, rootMargin = "0px", staggerMs = 0 } = options;

    useEffect(() => {
        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            // Fallback: make everything visible immediately
            const list = Array.isArray(refs) ? refs : [refs];
            list.forEach((r) => {
                if (r?.current) r.current.classList.add("is-visible");
            });
            return;
        }

        const list = Array.isArray(refs) ? refs : [refs];
        const observers = [];

        list.forEach((r, i) => {
            const el = r?.current;
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        const delay = staggerMs * i;
                        if (delay > 0) {
                            setTimeout(() => el.classList.add("is-visible"), delay);
                        } else {
                            el.classList.add("is-visible");
                        }
                        obs.unobserve(el);
                    }
                },
                { threshold, rootMargin }
            );

            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, [refs, threshold, rootMargin, staggerMs]);
}

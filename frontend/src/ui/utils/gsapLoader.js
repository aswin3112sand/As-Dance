let gsapPromise;
let scrollTriggerPromise;

const resolveGsap = (mod) => mod?.gsap || mod?.default || mod;

export async function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then(resolveGsap);
  }
  return gsapPromise;
}

export async function loadScrollTrigger() {
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = Promise.all([loadGsap(), import("gsap/ScrollTrigger")]).then(([gsap, mod]) => {
      const ScrollTrigger = mod?.ScrollTrigger || mod?.default || mod;
      if (gsap?.registerPlugin && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }
      return { gsap, ScrollTrigger };
    });
  }
  return scrollTriggerPromise;
}

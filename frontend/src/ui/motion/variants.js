export const premiumEase = [0.22, 1, 0.36, 1];

export const defaultViewport = {
  once: false,
  amount: 0.3,
};

export function createRevealVariant({
  y = 56,
  scale = 0.98,
  blur = 10,
  duration = 0.78,
} = {}) {
  return {
    hidden: {
      opacity: 0,
      y,
      scale,
      filter: blur ? `blur(${blur}px)` : "blur(0px)",
    },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: premiumEase,
      },
    }),
  };
}

export const fadeInUp = createRevealVariant();

export const fadeInSoft = createRevealVariant({
  y: 36,
  scale: 0.985,
  blur: 8,
  duration: 0.72,
});

export const imageReveal = createRevealVariant({
  y: 42,
  scale: 0.95,
  blur: 0,
  duration: 0.92,
});

export const scaleIn = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.94,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.68,
      delay,
      ease: premiumEase,
    },
  }),
};

export function staggerContainer(staggerChildren = 0.14, delayChildren = 0.08) {
  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export const cardHover = {
  y: -8,
  scale: 1.02,
  transition: {
    duration: 0.28,
    ease: premiumEase,
  },
};

export function marqueeTrack(duration = 30) {
  return {
    visible: {
      x: ["0%", "-50%"],
      transition: {
        x: {
          duration,
          repeat: Infinity,
          ease: "linear",
        },
      },
    },
  };
}

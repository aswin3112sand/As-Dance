import React from "react";
import { m, useReducedMotion } from "framer-motion";
import { createRevealVariant, defaultViewport } from "../motion/variants.js";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 56,
  scale = 0.98,
  blur = 10,
  duration = 0.78,
  amount = 0.3,
  once = false,
  variant = null,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const revealVariant = variant || createRevealVariant({ y, scale, blur, duration });

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...defaultViewport, amount, once }}
      variants={revealVariant}
      custom={delay}
      {...props}
    >
      {children}
    </m.div>
  );
}

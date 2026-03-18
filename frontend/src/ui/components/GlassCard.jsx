import React from "react";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function GlassCard({
  as: Component = "article",
  accent = "",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={joinClasses("glass-card", accent ? `glass-card--${accent}` : "", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

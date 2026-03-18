import React from "react";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  children,
}) {
  return (
    <div className={joinClasses("section-heading", align === "center" ? "section-heading--center" : "", className)}>
      {eyebrow ? <div className="section-heading__eyebrow">{eyebrow}</div> : null}
      {title ? <h2 className="section-heading__title">{title}</h2> : null}
      {description ? <p className="section-heading__description">{description}</p> : null}
      {children}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function Button({
  to,
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = joinClasses("button", `button--${variant}`, className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

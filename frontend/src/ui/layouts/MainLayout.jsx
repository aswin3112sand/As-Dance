import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

export default function MainLayout({
  children,
  navProps = {},
  footer = true,
  className = "",
  mainClassName = "",
}) {
  return (
    <div className={joinClasses("experience-shell", className)}>
      <div className="experience-shell__noise" aria-hidden="true" />
      <div className="experience-shell__spotlight" aria-hidden="true" />
      <div className="experience-shell__mesh" aria-hidden="true" />
      {navProps !== false ? <Navbar {...navProps} /> : null}
      <div className={joinClasses("experience-shell__main", mainClassName)}>{children}</div>
      {footer ? <Footer /> : null}
    </div>
  );
}

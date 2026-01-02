import React from "react";
import { MessageCircle } from "../icons.jsx";

export default function FloatingWA() {
  return (
    <a
      className="wa-float"
      href="https://wa.me/918825602356"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={20} />
      <span>Support</span>
    </a>
  );
}

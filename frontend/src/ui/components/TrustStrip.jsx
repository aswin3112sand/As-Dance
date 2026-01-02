import React from "react";
import { Headset, Infinity, ShieldCheck, Zap } from "../icons.jsx";

const TRUST = [
  {
    title: "Lifetime Access",
    description: "Own the bundle forever.",
    Icon: Infinity
  },
  {
    title: "Secure Payment",
    description: "Verified Razorpay checkout.",
    Icon: ShieldCheck
  },
  {
    title: "Instant Unlock",
    description: "Access in seconds.",
    Icon: Zap
  },
  {
    title: "Support",
    description: "Fast help on WhatsApp.",
    Icon: Headset
  }
];

export default function TrustStrip() {
  return (
    <section className="trust-section">
      <div className="container-max">
        <div className="trust-strip card-glass anim-init" data-anim="fadeup">
          {TRUST.map(({ title, description, Icon }) => (
            <div className="trust-item" key={title}>
              <div className="trust-icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="trust-title">{title}</div>
                <div className="subtle small">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

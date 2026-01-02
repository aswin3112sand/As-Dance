
import React from "react";
import { ShieldCheck, Database, Zap, Users } from "../icons.jsx";

const REASONS = [
    { id: 1, label: "Exclusive Routines", val: "42", icon: <Zap size={24} /> },
    { id: 2, label: "Instructors", val: "204", icon: <Users size={24} /> },
    { id: 3, label: "Steps Completed", val: "24M", icon: <Database size={24} /> },
    { id: 4, label: "Blockchain Owned", val: "100%", icon: <ShieldCheck size={24} /> },
];

export default function WhyChooseUs() {
    return (
        <div className="why-grid">
            {REASONS.map((r) => (
                <div className="why-card" key={r.id}>
                    <div className="why-icon">{r.icon}</div>
                    <div className="why-val">{r.val}</div>
                    <div className="why-label">{r.label}</div>
                </div>
            ))}
        </div>
    );
}

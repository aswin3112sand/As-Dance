import React from "react";
import levelUpBg from "../../assets/bg/Captain.webp";

const LEVEL_UP = [
    { id: 1, value: "30", label: "Days" },
    { id: 2, value: "1", label: "Level" },
    { id: 3, value: "2", label: "Level" },
    { id: 4, value: "3", label: "Level" },
    { id: 5, value: "4", label: "Level" },
];

export default function TopCategories() {
    return (
        <div className="levelup-grid">
            {LEVEL_UP.map((step) => (
                <div
                    className="levelup-card"
                    key={step.id}
                    style={{ "--levelup-bg": `url(${levelUpBg})` }}
                >
                    <div className="levelup-value">{step.value}</div>
                    <div className="levelup-label">{step.label}</div>
                </div>
            ))}
        </div>
    );
}

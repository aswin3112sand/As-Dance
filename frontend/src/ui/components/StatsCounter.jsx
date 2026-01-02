import React from "react";

export default function StatsCounter({ steps }) {
  const stats = [
    { label: "Total Steps", value: steps?.total ?? 639, note: "Complete studio curriculum", isMain: true },
    { label: "Easy Steps", value: steps?.easy ?? 196, note: "Foundations and timing" },
    { label: "Medium Steps", value: steps?.medium ?? 219, note: "Transitions and control" },
    { label: "Hard Steps", value: steps?.hard ?? 226, note: "Performance pace" }
  ];

  return (
    <div className="stats-strip card-glass anim-init" data-anim="fadeup">
      {stats.map((stat, idx) => (
        <div className="stat-item" key={stat.label}>
          <div
            className={`stat-value ${stat.isMain ? "step-counter" : ""}`}
          >
            {stat.value}
          </div>
          <div className="stat-label">{stat.label}</div>
          <div className="subtle small">{stat.note}</div>
          {idx < stats.length - 1 && <div className="stat-divider" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

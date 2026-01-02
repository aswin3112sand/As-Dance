
import React from "react";
import practiceBg from "../../assets/bg/Ayalan.webp";
import mediumBg from "../../assets/bg/simbu.webp";
import hardBg from "../../assets/bg/Hrithick.webp";

const PRACTICE_PLANS = [
    {
        id: "30-sec",
        title: "30-Second Routine",
        overlay: "30s",
        thumb: practiceBg,
        levels: [
            { label: "Easy Flow", price: "Included" },
            { label: "Medium Flow", price: "Included" },
            { label: "Hard Flow", price: "Included" },
        ],
    },
    {
        id: "1-min",
        title: "1-Minute Routine",
        overlay: "1m",
        thumb: mediumBg,
        levels: [
            { label: "Easy Flow", price: "Included" },
            { label: "Medium Flow", price: "Included" },
            { label: "Hard Flow", price: "Included" },
        ],
    },
    {
        id: "5-min",
        title: "5-Minute Routine",
        overlay: "5m",
        thumb: hardBg,
        levels: [
            { label: "Easy Flow", price: "Included" },
            { label: "Medium Flow", price: "Included" },
            { label: "Hard Flow", price: "Included" },
        ],
    },
];

export default function LatestWorks() {
    return (
        <div className="works-grid">
            {PRACTICE_PLANS.map((plan) => (
                <div className="work-card" key={plan.id}>
                    <div className="work-thumb">
                        <img
                            src={plan.thumb}
                            alt={`${plan.title} preview`}
                            loading="lazy"
                            decoding="async"
                            width="640"
                            height="360"
                        />
                        <div className="work-overlay is-static">
                            <span className="work-overlay-title">{plan.overlay}</span>
                        </div>
                    </div>
                    <div className="work-meta">
                        <h4 className="work-title">{plan.title}</h4>
                        <div className="work-prices">
                            {plan.levels.map((level) => (
                                <div className="work-price-row" key={`${plan.id}-${level.label}`}>
                                    <span>{level.label}</span>
                                    <span className="subtle small">{level.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

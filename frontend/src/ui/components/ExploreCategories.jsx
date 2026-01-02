
import React from "react";
import easyBg from "../../assets/bg/dhanush.webp";
import mediumBg from "../../assets/bg/simbu.webp";
import hardBg from "../../assets/bg/Hrithick.webp";

const LEVELS = [
    {
        id: "easy",
        label: "Easy",
        heading: "Easy Steps",
        text: "Timing basics and clean footwork flow.",
        caption: "Foundation drills",
        img: easyBg
    },
    {
        id: "medium",
        label: "Medium",
        heading: "Medium Steps",
        text: "Smooth transitions with rhythm control.",
        caption: "Tempo control",
        img: mediumBg
    },
    {
        id: "hard",
        label: "Hard",
        heading: "Hard Steps",
        text: "Fast combos and performance-ready drills.",
        caption: "Stage-ready pace",
        img: hardBg
    },
];

export default function ExploreCategories() {
    return (
        <div className="explore-grid">
            {LEVELS.map((level) => (
                <div
                    className="explore-card instruction-card"
                    key={level.id}
                >
                    <div className="pill">{level.label}</div>
                    <div className="instruction-head">
                        <h3>{level.heading}</h3>
                        <p className="text-body subtle">{level.text}</p>
                    </div>
                    <div className="instruction-thumb" aria-hidden="true">
                        <img
                            src={level.img}
                            alt={`${level.heading} preview`}
                            loading="lazy"
                            decoding="async"
                            width="640"
                            height="420"
                        />
                    </div>
                    <div className="instruction-caption">{level.caption}</div>
                </div>
            ))}
        </div>
    );
}

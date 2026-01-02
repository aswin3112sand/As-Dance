
import React from "react";
import { TrendingUp, Activity } from "../icons.jsx";

const NEWS_ITEMS = [
    "Top 5 TikTok Dance Challenges of 2025",
    "AI in Choreography: The New Frontier",
    "Global Breaking Championship Winners Announced",
    "How to Monitize Your Dance Moves on Blockchain",
    "New 'Neon-Flow' Style Taking Over Studios",
];

export default function TrendingNews() {
    return (
        <div className="trending-news-strip">
            <div className="news-label">
                <TrendingUp size={16} />
                <span>TRENDING</span>
            </div>
            <div className="ticker-wrap">
                <div className="ticker">
                    {NEWS_ITEMS.map((item, i) => (
                        <div className="ticker-item" key={i}>
                            <span className="dot">•</span>
                            {item}
                            <span className="stat-pill"><Activity size={12} /> +24%</span>
                        </div>
                    ))}
                    {NEWS_ITEMS.map((item, i) => (
                        <div className="ticker-item" key={`dup-${i}`}>
                            <span className="dot">•</span>
                            {item}
                            <span className="stat-pill"><Activity size={12} /> +24%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

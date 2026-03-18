import React from "react";
import { Star } from "../icons.jsx";
import GlassCard from "./GlassCard.jsx";

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ReviewCard({ name, role, quote, rating = 5, accent = "" }) {
  return (
    <GlassCard className="review-card" accent={accent}>
      <div className="review-card__top">
        <div className="review-card__avatar" aria-hidden="true">
          {getInitials(name)}
        </div>

        <div className="review-card__meta">
          <strong>{name}</strong>
          <span>{role}</span>
        </div>
      </div>

      <div className="review-card__stars" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, index) => (
          <Star key={`${name}-star-${index}`} size={14} fill="currentColor" aria-hidden="true" />
        ))}
      </div>

      <p className="review-card__quote">"{quote}"</p>
    </GlassCard>
  );
}

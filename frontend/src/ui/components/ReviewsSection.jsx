import React from "react";
import { m, useReducedMotion } from "framer-motion";
import ReviewCard from "./ReviewCard.jsx";
import ScrollReveal from "./ScrollReveal.jsx";
import SectionHeader from "./SectionHeader.jsx";
import {
  cardHover,
  defaultViewport,
  fadeInSoft,
  fadeInUp,
  staggerContainer,
} from "../motion/variants.js";

const REVIEWS = [
  { name: "Karthi", role: "Wedding Choreo Client", quote: "Perfect choreography for my sister's wedding!" },
  { name: "Stephan", role: "Hip Hop Beginner", quote: "From zero to performing in 3 months!" },
  { name: "Babu", role: "Parent", quote: "My daughter loves the kids batch!" },
  { name: "Godjeni", role: "College Student", quote: "Best place for contemporary in Chennai" },
  { name: "Rickson", role: "Zumba Enthusiast", quote: "Fun workouts that actually work!" },
  { name: "Akash", role: "Competition Team", quote: "Won regional championship thanks to AS Dance" },
  { name: "Arun", role: "Bollywood Fan", quote: "Living my reel dreams here!" },
  { name: "Wifread", role: "Office Event", quote: "Team building that was actually fun!" },
];

export default function ReviewsSection() {
  const prefersReducedMotion = useReducedMotion();
  const gridViewport = { ...defaultViewport, amount: 0.2 };

  return (
    <section id="reviews" className="section-shell section-shell--tight reviews-section" aria-labelledby="reviews-title">
      <div className="container-max">
        <ScrollReveal className="reviews-section__heading" variant={fadeInSoft}>
          <SectionHeader
            eyebrow="Community Proof"
            title={
              <span id="reviews-title">
                Real Students, <span className="display-accent">Real Results</span>
              </span>
            }
            description="Don't just take our word for it. See how AS Dance is helping beginners, performers, families, and event teams move with confidence."
          />
        </ScrollReveal>

        <m.div
          className="reviews-grid"
          variants={staggerContainer(prefersReducedMotion ? 0.08 : 0.14, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={gridViewport}
        >
          {REVIEWS.map((review, index) => {
            const accent = index % 3 === 0 ? "gold" : index % 3 === 1 ? "" : "red";

            return (
              <m.div
                key={`${review.name}-${review.role}`}
                variants={fadeInUp}
                whileHover={prefersReducedMotion ? undefined : cardHover}
              >
                <ReviewCard {...review} accent={accent} />
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}

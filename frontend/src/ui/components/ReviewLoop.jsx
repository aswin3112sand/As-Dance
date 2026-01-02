import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Star } from "../icons.jsx";
import w1 from "../../assets/bg/w1.webp";
import w2 from "../../assets/bg/w2.webp";
import w3 from "../../assets/bg/w3.webp";
import w4 from "../../assets/bg/w4.webp";
import w5 from "../../assets/bg/w5.webp";
import w6 from "../../assets/bg/w6.webp";
import w7 from "../../assets/bg/w7.webp";
import w8 from "../../assets/bg/w8.webp";
import w9 from "../../assets/bg/w9.webp";
import w10 from "../../assets/bg/w10.webp";
import w11 from "../../assets/bg/w11.webp";
import w12 from "../../assets/bg/w12.webp";
import w13 from "../../assets/bg/w13.webp";
import w14 from "../../assets/bg/w14.webp";
import w15 from "../../assets/bg/w15.webp";
import w16 from "../../assets/bg/w16.webp";

const PROFILE_IMAGES = [
  w1, w2, w3, w4,
  w5, w6, w7, w8,
  w9, w10, w11, w12,
  w13, w14, w15, w16
];

const REVIEWS = [
  { id: 1, name: "Karthi", profileIndex: 0, tagline: "AS DANCE Learner", txt: "639 steps for ₹499? Bro this is insane value. So much work for such a low price. Lifetime access vera level. Worth every rupee." },
  { id: 2, name: "Stephan", profileIndex: 1, tagline: "AS DANCE Learner", txt: "Each step pirichu clear explanation kuduthadhu romba useful bro. Ippo practice panna easy ah irukku. Best bundle I’ve seen." },
  { id: 3, name: "Babu", profileIndex: 2, tagline: "AS DANCE Learner", txt: "I bought for my cousin. Avan daily practice panran. He said dance improve aagiduchu bro. Super investment." },
  { id: 4, name: "Godjeni", profileIndex: 3, tagline: "AS DANCE Learner", txt: "Friend oda marriage function ku steps theda kastama irundhuchu. Indha bundle la ready steps irundhadhu big help bro!" },
  { id: 5, name: "Rickson", profileIndex: 4, tagline: "AS DANCE Learner", txt: "Dance competition ku prepare aagum podhu idhu game changer bro. Hard steps um structured ah irundhuchu. I won thanks to this." },
  { id: 6, name: "Akash", profileIndex: 5, tagline: "AS DANCE Learner", txt: "Bundle improve pannuna speed romba nalla irukku. Medium steps training ku perfect. Price ku mela value." },
  { id: 7, name: "Arun", profileIndex: 6, tagline: "AS DANCE Learner", txt: "I used this for my friend’s sangeet night. 639 steps la choice panna neraya options. Crowd impress bro!" },
  { id: 8, name: "Wifread", profileIndex: 7, tagline: "AS DANCE Learner", txt: "Video quality and step breakdown vera level clarity bro. Lifetime access naala stress illa. Slowly learn pannalam." },
  { id: 9, name: "Akish", profileIndex: 8, tagline: "AS DANCE Learner", txt: "This bundle improved my dance skills a lot bro. 1 year ah progress illaama irundhen. Ippo improvement visible." },
  { id: 10, name: "Vishal", profileIndex: 9, tagline: "AS DANCE Learner", txt: "₹499 ku 639 steps + Tamil explanation + lifetime access… Bro this is underpriced for the work. Respect." },
  { id: 11, name: "Rabi", profileIndex: 10, tagline: "AS DANCE Learner", txt: "Steps pirichu kuduthadhu naala practice smooth bro. Total body posture tips um helpful ah irundhuchu." },
  { id: 12, name: "Rio", profileIndex: 11, tagline: "AS DANCE Learner", txt: "My cousin told me to buy. Bro it really helped me in my college dance event. Easy steps to start, hard steps to grow." },
  { id: 13, name: "Kabi", profileIndex: 12, tagline: "AS DANCE Learner", txt: "I used for my own dance competition. Structured practice plan naala stamina improve bro. No slip steps." },
  { id: 14, name: "PeriyaVijay", profileIndex: 13, tagline: "AS DANCE Learner", txt: "I recommended this to my friend for his marriage dance. Avanum happy. Worth bundle bro." },
  { id: 15, name: "Venkat", profileIndex: 14, tagline: "AS DANCE Learner", txt: "This bundle boosted my confidence bro. Step breakdown naala I don’t feel confused anymore." },
  { id: 16, name: "Starwin", profileIndex: 15, tagline: "AS DANCE Learner", txt: "Bought for my friend’s cousin for competition. Bro it helped him improve fast. Price ku heavy value." }
];
const ANIMATION_STATE_KEY = "as-dance-review-animation-state";

export default function ReviewLoop() {
  const scrollerRef = useRef(null);
  const animationRef = useRef(null);
  const reviews = REVIEWS;
  const [isAnimating, setIsAnimating] = useState(() => {
    const stored = localStorage.getItem(ANIMATION_STATE_KEY);
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem(ANIMATION_STATE_KEY, JSON.stringify(isAnimating));
  }, [isAnimating]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || reviews.length === 0) return;

    const startAnimation = () => {
      if (animationRef.current) animationRef.current.kill();

      const scrollWidth = scroller.scrollWidth;
      const containerWidth = scroller.clientWidth;
      const distance = scrollWidth - containerWidth;

      animationRef.current = gsap.to(scroller, {
        scrollLeft: distance,
        duration: 45,
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          scroller.scrollLeft = 0;
        },
      });

      if (!isAnimating) {
        animationRef.current.pause();
      }
    };

    startAnimation();

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, [reviews, isAnimating]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(".review-fog-layer", {
        opacity: 0.12,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".review-nebula-tl, .review-nebula-br", {
        scale: 1.02,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".reviews-title-glow", {
        opacity: 0.4,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    return () => ctx.revert();
  }, []);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <section id="reviews" className="section review-section bg-reviews section-anim">
      <style>{`
        .review-section {
          position: relative;
          padding: 3.5rem 0;
          background: linear-gradient(180deg, rgba(5, 8, 20, 0.95) 0%, rgba(8, 12, 28, 0.92) 50%, rgba(5, 8, 20, 0.95) 100%);
          overflow: hidden;
          isolation: isolate;
        }

        .review-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            repeating-linear-gradient(0deg, rgba(0, 242, 234, 0.02) 0px, rgba(0, 242, 234, 0.02) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, rgba(0, 242, 234, 0.02) 0px, rgba(0, 242, 234, 0.02) 1px, transparent 1px, transparent 40px),
            radial-gradient(ellipse 120% 50% at 50% 0%, rgba(0, 242, 234, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 100% 60% at 50% 100%, rgba(255, 0, 80, 0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .review-fog-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 40% at 50% 50%, rgba(0, 242, 234, 0.08) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 1;
          opacity: 0.12;
          will-change: opacity;
        }

        .review-nebula-tl {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 242, 234, 0.15) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
          will-change: transform;
        }

        .review-nebula-br {
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 0, 80, 0.12) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
          will-change: transform;
        }

        .reviews-header {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .reviews-title {
          font-family: 'Outfit Condensed', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 1rem 0;
          letter-spacing: -1px;
          text-shadow: 0 0 30px rgba(0, 242, 234, 0.2);
          position: relative;
        }

        .reviews-title-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(0, 242, 234, 0.3) 50%, transparent 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0;
          will-change: opacity;
          pointer-events: none;
        }

        .reviews-subhead {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.65);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
          letter-spacing: 0.3px;
        }

        .review-scroller-wrapper {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0 1rem;
        }

        .review-grid {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 1rem 0;
          scrollbar-width: none;
          flex: 1;
          -webkit-overflow-scrolling: touch;
        }

        .review-grid::-webkit-scrollbar {
          display: none;
        }

        .review-card {
          flex: 0 0 340px;
          min-width: 340px;
          height: 100%;
          background: rgba(10, 18, 25, 0.4);
          border: 1px solid rgba(0, 242, 234, 0.12);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 242, 234, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          will-change: transform, box-shadow, border-color;
        }

        .review-card:hover {
          border-color: rgba(0, 242, 234, 0.4);
          background: rgba(10, 18, 25, 0.6);
          box-shadow: 0 16px 48px rgba(0, 242, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-6px) perspective(1000px) rotateX(2deg) rotateY(2deg);
        }

        .review-card-inner {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
        }

        .review-card-heading {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .review-card-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .review-card-avatar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(0, 242, 234, 0.6), rgba(255, 0, 80, 0.3), rgba(0, 242, 234, 0.6));
          opacity: 0.8;
          animation: ringRotate 8s linear infinite;
          will-change: transform;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .review-card-avatar-img {
          position: relative;
          z-index: 1;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(0, 242, 234, 0.3);
          box-shadow: 0 0 16px rgba(0, 242, 234, 0.2), inset 0 0 8px rgba(0, 242, 234, 0.1);
          display: block;
        }

        .review-card-avatar-label {
          position: absolute;
          bottom: -6px;
          right: -6px;
          background: linear-gradient(135deg, rgba(0, 242, 234, 0.9), rgba(255, 0, 80, 0.7));
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 5px;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 12px rgba(0, 242, 234, 0.4);
          z-index: 2;
        }

        .review-card-name {
          font-family: 'Outfit Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          letter-spacing: -0.3px;
        }

        .review-card-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(0, 242, 234, 0.8);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .review-card-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
          flex: 1;
        }

        .review-card-stars {
          display: flex;
          gap: 0.4rem;
          margin-top: auto;
        }

        .review-card-stars svg {
          color: #FFD700;
          filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.4));
        }

        .review-controls {
          flex-shrink: 0;
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .review-control {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(0, 242, 234, 0.1);
          border: 1.5px solid rgba(0, 242, 234, 0.3);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: rgba(0, 242, 234, 0.8);
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 0 16px rgba(0, 242, 234, 0.1);
          will-change: transform, box-shadow, background;
          padding: 0;
        }

        .review-control:hover {
          background: rgba(0, 242, 234, 0.2);
          border-color: rgba(0, 242, 234, 0.6);
          color: rgba(0, 242, 234, 1);
          box-shadow: 0 0 24px rgba(0, 242, 234, 0.3);
          transform: scale(1.08);
        }

        .review-control:active {
          transform: scale(0.96);
        }

        .review-control.active {
          background: rgba(0, 242, 234, 0.25);
          border-color: rgba(0, 242, 234, 0.8);
          color: rgba(0, 242, 234, 1);
          box-shadow: 0 0 32px rgba(0, 242, 234, 0.4);
        }

        @media (max-width: 768px) {
          .review-section {
            padding: 3.5rem 0;
          }

          .reviews-title {
            font-size: 2rem;
            letter-spacing: -0.5px;
          }

          .reviews-subhead {
            font-size: 0.9rem;
          }

          .review-card {
            flex: 0 0 300px;
            min-width: 300px;
            padding: 1.5rem;
          }

          .review-scroller-wrapper {
            gap: 1rem;
            padding: 0 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .review-section {
            padding: 2.5rem 0;
          }

          .reviews-title {
            font-size: 1.5rem;
          }

          .review-card {
            flex: 0 0 280px;
            min-width: 280px;
            padding: 1.25rem;
          }

          .review-control {
            width: 44px;
            height: 44px;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="review-fog-layer" />
      <div className="review-nebula-tl" />
      <div className="review-nebula-br" />

      <div className="container-max">
        <div className="reviews-header">
          <h2 className="reviews-title">
            User Reviews & Stage Feedback
            <span className="reviews-title-glow">User Reviews & Stage Feedback</span>
          </h2>
          <p className="reviews-subhead">
            639-Step curriculum trusted by stage performers. Real feedback from competition dancers and
            audience-impact routines.
          </p>
        </div>

        <div className="review-scroller-wrapper">
          <div className="review-grid" ref={scrollerRef}>
            {reviews.map((review, idx) => {
              const profile = PROFILE_IMAGES[review.profileIndex % PROFILE_IMAGES.length];
              return (
                <article key={`review-${review.id}`} className="review-card">
                  <div className="review-card-inner">
                    <div className="review-card-heading">
                      <div className="review-card-avatar">
                        <div className="review-card-avatar-ring" />
                        <img
                          src={profile}
                          alt="AS DANCE learner"
                          loading="lazy"
                          decoding="async"
                          width="56"
                          height="56"
                          className="review-card-avatar-img"
                        />
                        <span className="review-card-avatar-label">{`#${review.id}`}</span>
                      </div>
                      <div>
                        <p className="review-card-name">{review.name}</p>
                        <p className="review-card-tagline">{review.tagline}</p>
                      </div>
                    </div>

                    <p className="review-card-text">"{review.txt}"</p>

                    <div className="review-card-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="review-controls">
            <button
              className={`review-control ${isAnimating ? "active" : ""}`}
              onClick={toggleAnimation}
              title={isAnimating ? "Stop animation" : "Start animation"}
              type="button"
              aria-label={isAnimating ? "Stop animation" : "Start animation"}
            >
              {isAnimating ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

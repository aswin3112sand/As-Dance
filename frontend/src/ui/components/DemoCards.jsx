import React, { useMemo } from "react";
import t10 from "../../assets/bg/t10.webp";
import t12 from "../../assets/bg/t12.webp";
import t16 from "../../assets/bg/t16.webp";
import t5 from "../../assets/bg/t5.webp";
import t14 from "../../assets/bg/t14.webp";
import t18 from "../../assets/bg/t18.webp";

const DEMO_THUMBS = [
  [t10, t12, t16, t5],
  [t14, t18, t5, t16],
  [t14, t14, t14, t14],
  [t12, t12, t12, t12]
];

const DEFAULT_DEMO_LINKS = [
  "https://drive.google.com/uc?export=download&id=1CsFWUhFZJk8Y0nsuWHYYiY_2a9g3U6xK",
  "https://drive.google.com/uc?export=download&id=1BPMWXzPvsDl5b6HTkVV8Ki4qGD2cSLl7",
  "https://drive.google.com/uc?export=download&id=1OrR392BpNAJEnaNcpI4p8UTC8uuzb0_V",
  "https://drive.google.com/uc?export=download&id=1LhTBZCCFSl2G06pCceKbXJes41Tzn4Wx"
];

const normalizeDemoUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^drive\.google\.com\//i.test(trimmed)) return `https://${trimmed}`;
    return null;
  }
  if (typeof value === "object") {
    return normalizeDemoUrl(value.url || value.link || value.href);
  }
  return null;
};

export default function DemoCards({ demos }) {
  const items = useMemo(() => {
    const fallback = DEFAULT_DEMO_LINKS;
    let fromApi = null;
    if (demos && !Array.isArray(demos)) {
      fromApi = [demos.demo1, demos.demo2, demos.demo3, demos.demo4];
    } else if (Array.isArray(demos) && demos.length) {
      fromApi = demos;
    }
    if (!fromApi) return fallback;
    const normalized = Array.from({ length: 4 }, (_, idx) => normalizeDemoUrl(fromApi[idx]));
    return normalized.map((item, idx) => item || fallback[idx] || null);
  }, [demos]);

  return (
    <div className="grid-4 demo-grid">
      {items.map((url, idx) => {
        const disabled = !url;
        const thumb = DEMO_THUMBS[idx][idx % 4];
        return (
          <div key={`demo-${idx}`} className={`demo-card card-3d card-float card-anim ${disabled ? "is-disabled" : ""}`}>
            <div className="shine-effect" aria-hidden="true"></div>

            <div className="demo-thumb position-relative">
              <img
                src={thumb}
                alt={`Demo preview ${idx + 1}`}
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
                className="w-100 h-auto d-block"
              />
              <div className="demo-overlay">
                <span className="demo-chip">Dance Short Video {idx + 1}</span>
              </div>
            </div>
            <div className="demo-content p-3">
              <div className="demo-title h6 fw-bold mb-1">Each Step Declare -Easy/Med/Hard.</div>
              <div className="demo-subtitle small text-muted mb-3">4-Level Demo View</div>
              {disabled ? (
                <span
                  className="btn btn-neon btn-sm w-100 z-1 position-relative demo-cta is-disabled"
                  aria-disabled="true"
                >
                  Preview
                </span>
              ) : (
                <a
                  className="btn btn-neon btn-sm w-100 z-1 position-relative demo-cta"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

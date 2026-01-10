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

const DRIVE_PREVIEW_BASE = "https://drive.google.com/file/d/";

const DEFAULT_DEMO_LINKS = [
  `${DRIVE_PREVIEW_BASE}1dkL6iaRXUeun2_HuO1tUVuRO-mljaHTX/preview`,
  `${DRIVE_PREVIEW_BASE}1BVU36dGDBsn5Xh8dROo03LDo2VQga8MU/preview`,
  `${DRIVE_PREVIEW_BASE}1m3kWgB6fY4a0mW7UKhka0N6lmGL-sfX3/preview`,
  `${DRIVE_PREVIEW_BASE}1Xn5B0pgojpFT3Yzy9Ei3TmGIr1VXRDWp/preview`
];

const extractDriveId = (value) => {
  const fileMatch = value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch) return fileMatch[1];
  const idMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idMatch) return idMatch[1];
  return null;
};

const toPreviewUrl = (fileId) => `${DRIVE_PREVIEW_BASE}${fileId}/preview`;

const normalizeDemoUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return toPreviewUrl(trimmed);
    if (/^https?:\/\//i.test(trimmed)) {
      const driveId = extractDriveId(trimmed);
      return driveId ? toPreviewUrl(driveId) : trimmed;
    }
    if (/^drive\.google\.com\//i.test(trimmed)) {
      const withProtocol = `https://${trimmed}`;
      const driveId = extractDriveId(withProtocol);
      return driveId ? toPreviewUrl(driveId) : withProtocol;
    }
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

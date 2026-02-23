import React, { useMemo } from "react";
import { Play } from "../icons.jsx";
import Reveal from "./Reveal.jsx";
import t10 from "../../assets/bg/t10.webp";
import t12 from "../../assets/bg/t12.webp";
import t16 from "../../assets/bg/t16.webp";
import t14 from "../../assets/bg/t14.webp";

const DEMO_THUMBS = [t10, t12, t16, t14];
const DRIVE_PREVIEW_BASE = "https://drive.google.com/file/d/";

const DEFAULT_DEMO_LINKS = [
  `${DRIVE_PREVIEW_BASE}1dkL6iaRXUeun2_HuO1tUVuRO-mljaHTX/preview`,
  `${DRIVE_PREVIEW_BASE}1BVU36dGDBsn5Xh8dROo03LDo2VQga8MU/preview`,
  `${DRIVE_PREVIEW_BASE}1m3kWgB6fY4a0mW7UKhka0N6lmGL-sfX3/preview`,
  `${DRIVE_PREVIEW_BASE}1Xn5B0pgojpFT3Yzy9Ei3TmGIr1VXRDWp/preview`,
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {items.slice(0, 3).map((url, idx) => {
        const disabled = !url;
        const thumb = DEMO_THUMBS[idx % DEMO_THUMBS.length];

        return (
          <Reveal
            key={`demo-${idx}`}
            delay={idx * 0.06}
            className="rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6"
          >
            <div className="relative overflow-hidden rounded-xl border border-blue-500/20">
              <img
                src={thumb}
                alt={`Sample lesson ${idx + 1}`}
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
                className="aspect-video w-full object-cover object-center"
              />
              <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1220] text-[#3B82F6] border border-blue-500/30">
                <Play size={16} />
              </span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-white">Sample Lesson {idx + 1}</h3>
            <p className="mt-2 text-gray-300 leading-relaxed">Step-by-step explanation with beginner-friendly pacing.</p>

            {disabled ? (
              <span className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-slate-600 bg-slate-900/70 text-gray-400">
                Preview unavailable
              </span>
            ) : (
              <a
                className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#3B82F6] px-4 text-white font-semibold transition hover:scale-[1.02]"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Sample Lesson
              </a>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

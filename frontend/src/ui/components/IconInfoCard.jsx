import React, { memo } from "react";
import Reveal from "./Reveal.jsx";

function IconInfoCard({ icon: Icon, title, description, delay = 0, className = "" }) {
  return (
    <Reveal delay={delay} className={className}>
      <article className="h-full rounded-2xl border border-blue-500/25 bg-[#0F172A] p-6 md:p-8 transition duration-300 hover:-translate-y-1">
        <div className="flex items-start gap-6">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
            <Icon size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="m-0 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-gray-300">{description}</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default memo(IconInfoCard);

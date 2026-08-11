"use client";

import { useId, useState } from "react";

/**
 * Collapsible long-form bio for a founder card. The short bio stays visible in
 * the panel; this holds the personal story so one founder's long text does not
 * blow out the two-column grid.
 */
export function FounderStory({
  paragraphs,
  moreLabel,
  lessLabel,
}: {
  paragraphs: string[];
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (paragraphs.length === 0) return null;

  return (
    <div className="founder-story">
      <button
        type="button"
        className="founder-story__toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open ? lessLabel : moreLabel}</span>
        <svg
          className="founder-story__chevron"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M3.5 5.25 7 8.75l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div id={id} className="founder-story__body" hidden={!open}>
        {paragraphs.map((p) => (
          <p key={p} className="founder-story__p">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

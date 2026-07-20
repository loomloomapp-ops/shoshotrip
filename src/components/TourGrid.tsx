"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { type Tour } from "@/content/tours";
import { TourCard } from "@/components/TourCard";
import { Reveal } from "@/components/Reveal";

interface TourGridProps {
  tours: Tour[];
  locale: Locale;
}

type ActivityFilter = "all" | Tour["activity"];

export function TourGrid({ tours, locale }: TourGridProps) {
  const dict = getDict(locale);
  const f = dict.toursSection.filters;

  const [activity, setActivity] = useState<ActivityFilter>("all");

  // Centered pill tabs, mirroring the reference template's package filter row.
  const tabs: { key: ActivityFilter; label: string }[] = [
    { key: "all", label: f.all },
    { key: "nature", label: locale === "ua" ? "Природа" : "Nature" },
    { key: "trekking", label: locale === "ua" ? "Трекінг" : "Trekking" },
    { key: "culture", label: locale === "ua" ? "Культура" : "Culture" },
    { key: "balanced", label: locale === "ua" ? "Баланс" : "Balanced" },
  ];

  const filtered = tours.filter((t) => activity === "all" || t.activity === activity);

  return (
    <div>
      <div className="pkg-tabs" role="tablist" aria-label={f.activity}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`pkg-tab${activity === tab.key ? " is-active" : ""}`}
            onClick={() => setActivity(tab.key)}
            aria-pressed={activity === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-3 tour-grid tours-section__grid">
          {filtered.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.08}>
              <TourCard tour={t} locale={locale} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="tour-empty">
          <h3>{dict.toursSection.empty.title}</h3>
          <p className="lead">{dict.toursSection.empty.text}</p>
          <button type="button" className="btn btn--ghost" onClick={() => setActivity("all")}>
            {f.reset}
          </button>
        </div>
      )}
    </div>
  );
}

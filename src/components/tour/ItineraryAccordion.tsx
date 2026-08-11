"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { loc, type ItineraryDay } from "@/content/tours";
import { Plus, Minus } from "@/components/Icons";

interface ItineraryAccordionProps {
  days: ItineraryDay[];
  /** Tour gallery, used for a day photo whenever the day has no own `photo`. */
  gallery: string[];
  locale: Locale;
}

/**
 * Day-by-day itinerary as an FAQ-style accordion: the collapsed row keeps the
 * old plan-chart reading (Day N — title — route), and opening one reveals the
 * day's short description, a photo, and the per-day facts that already live in
 * tours.ts (travel time, effort, meals, overnight) but were never surfaced.
 *
 * Day 1 starts open so the block never reads as an inert list of headers.
 */
export function ItineraryAccordion({ days, gallery, locale }: ItineraryAccordionProps) {
  const t = getDict(locale).tourPage;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="td-days">
      {days.map((day, i) => {
        const isOpen = open === i;
        const photo = day.photo ?? gallery[i % gallery.length];
        const facts: Array<[string, string]> = [
          [t.dayRoute, loc(day.route, locale)],
          [t.dayTransfer, loc(day.transferTime, locale)],
          [t.dayLoad, loc(day.load, locale)],
          [t.dayMeals, loc(day.meals, locale)],
          [t.dayStay, loc(day.stay, locale)],
        ];

        return (
          <li key={i} className={`td-day${isOpen ? " is-open" : ""}`}>
            <h4 className="td-day__head">
              <button
                type="button"
                className="td-day__trigger"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="td-day__n">
                  {t.day} {i + 1}
                </span>
                <span className="td-day__text">
                  {loc(day.title, locale)}
                  <span className="td-day__route"> — {loc(day.route, locale)}</span>
                </span>
                <span className="td-day__icon" aria-hidden="true">
                  {isOpen ? <Minus width={18} height={18} /> : <Plus width={18} height={18} />}
                </span>
              </button>
            </h4>

            <div className={`td-day__panel${isOpen ? " is-open" : ""}`}>
              <div className="td-day__panel-inner">
                <div className="td-day__media">
                  <Image
                    src={photo}
                    alt={loc(day.title, locale)}
                    fill
                    className="td-day__img"
                    sizes="(max-width: 767px) 100vw, 320px"
                  />
                </div>

                <div className="td-day__body">
                  <p className="td-day__desc">{loc(day.activities, locale)}</p>
                  {day.note && <p className="td-day__note">{loc(day.note, locale)}</p>}
                  <dl className="td-day__facts">
                    {facts.map(([label, value]) => (
                      <div key={label} className="td-day__fact">
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

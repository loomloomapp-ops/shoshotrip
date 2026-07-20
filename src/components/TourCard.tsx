"use client";

import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { loc, type Tour } from "@/content/tours";
import { track } from "@/lib/analytics";
import { ArrowUpRight, Users, Gauge, MapPin } from "@/components/Icons";

const statusClass: Record<Tour["status"], string> = {
  available: "pill--available",
  last: "pill--last",
  recruiting: "pill--recruiting",
  soldout: "pill--soldout",
  soon: "pill--soon",
};

/**
 * Compact tour card — only the essentials (location, name, seats left,
 * activity level). Everything else lives on the tour page. The whole card is a
 * single link to keep the markup flat and the tap target large.
 */
export function TourCard({ tour, locale }: { tour: Tour; locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.toursSection.card;
  const href = localePath(locale, `tours/${tour.slug}`);
  const statusLabel = dict.availability[tour.status];
  const difficultyLabel = dict.tourPage.difficultyLevels[tour.difficulty - 1];
  const showSeats = tour.status !== "soldout" && tour.status !== "soon";

  return (
    <Link
      href={href}
      className="tour-card"
      aria-label={loc(tour.name, locale)}
      onClick={() => track("tour_card_click", { tour: tour.slug })}
    >
      <div className="tour-card__media">
        <Image
          src={tour.gallery[0]}
          alt={loc(tour.name, locale)}
          width={1200}
          height={900}
          className="tour-card__img"
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
        />
        <span className={`pill ${statusClass[tour.status]} tour-card__status`}>
          <span className="pill__dot" /> {statusLabel}
        </span>
        <span className="tour-card__loc">
          <MapPin width={14} height={14} />
          <span>{loc(tour.country, locale)} · {loc(tour.region, locale)}</span>
        </span>
        <span className="tour-card__go" aria-hidden>
          <ArrowUpRight width={16} height={16} />
        </span>
      </div>

      <div className="tour-card__body">
        <h3 className="tour-card__title">{loc(tour.name, locale)}</h3>

        <div className="tour-card__facts">
          {showSeats && (
            <span className="tour-fact">
              <Users width={15} height={15} />
              <span><strong>{tour.seatsLeft}</strong> {t.seatsLeft}</span>
            </span>
          )}
          <span className="tour-fact">
            <Gauge width={15} height={15} />
            <span>{difficultyLabel}</span>
            <span className="level-meter" aria-hidden>
              {[1, 2, 3, 4].map((n) => (
                <i key={n} className={n <= tour.difficulty ? "is-on" : ""} />
              ))}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

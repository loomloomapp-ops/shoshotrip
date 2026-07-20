"use client";

import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { loc, type Tour } from "@/content/tours";
import { track } from "@/lib/analytics";
import { ArrowUpRight } from "@/components/Icons";

const statusClass: Record<Tour["status"], string> = {
  available: "pill--available",
  last: "pill--last",
  recruiting: "pill--recruiting",
  soldout: "pill--soldout",
  soon: "pill--soon",
};

/**
 * Tripvana "packages" card — image with a status badge, then name + price row,
 * short description and a "Book tour" CTA. One-to-one with the reference
 * template's package grid, wired to the real localized tour data.
 */
export function PackageCard({ tour, locale }: { tour: Tour; locale: Locale }) {
  const dict = getDict(locale);
  const href = localePath(locale, `tours/${tour.slug}`);
  const statusLabel = dict.availability[tour.status];
  const price = `${tour.currency}${tour.price.toLocaleString(locale === "ua" ? "uk-UA" : "en-US")} / ${tour.durationDays} ${dict.toursSection.card.days}`;

  return (
    <Link
      href={href}
      className="pkg-card"
      aria-label={loc(tour.name, locale)}
      onClick={() => track("tour_card_click", { tour: tour.slug })}
    >
      <div className="pkg-card__media">
        <Image
          src={tour.gallery[0]}
          alt={loc(tour.name, locale)}
          width={1200}
          height={900}
          className="pkg-card__img"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <span className={`pkg-card__badge ${statusClass[tour.status]}`}>{statusLabel}</span>
      </div>

      <div className="pkg-card__detail">
        <div className="pkg-card__top">
          <h3 className="pkg-card__name">{loc(tour.name, locale)}</h3>
          <span className="pkg-card__price">{price}</span>
        </div>
        <p className="pkg-card__desc">{loc(tour.shortDescription, locale)}</p>
        <span className="btn btn--ghost btn--sm pkg-card__cta">
          {dict.nav.chooseTour}
          <span className="btn__icon"><ArrowUpRight width={14} height={14} /></span>
        </span>
      </div>
    </Link>
  );
}

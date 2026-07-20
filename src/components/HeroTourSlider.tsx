"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { loc, type Tour } from "@/content/tours";
import { getDict } from "@/content/dictionaries";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

/**
 * Horizontal card slider pinned to the bottom of the hero (Tripvana-style).
 * Arrows scroll the track one card at a time; the progress bar reflects how
 * much of the list is revealed, and each arrow disables at its edge.
 */
export function HeroTourSlider({ tours, locale }: { tours: Tour[]; locale: Locale }) {
  const dict = getDict(locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;
    // Fraction of the list revealed (starts partial, like the reference).
    setProgress(el.scrollWidth > 0 ? (x + el.clientWidth) / el.scrollWidth : 1);
    setAtStart(x <= 2);
    setAtEnd(x >= max - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".hero-slide");
    const gap = 14;
    const amount = (card?.offsetWidth ?? 300) + gap;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="hero-slider">
      <div className="hero-slider__track" ref={trackRef}>
        {tours.map((tour) => (
          <Link
            key={tour.id}
            href={localePath(locale, `tours/${tour.slug}`)}
            className="hero-slide"
          >
            <div className="hero-slide__media">
              <Image
                src={tour.gallery[0]}
                alt={loc(tour.name, locale)}
                width={520}
                height={300}
                className="hero-slide__img"
                sizes="440px"
              />
              <span className="hero-slide__price">
                {dict.hero.slider.from} {tour.currency}{tour.price.toLocaleString("uk-UA")}
              </span>
            </div>
            <div className="hero-slide__foot">
              <span className="hero-slide__name">
                {loc(tour.region, locale)}, {loc(tour.country, locale)}
              </span>
              <span className="hero-slide__arrow">
                <ArrowUpRightSmall />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hero-slider__nav">
        <div className="hero-slider__progress" aria-hidden="true">
          <span
            className="hero-slider__progress-fill"
            style={{ width: `${Math.min(100, Math.max(12, progress * 100))}%` }}
          />
        </div>
        <div className="hero-slider__arrows">
          <button type="button" onClick={() => step(-1)} aria-label={dict.reviews.prev} disabled={atStart}>
            <ArrowLeft width={18} height={18} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={dict.reviews.next} disabled={atEnd}>
            <ArrowRight width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRightSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

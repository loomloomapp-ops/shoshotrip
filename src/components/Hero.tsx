"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { withBreaks } from "@/lib/text";
import { getAllTours } from "@/content/tours";
import { HeroTourSlider } from "@/components/HeroTourSlider";
import { ArrowUpRight, Star } from "@/components/Icons";
import { heroPoster, heroPosterPortrait, heroVideoMp4, heroVideoWebm } from "@/content/media";

/**
 * Hero: full-bleed video/image background with a centered headline + single
 * CTA (white pill + lime accent circle), a frosted rating card pinned to the
 * bottom-left, and a horizontal destination slider pinned to the bottom-right.
 * Composition mirrors the Tripvana reference; content + palette are ShoSho's.
 * OWNER: add /public/media/hero.mp4 (+ .webm) and point media.ts at them to
 * enable video; until then the landscape poster is the background on its own.
 */
const HERO_POSTER = heroPoster;
const HERO_POSTER_PORTRAIT = heroPosterPortrait;
const HERO_VIDEO_MP4 = heroVideoMp4;
const HERO_VIDEO_WEBM = heroVideoWebm;
const HAS_HERO_VIDEO = Boolean(HERO_VIDEO_MP4 || HERO_VIDEO_WEBM);

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [videoOk, setVideoOk] = useState(true);
  const tours = getAllTours().slice(0, 5);
  const toursHref = localePath(locale, "tours");

  return (
    <section className="hero" aria-label={dict.hero.title}>
      <div className="hero__bg">
        {/* The photo is the base layer so the correct crop is picked by the
            browser on first paint (a <video poster> can only carry one image).
            The video, when present, simply covers it. */}
        <picture>
          <source media="(max-width: 767px)" srcSet={HERO_POSTER_PORTRAIT} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero__media"
            src={HERO_POSTER}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
        </picture>
        {HAS_HERO_VIDEO && videoOk ? (
          <video
            className="hero__media hero__media--video"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onError={() => setVideoOk(false)}
            aria-hidden="true"
          >
            {HERO_VIDEO_WEBM ? <source src={HERO_VIDEO_WEBM} type="video/webm" /> : null}
            {HERO_VIDEO_MP4 ? <source src={HERO_VIDEO_MP4} type="video/mp4" /> : null}
          </video>
        ) : null}
        <div className="hero__scrim" />
      </div>

      <div className="container hero__top on-dark">
        <h1 className="hero__title">{withBreaks(dict.hero.title)}</h1>
        <div className="hero__actions">
          <Link href={toursHref} className="cta cta--lg" aria-label={dict.hero.cta}>
            <span className="cta__label">{dict.hero.cta}</span>
            <span className="cta__go" aria-hidden="true">
              <ArrowUpRight width={18} height={18} />
            </span>
          </Link>
        </div>
      </div>

      <div className="hero__bottom">
        <div className="hero-rating on-dark">
          <div className="hero-rating__head">
            <span className="hero-rating__brand">{dict.hero.rating.label}</span>
            <span className="hero-rating__divider" aria-hidden="true" />
            <span className="hero-rating__score">{dict.hero.rating.score}</span>
          </div>
          <div className="hero-rating__stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} width={18} height={18} />
            ))}
          </div>
          <span className="hero-rating__note">{dict.hero.rating.note}</span>
        </div>

        <HeroTourSlider tours={tours} locale={locale} />
      </div>
    </section>
  );
}

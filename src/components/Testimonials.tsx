"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { reviews as allReviews, getReviewText, type Review } from "@/content/reviews";
import { loc } from "@/content/tours";
import { withBreaks } from "@/lib/text";
import { Reveal } from "@/components/Reveal";
import { Star, Instagram, Play } from "@/components/Icons";

type Tab = "video" | "text";

/**
 * Reviews — split by format with a pill toggle (Tourvia reference): a "Video
 * reviews" tab shows tall portrait cards with a play button and a glass name
 * strip, and a "Text reviews" tab shows written testimonials as quote cards.
 */
export function Testimonials({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.reviews;

  const { video, text } = useMemo(() => {
    return {
      video: allReviews.filter((r) => r.kind === "video"),
      text: allReviews.filter((r) => r.kind !== "video"),
    };
  }, []);

  const [tab, setTab] = useState<Tab>("video");
  const active = tab === "video" ? video : text;

  return (
    <section className="section section--tint" id="reviews">
      <div className="container">
        <Reveal className="section-head section-head--center">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 style={{ textAlign: "center" }}>{withBreaks(t.title)}</h2>
          <div className="reviews__rating" aria-label="5.0">
            <div className="reviews__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} width={18} height={18} />
              ))}
            </div>
            <strong>5.0</strong>
          </div>
        </Reveal>

        <Reveal className="reviews-tabs" delay={0.05}>
          <div className="reviews-tabs__track" role="tablist" aria-label={t.title}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "video"}
              className={`reviews-tabs__btn${tab === "video" ? " is-active" : ""}`}
              onClick={() => setTab("video")}
            >
              {t.tabs.video}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "text"}
              className={`reviews-tabs__btn${tab === "text" ? " is-active" : ""}`}
              onClick={() => setTab("text")}
            >
              {t.tabs.text}
            </button>
          </div>
        </Reveal>

        {active.length === 0 ? (
          <p className="reviews-empty">{t.empty}</p>
        ) : (
          <div className={`reviews-panel reviews-panel--${tab}`} key={tab} role="tabpanel">
            {tab === "video"
              ? video.map((r) => <VideoCard key={r.id} r={r} t={t} />)
              : text.map((r) => <TextCard key={r.id} r={r} locale={locale} t={t} />)}
          </div>
        )}
      </div>
    </section>
  );
}

type ReviewsDict = ReturnType<typeof getDict>["reviews"];

function VideoCard({ r, t }: { r: Review; t: ReviewsDict }) {
  const card = (
    <article className="rev-vid">
      <img
        className="rev-vid__img"
        src={r.poster ?? r.photo}
        alt={r.name}
        width={520}
        height={720}
        loading="lazy"
      />
      <span className="rev-vid__scrim" aria-hidden="true" />
      <div className="rev-vid__bar">
        <img className="rev-vid__avatar" src={r.photo} alt="" width={40} height={40} loading="lazy" />
        <div className="rev-vid__meta">
          <strong>{r.name}</strong>
          {r.date && <span>{r.date}</span>}
        </div>
        <span className="rev-vid__play" aria-hidden="true">
          <Play width={20} height={20} />
        </span>
      </div>
    </article>
  );

  return r.video ? (
    <a
      className="rev-vid__link"
      href={r.video}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t.formats.video} · ${r.name}`}
    >
      {card}
    </a>
  ) : (
    card
  );
}

function TextCard({ r, locale, t }: { r: Review; locale: Locale; t: ReviewsDict }) {
  const body = getReviewText(r, locale);
  return (
    <article className="rev-txt">
      <div className="rev-txt__stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} width={15} height={15} />
        ))}
      </div>
      <p className="rev-txt__quote">{body}</p>
      <footer className="rev-txt__author">
        <img className="rev-txt__avatar" src={r.photo} alt="" width={44} height={44} loading="lazy" />
        <div className="rev-txt__meta">
          <strong>{r.name}</strong>
          <span>{loc(r.tour, locale)}</span>
        </div>
        {r.instagram && (
          <a
            className="rev-txt__ig"
            href={r.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.profile}
          >
            <Instagram width={18} height={18} />
          </a>
        )}
      </footer>
    </article>
  );
}

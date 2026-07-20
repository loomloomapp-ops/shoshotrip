"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { Reveal } from "@/components/Reveal";
import { Sunrise, Mountain, Globe, Users, Heart, Camera, ArrowUpRight } from "@/components/Icons";
import { whyScene } from "@/content/media";

/** Icons paired to the six advantages, in order. */
const CARD_ICONS = [Sunrise, Mountain, Globe, Users, Heart, Camera] as const;

// Vertical sweep (Tourvia "why choose us" mechanic): a column of cards on the
// right rises bottom-to-top past the pinned image. Gap between consecutive
// cards, as a fraction of viewport height. Sized so the taller cards keep a
// clean gap: the active card sits upright while the next peeks in from below.
const VSTEP = 0.34;

/**
 * "Why ShoSho Trip" — reproduces the Tourvia vertical card sweep. The scene
 * image stays pinned while a stack of cards scrolls straight up its right side:
 * the active card sits upright and opaque, the next waits just below softly
 * faded, and each rises from the bottom to the active slot then leaves off the
 * top as scroll advances. Design/content are ShoSho's; only the motion mirrors
 * the reference. Mobile / reduced-motion get a static column.
 */
export function WhyUs({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.why;
  const cards = t.cards;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardEls = useRef<Array<HTMLElement | null>>([]);
  const [animated, setAnimated] = useState(false);

  // Enable the pinned wheel on any viewport with motion allowed (mobile too).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const apply = () => setAnimated(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!animated) return;
    const scroller = scrollRef.current;
    const pinEl = pinRef.current;
    const els = cardEls.current.filter(Boolean) as HTMLElement[];
    if (!scroller || !pinEl || els.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);
    const N = els.length;
    let spacing = Math.round(window.innerHeight * VSTEP);

    // Place one card for a given signed distance `d` from the active slot
    // (0 = active/upright, >0 = below/upcoming, <0 = above/leaving upward).
    const place = (el: HTMLElement, d: number) => {
      const y = d * spacing; // straight vertical: below when d>0, above when d<0
      const ad = Math.abs(d);
      const scale = Math.max(1 - ad * 0.045, 0.85);
      let op: number;
      if (d <= 0) op = Math.max(1 + d * 1.2, 0); // leaving upward → fade out
      else op = Math.max(1 - (d - 0.2) * 0.52, 0.16); // upcoming below → translucent
      if (ad < 0.1) op = 1; // active is fully opaque
      const blur = d > 0.6 ? Math.min((d - 0.6) * 1.6, 3) : 0;
      el.style.transform = `translateY(-50%) translateY(${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      el.style.opacity = op.toFixed(3);
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
      el.style.zIndex = String(100 - Math.round(ad * 10));
    };

    const state = { p: 0 };
    const draw = () => {
      const active = state.p * (N - 1);
      els.forEach((el, i) => place(el, i - active));
    };

    const ctx = gsap.context(() => {
      draw(); // paint the initial frame (first card active)
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: draw,
        scrollTrigger: {
          trigger: scroller,
          start: "top top",
          end: () => "+=" + (N - 1) * Math.round(window.innerHeight * 0.62),
          pin: pinEl,
          pinSpacing: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onRefresh: () => {
            spacing = Math.round(window.innerHeight * VSTEP);
            draw();
          },
        },
      });
    }, scrollRef);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, [animated, cards.length]);

  const stage = (
    <div className="why-stage">
      <Image
        src={whyScene}
        alt="Світанок у горах під час подорожі ShoSho Trip"
        width={1512}
        height={1008}
        sizes="(max-width: 991px) 100vw, 92vw"
        className="why-stage__img"
        priority={false}
      />
      <span className="why-stage__scrim" aria-hidden />

      <div className={`why-cards ${animated ? "why-cards--anim" : "why-cards--static"}`}>
        {cards.map((card, i) => {
          const Icon = CARD_ICONS[i] ?? Sunrise;
          const body = (
            <>
              <span className="why-card__icon" aria-hidden>
                <Icon width={20} height={20} />
              </span>
              <div className="why-card__body">
                <h3 className="why-card__title">{card.title}</h3>
                <p className="why-card__text">{card.text}</p>
              </div>
            </>
          );
          return animated ? (
            <article
              key={card.title}
              className="why-card"
              ref={(el) => {
                cardEls.current[i] = el;
              }}
            >
              {body}
            </article>
          ) : (
            <Reveal key={card.title} as="article" className="why-card" delay={i * 0.06}>
              {body}
            </Reveal>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="section why" id="why">
      <div className="container">
        <div className="section-head section-head--center why-head">
          <Reveal>
            <span className="eyebrow">{t.eyebrow}</span>
          </Reveal>
          <Reveal as="h2" delay={0.05} className="why-title">
            {t.title}
          </Reveal>
          <Reveal as="p" delay={0.12} className="lead why-desc">
            {t.text}
          </Reveal>
          <Reveal delay={0.18} className="why-cta">
            <Link
              href={localePath(locale, "tours")}
              className="cta"
              aria-label={dict.cta.findTrip}
            >
              <span className="cta__label">{dict.cta.findTrip}</span>
              <span className="cta__go" aria-hidden="true">
                <ArrowUpRight width={18} height={18} />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      <div className={`why-scroll${animated ? " is-anim" : ""}`} ref={scrollRef}>
        <div className="why-pin" ref={pinRef}>
          <div className="container">{stage}</div>
        </div>
      </div>
    </section>
  );
}

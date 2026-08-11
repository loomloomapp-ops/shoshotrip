"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  galleryItems,
  galleryInstagram,
} from "@/content/emotionsGallery";
import { Instagram, Play, Pause } from "@/components/Icons";

/**
 * Horizontal media conveyor for the "Emotions" block. Cards ride continuously
 * to the left like a train of wagons and loop seamlessly (the list is rendered
 * twice; scrollLeft wraps by exactly one copy width, so there is no visible
 * jump). The motion pauses on hover, while dragging, when the tab is hidden,
 * and under prefers-reduced-motion.
 *
 * INTERACTION
 * Drag-to-scroll with inertia (mouse) and native touch/trackpad scroll are kept.
 * Videos autoplay muted+loop while visible inside the rail and pause off-view;
 * the first copy carries the manual Play/Pause control (a manual pause is
 * remembered and blocks auto-resume). The second copy is an aria-hidden visual
 * clone for the seamless loop. No animation library.
 */

const SPEED = 0.045; // px per ms (~45px/s) — calm, premium conveyor pace

export function EmotionsRail({
  playLabel = "Play",
  pauseLabel = "Pause",
}: {
  playLabel?: string;
  pauseLabel?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const cloneStartRef = useRef<HTMLElement | null>(null);
  const videosRef = useRef(new Map<number, HTMLVideoElement>());
  /** Indices the user explicitly paused — these never auto-resume. */
  const manualPausedRef = useRef(new Set<number>());
  /** Conveyor pause flags (kept in refs so they never re-render the rail).
      The rail keeps moving on hover by design — only dragging, a hidden tab
      and reduced-motion pause it. */
  const dragRef = useRef(false);
  const reduceRef = useRef(false);
  /** Per-video playing flag, drives the Pause/Play button icon. */
  const [playing, setPlaying] = useState<Record<number, boolean>>({});
  const [inView, setInView] = useState(false);

  const count = galleryItems.length;
  const loopItems = [...galleryItems, ...galleryItems];

  const setPlayFlag = useCallback((idx: number, on: boolean) => {
    setPlaying((s) => (s[idx] === on ? s : { ...s, [idx]: on }));
  }, []);

  /* Reveal the rail once (stagger handled in CSS via --i). */
  useEffect(() => {
    const el = railRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Continuous conveyor: advance scrollLeft each frame and wrap by one copy. */
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduce = () => {
      reduceRef.current = mq.matches;
    };
    applyReduce();
    mq.addEventListener("change", applyReduce);

    let raf = 0;
    let last: number | null = null;

    const frame = (ts: number) => {
      const first = el.firstElementChild as HTMLElement | null;
      const clone = cloneStartRef.current;
      const wrapAt = first && clone ? clone.offsetLeft - first.offsetLeft : 0;

      if (last !== null && wrapAt > 0) {
        const dt = ts - last;
        const paused =
          dragRef.current || reduceRef.current || document.hidden;
        if (!paused) el.scrollLeft += SPEED * dt;
        // Seamless normalization in both directions (also lets drag loop).
        if (el.scrollLeft >= wrapAt) el.scrollLeft -= wrapAt;
        else if (el.scrollLeft < 0) el.scrollLeft += wrapAt;
      }
      last = ts;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", applyReduce);
    };
  }, []);

  /* Autoplay the video(s) inside the rail's visible area; pause off-screen.
     Root = the horizontal scroll container, so horizontal position decides
     visibility. Manual pauses (manualPausedRef) block auto-resume. */
  useEffect(() => {
    const root = railRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          const idx = Number(v.dataset.idx);
          if (e.isIntersecting) {
            if (manualPausedRef.current.has(idx)) return; // user paused: stay
            const p = v.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
            setPlayFlag(idx, true);
          } else if (!v.paused) {
            v.pause();
            setPlayFlag(idx, false); // auto-pause: manual flag untouched
          }
        });
      },
      { root, threshold: 0.5 },
    );

    videosRef.current.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [setPlayFlag]);

  /* Suppress click/navigation that ends a drag gesture. */
  const wasDragged = () => railRef.current?.dataset.moved === "1";

  /* Pause/Play button. Records or clears the manual-pause intent. */
  const onToggle = useCallback(
    (idx: number) => {
      if (wasDragged()) return;
      const v = videosRef.current.get(idx);
      if (!v) return;
      if (v.paused) {
        manualPausedRef.current.delete(idx); // resume + allow auto-resume again
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        setPlayFlag(idx, true);
      } else {
        manualPausedRef.current.add(idx); // remember: do not auto-resume
        v.pause();
        setPlayFlag(idx, false);
      }
    },
    [setPlayFlag],
  );

  /* Drag-to-scroll with inertia (mouse only; touch/trackpad stay native).
     Any pointer press pauses the conveyor and resumes shortly after release. */
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px per ms
    let raf = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    const onDown = (e: PointerEvent) => {
      delete el.dataset.moved; // reset drag-guard on any press (mouse or touch)
      dragRef.current = true; // pause the conveyor while interacting
      if (resumeTimer) clearTimeout(resumeTimer);
      if (e.pointerType !== "mouse") return; // touch = native swipe
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      lastX = e.clientX;
      lastT = e.timeStamp;
      velocity = 0;
      cancelAnimationFrame(raf);
      el.classList.add("is-dragging");
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) el.dataset.moved = "1";
      el.scrollLeft = startLeft - dx;
      const dt = e.timeStamp - lastT || 16;
      velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = e.timeStamp;
      e.preventDefault(); // block text/image selection while dragging
    };

    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        dragRef.current = false;
      }, 900);
    };

    const onUp = () => {
      scheduleResume();
      if (!down) return;
      down = false;
      el.classList.remove("is-dragging");
      let v = velocity * 16; // px per frame
      if (!el.dataset.moved || Math.abs(v) < 0.5) return;
      const decay = 0.94;
      const step = () => {
        el.scrollLeft -= v;
        v *= decay;
        if (Math.abs(v) > 0.4) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const noDrag = (e: Event) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", scheduleResume);
    el.addEventListener("dragstart", noDrag);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", scheduleResume);
      el.removeEventListener("dragstart", noDrag);
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  const onIgClick = (e: React.MouseEvent) => {
    if (wasDragged()) e.preventDefault();
  };

  return (
    <div
      className={`emotions-rail${inView ? " is-in" : ""}`}
      ref={railRef}
      role="list"
      aria-label="ShoSho Trip"
    >
      {loopItems.map((item, i) => {
        const isClone = i >= count;
        return (
          <article
            className={`emotions-card emotions-card--${item.size}${
              item.type === "video" ? " emotions-card--video" : ""
            }`}
            style={{ ["--i" as string]: i }}
            key={i}
            role={isClone ? undefined : "listitem"}
            aria-hidden={isClone || undefined}
            ref={i === count ? (node) => { cloneStartRef.current = node; } : undefined}
          >
            <div className="emotions-card__media">
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={isClone ? "" : item.alt}
                  fill
                  sizes="(max-width: 767px) 82vw, (max-width: 991px) 52vw, 620px"
                  className="emotions-card__img"
                  draggable={false}
                />
              ) : (
                <>
                  {/* The poster also lives as its own layer under the video. A
                      <video> that hands back a blank surface (decoder pressure,
                      a stream the browser will not paint) is transparent, and
                      without this the brand-coloured card background showed
                      through as a flat rectangle. Same URL as the poster
                      attribute, so it costs no extra request. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="emotions-card__img emotions-card__poster"
                    src={item.poster}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                  />
                  <video
                    ref={(node) => {
                      if (node) {
                        node.dataset.idx = String(i);
                        videosRef.current.set(i, node);
                      } else {
                        videosRef.current.delete(i);
                      }
                    }}
                    className="emotions-card__img"
                    poster={item.poster}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    aria-label={isClone ? undefined : item.alt}
                    aria-hidden={isClone || undefined}
                    draggable={false}
                  >
                    {item.srcWebm && <source src={item.srcWebm} type="video/webm" />}
                    <source src={item.src} type="video/mp4" />
                  </video>
                  {!isClone && (
                    <button
                      type="button"
                      className="emotions-card__play"
                      aria-pressed={!!playing[i]}
                      aria-label={playing[i] ? pauseLabel : playLabel}
                      onClick={() => onToggle(i)}
                    >
                      {playing[i] ? (
                        <>
                          <Pause width={13} height={13} />
                          {pauseLabel}
                        </>
                      ) : (
                        <>
                          <Play width={13} height={13} />
                          {playLabel}
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            <a
              className="emotions-card__ig"
              href={galleryInstagram.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onIgClick}
              tabIndex={isClone ? -1 : undefined}
              aria-hidden={isClone || undefined}
            >
              <Instagram width={15} height={15} />
              <span>{galleryInstagram.handle}</span>
            </a>
          </article>
        );
      })}
    </div>
  );
}

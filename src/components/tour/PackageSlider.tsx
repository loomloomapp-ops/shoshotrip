"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Package image slider (Tripvana "package-slider"): a peek carousel of
 * fixed-width slides that bleeds off the right edge, advancing one slide at a
 * time. Circular arrows sit above the slider on the right. Autoplay pauses on
 * hover/focus and is disabled under prefers-reduced-motion.
 */
export function PackageSlider({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = usePrefersReducedMotion();
  const count = images.length;

  const go = useCallback(
    (n: number) => setIndex((n + count) % count),
    [count],
  );

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (reduce || paused || count < 2) return;
    timer.current = setInterval(() => setIndex((p) => (p + 1) % count), 4500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduce, paused, count]);

  // Touch / pointer swipe — drag the images sideways to change slide. The
  // transform track isn't natively scrollable, so we translate a horizontal
  // drag past a threshold into a prev/next step.
  const drag = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || e.pointerType === "mouse") return; // keep desktop on arrows
    drag.current = { x: e.clientX, y: e.clientY, active: true };
    setPaused(true);
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    // Ignore mostly-vertical gestures so page scroll still works.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
    setPaused(false);
  };

  return (
    <div
      className="td-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        className="td-slider__viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="td-slider__track"
          style={{ ["--i" as string]: index }}
        >
          {images.map((src, i) => (
            <div className="td-slide" key={src + i} aria-hidden={i !== index}>
              <Image
                src={src}
                alt={`${alt} — ${i + 1}`}
                width={960}
                height={768}
                priority={i < 2}
                className="td-slide__img"
                sizes="(max-width: 767px) 82vw, 640px"
              />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="td-slider__arrow td-slider__arrow--left"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 25" width="22" height="22" fill="none" aria-hidden="true">
              <path
                d="M14.5 19.5a.5.5 0 0 1-.37-.16l-4.14-4.43A3.5 3.5 0 0 1 9 12.5c0-.92.36-1.78 1-2.42l4.13-4.42a.5.5 0 1 1 .73.68l-4.14 4.43c-.47.47-.72 1.08-.72 1.73s.25 1.26.71 1.72l4.15 4.44a.5.5 0 0 1-.37.84Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            type="button"
            className="td-slider__arrow td-slider__arrow--right"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 25" width="22" height="22" fill="none" aria-hidden="true">
              <path
                d="M10.5 19.5a.5.5 0 0 1-.36-.85l4.14-4.43c.47-.47.72-1.08.72-1.73s-.25-1.26-.71-1.72L10.14 6.34a.5.5 0 1 1 .73-.68l4.14 4.43c.63.63 1 1.49 1 2.41s-.37 1.78-1.01 2.42l-4.14 4.42a.5.5 0 0 1-.36.16Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

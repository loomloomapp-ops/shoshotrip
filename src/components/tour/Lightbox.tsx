"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/lib/hooks";

export type LightboxLabels = {
  close: string;
  prev: string;
  next: string;
};

/**
 * Full-screen image viewer for the tour gallery. Opens from the slider, is
 * rendered into document.body via a portal so the page's transforms and
 * overflow clipping can't crop it. Keyboard: Esc closes, arrows navigate.
 * Touch: horizontal swipe steps through the gallery.
 */
export function Lightbox({
  images,
  alt,
  index,
  onClose,
  onIndexChange,
  labels,
}: {
  images: string[];
  alt: string;
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
  labels: LightboxLabels;
}) {
  const count = images.length;
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocus = useRef<Element | null>(null);

  useScrollLock(true);

  const go = useCallback(
    (n: number) => onIndexChange((n + count) % count),
    [count, onIndexChange],
  );

  // Move focus into the dialog on open, restore it on close.
  useEffect(() => {
    restoreFocus.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      if (restoreFocus.current instanceof HTMLElement) restoreFocus.current.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Tab") {
        // Simple focus trap: cycle within the dialog's focusable controls.
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, index, onClose]);

  // Swipe to change image on touch devices.
  const drag = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    drag.current = { x: e.clientX, y: e.clientY, active: true };
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (count > 1 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      ref={dialogRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {/* Backdrop sits behind the figure and controls, so clicking anywhere
          outside the image closes the viewer. */}
      <div className="lightbox__backdrop" onClick={onClose} />

      <button
        type="button"
        className="lightbox__close"
        onClick={onClose}
        aria-label={labels.close}
        ref={closeRef}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <figure className="lightbox__figure">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} — ${index + 1}`}
          width={1920}
          height={1440}
          className="lightbox__img"
          sizes="100vw"
          priority
        />
      </figure>

      {count > 1 && (
        <>
          <button
            type="button"
            className="lightbox__arrow lightbox__arrow--prev"
            onClick={() => go(index - 1)}
            aria-label={labels.prev}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
              <path
                d="M14.5 5.5 8 12l6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="lightbox__arrow lightbox__arrow--next"
            onClick={() => go(index + 1)}
            aria-label={labels.next}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
              <path
                d="M9.5 5.5 16 12l-6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <p className="lightbox__counter" aria-live="polite">
            {index + 1} / {count}
          </p>

          <div className="lightbox__thumbs">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={`lightbox__thumb${i === index ? " is-active" : ""}`}
                onClick={() => onIndexChange(i)}
                aria-label={`${alt} — ${i + 1}`}
                aria-current={i === index}
              >
                <Image src={src} alt="" width={160} height={120} sizes="96px" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}

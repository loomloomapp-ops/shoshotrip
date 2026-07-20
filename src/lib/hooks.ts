"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-based reveal. Adds `is-visible` once the element
 * enters the viewport. Never uses scroll listeners. Respects reduced motion
 * (the CSS already forces reveals visible under prefers-reduced-motion).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; once?: boolean },
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const once = options?.once ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, options?.threshold]);

  return { ref, visible };
}

/**
 * Header show/hide behavior matching the source template:
 * hides while scrolling down, reveals on scroll up or when scrolling stops.
 * Uses requestAnimationFrame throttling + motion values in refs (no per-frame
 * React state churn beyond the boolean flags that actually change the UI).
 */
export function useHideOnScroll(threshold = 120) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < threshold) {
        setHidden(false);
      } else if (y > lastY + 6) {
        setHidden(true);
      } else if (y < lastY - 6) {
        setHidden(false);
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
      if (stopTimer) clearTimeout(stopTimer);
      // Reveal when scrolling pauses.
      stopTimer = setTimeout(() => setHidden(false), 220);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, [threshold]);

  return { hidden, scrolled };
}

/** Tracks the user's prefers-reduced-motion setting (SSR-safe). */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

/** Lock body scroll while a modal / mobile menu is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Locale } from "@/lib/i18n";
import "./travel-preloader.css";

/**
 * TravelPreloader — a cinematic, single-scene brand intro for ShoSho Trip.
 *
 * The ShoSho emblem is a solid tile with the mountains / waterfall / traveller
 * carved out as negative space, so the scene is built around that: a dark
 * forest field settles, a lime horizon draws in low on screen, dawn light
 * fills the emblem tile (mask wipe) while "SHO SHO" draws on, a short brand
 * pause, a lime pulse inverts the palette, then the tile opens as a portal
 * (two panels part) onto the hero.
 *
 * Contract:
 *  - Runs at most once per browser session (sessionStorage). Repeat visits get
 *    an instant fade.
 *  - Honours prefers-reduced-motion with a minimal fade sequence.
 *  - Locks scroll while active, restores + removes itself from the DOM after.
 *  - A failsafe timeout guarantees the site opens even if something throws.
 *  - Only transform / opacity / clip-path / custom props are animated.
 */

const SEEN_KEY = "sho_pl_seen";
const FAILSAFE_MS = 7000;

// Horizon / route line drawn low in the frame (viewBox 0 0 1000 120).
const ROUTE_D = "M0 92 L190 92 L300 66 L404 82 L520 44 L648 74 L760 52 L872 70 L1000 60";

export function TravelPreloader({
  locale,
  viewBox,
  illusMarkup,
  wordMarkup,
}: {
  locale: Locale;
  viewBox: string;
  illusMarkup: string;
  wordMarkup: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tagline = locale === "ua" ? "ПОДОРОЖ ПОЧИНАЄТЬСЯ" : "THE JOURNEY BEGINS";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    html.classList.add("sho-ready");

    let done = false;
    let failsafe: number | undefined;
    let ctx: gsap.Context | undefined;
    const q = gsap.utils.selector(root);

    const unlock = () => html.classList.remove("sho-lock");

    const teardown = () => {
      if (done) return;
      done = true;
      if (failsafe) window.clearTimeout(failsafe);
      unlock();
      html.classList.remove("sho-reveal-pending", "sho-revealing", "sho-seen");
      ctx?.revert();
      root.remove();
    };

    const finish = () => {
      html.classList.remove("sho-reveal-pending");
      html.classList.add("sho-revealing");
      unlock();
      window.setTimeout(teardown, 1300);
    };

    failsafe = window.setTimeout(() => {
      html.classList.remove("sho-reveal-pending");
      teardown();
    }, FAILSAFE_MS);

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* private mode */
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Repeat visit within the session: instant, no choreography.
    if (seen) {
      gsap.to(root, { autoAlpha: 0, duration: 0.35, ease: "power2.out", onComplete: teardown });
      return () => {
        if (failsafe) window.clearTimeout(failsafe);
      };
    }

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const speed = isMobile ? 0.83 : 1; // ~17% shorter on mobile

    ctx = gsap.context(() => {
      // Reduced motion: fade emblem in, hold, hand off to the hero.
      if (reduce) {
        html.classList.remove("sho-reveal-pending");
        gsap.set(q(".sho-illus"), { clipPath: "none", filter: "none" });
        gsap
          .timeline({ onComplete: finish })
          .to(root, { "--pl-veil": 0, duration: 0.3 })
          .fromTo(q(".sho-logo"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" })
          .to(q(".sho-logo"), { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "+=0.5")
          .to(root, { autoAlpha: 0, duration: 0.4 }, "<0.1");
        return;
      }

      // Wordmark: prep stroke-draw.
      const strokes = q<SVGPathElement>(".sho-word path");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      // Route line + travelling dot.
      const routePath = q<SVGPathElement>(".sho-route__line")[0];
      const dot = q<SVGCircleElement>(".sho-route__dot")[0];
      let routeLen = 0;
      if (routePath) {
        routeLen = routePath.getTotalLength();
        gsap.set(routePath, { strokeDasharray: routeLen, strokeDashoffset: routeLen });
      }
      const dotProxy = { p: 0 };
      const counter = { v: 0 };

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });

      // Centre the glow / pulse via GSAP so their scale never shifts them.
      gsap.set(q(".sho-glow"), { xPercent: -50, yPercent: -50 });
      gsap.set(q(".sho-pulse"), { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });

      // 1 — atmosphere settles.
      tl.fromTo(root, { "--pl-veil": 1 }, { "--pl-veil": 0, duration: 0.55 * speed }, 0)
        .fromTo(
          q(".sho-glow"),
          { autoAlpha: 0, scale: 0.72 },
          { autoAlpha: 1, scale: 1, duration: 1.0 * speed, ease: "sine.out" },
          0
        )

        // 2 — horizon draws in, low in the frame.
        .to(routePath, { strokeDashoffset: 0, duration: 0.75 * speed, ease: "power1.inOut" }, 0.35)
        .fromTo(dot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.4)
        .to(
          dotProxy,
          {
            p: 1,
            duration: 0.75 * speed,
            ease: "power1.inOut",
            onUpdate: () => {
              if (!routePath || !dot || !routeLen) return;
              const pt = routePath.getPointAtLength(dotProxy.p * routeLen);
              dot.setAttribute("cx", String(pt.x));
              dot.setAttribute("cy", String(pt.y));
            },
          },
          0.4
        )
        .to(dot, { autoAlpha: 0, duration: 0.35 }, 1.05)

        // 3 — dawn light fills the emblem tile; wordmark draws on.
        .fromTo(
          q(".sho-logo"),
          { autoAlpha: 0, scale: 0.98, y: 12 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1.0 * speed, ease: "power3.out" },
          0.85
        )
        .fromTo(
          q(".sho-illus"),
          { clipPath: "inset(100% 0% 0% 0%)", filter: "blur(12px)" },
          { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", duration: 0.95 * speed, ease: "power2.out" },
          0.9
        )
        .to(
          strokes,
          { strokeDashoffset: 0, duration: 0.7 * speed, ease: "power1.inOut", stagger: 0.05 * speed },
          1.15
        )

        // 4 — brand pause: tagline + counter.
        .fromTo(q(".sho-tagline"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 * speed }, 1.75)
        .fromTo(q(".sho-counter"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.7)
        .to(
          counter,
          {
            v: 100,
            duration: 1.7 * speed,
            ease: "power1.out",
            onUpdate: () => {
              const el = q(".sho-counter__cur")[0];
              if (el) el.textContent = String(Math.round(counter.v)).padStart(2, "0");
            },
          },
          0.65
        )

        // 5 — lime pulse inverts the palette.
        .to(q(".sho-pulse"), { autoAlpha: 1, scale: 1, duration: 0.6 * speed, ease: "power2.out" }, 2.35 * speed)
        .to(
          root,
          { "--pl-bg": "#a8e10c", "--pl-logo": "#203f2c", duration: 0.5 * speed, ease: "power2.inOut" },
          "<0.05"
        )
        .to(q(".sho-tagline, .sho-counter, .sho-route"), { autoAlpha: 0, duration: 0.3 }, "<")
        .to(q(".sho-pulse"), { autoAlpha: 0, duration: 0.35 }, ">-0.1")

        // 6 — the tile dissolves and the lime frame opens onto the hero.
        // The emblem fades on the lime field, then the panels (also lime) take
        // over as the only opaque cover while the overlay itself turns
        // transparent — so parting them reveals the hero beneath, not more veil.
        .to(q(".sho-logo"), { scale: 1.12, autoAlpha: 0, duration: 0.45 * speed, ease: "power2.in" }, ">-0.15")
        .add(() => html.classList.add("sho-revealing"))
        .set(q(".sho-panel"), { autoAlpha: 1 })
        .set(root, { "--pl-bg": "transparent" })
        .set(q(".sho-grain, .sho-vignette, .sho-glow"), { autoAlpha: 0 })
        .to(q(".sho-panel--top"), { yPercent: -101, duration: 0.8 * speed, ease: "power3.inOut" }, ">0.05")
        .to(q(".sho-panel--bottom"), { yPercent: 101, duration: 0.8 * speed, ease: "power3.inOut" }, "<");
    }, root);

    return () => {
      if (failsafe) window.clearTimeout(failsafe);
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="sho-preloader" className="sho-preloader" ref={rootRef} role="presentation" aria-hidden="true">
      <div className="sho-grain" />
      <div className="sho-vignette" />
      <div className="sho-glow" />

      <div className="sho-stage">
        <div className="sho-logo">
          <svg
            className="sho-illus"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            dangerouslySetInnerHTML={{ __html: illusMarkup }}
          />
          <svg
            className="sho-word"
            viewBox={viewBox}
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            dangerouslySetInnerHTML={{ __html: wordMarkup }}
          />
        </div>

        <p className="sho-tagline">{tagline}</p>
      </div>

      <svg className="sho-route" viewBox="0 0 1000 120" fill="none" preserveAspectRatio="none">
        <path className="sho-route__line" d={ROUTE_D} />
        <circle className="sho-route__dot" r="4" cx="0" cy="92" />
      </svg>

      <div className="sho-counter" aria-hidden="true">
        <span className="sho-counter__cur">00</span>
        <span className="sho-counter__sep">—</span>
        <span className="sho-counter__end">100</span>
      </div>

      <div className="sho-pulse" />

      <div className="sho-panels" aria-hidden="true">
        <div className="sho-panel sho-panel--top" />
        <div className="sho-panel sho-panel--bottom" />
      </div>
    </div>
  );
}

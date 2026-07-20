"use client";

/**
 * Thin analytics dispatcher. Pushes events to GTM dataLayer (if present),
 * GA4 gtag (if present) and Meta Pixel fbq (if present). No-op when none
 * are configured. Never hardcode measurement IDs — set them via env.
 */

type EventName =
  | "quiz_start"
  | "quiz_complete"
  | "tour_card_click"
  | "booking_click"
  | "telegram_click"
  | "whatsapp_click"
  | "instagram_click"
  | "language_switch"
  | "form_submit";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event, ...props });
    window.gtag?.("event", event, props);
    if (event === "form_submit" || event === "booking_click") {
      window.fbq?.("track", "Lead", props);
    }
  } catch {
    /* analytics must never break the UI */
  }
}

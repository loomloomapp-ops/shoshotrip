import type { Locale, Localized } from "@/lib/i18n";
import data from "@/content/data/reviews.json";

/**
 * Traveller reviews. The entries live in `data/reviews.json`, which the /admin
 * panel reads and writes; this module only types them and exposes lookups.
 *
 * `demo: true` marks placeholder reviews — they must NOT be presented as
 * verified customers. Clear the flag once a review is real and consented to.
 *
 * Formats (`kind`):
 *  - "text"       — written review (quote + author)
 *  - "video"      — video review: `video` URL + `poster` image
 *  - "screenshot" — a real message screenshot, or a styled bubble built from `text`
 *  - "photo"      — a participant photo with an optional caption `text`
 * `instagram` (author profile link) is shown ONLY when present — i.e. by consent.
 */
export type ReviewKind = "text" | "video" | "screenshot" | "photo";

export interface Review {
  id: string;
  demo: true;
  kind: ReviewKind;
  name: string;
  photo: string; // author avatar / participant photo
  tour: Localized;
  date?: string; // display date (DD.MM.YYYY) — shown on video cards
  instagram?: string; // author profile — present == consented to link
  text?: Localized; // review body / caption / message text
  video?: string; // real clip URL (kind: video)
  poster?: string; // video / screenshot poster (kind: video)
  screenshot?: string; // real message-screenshot image (kind: screenshot)
}


export const reviews: Review[] = data as unknown as Review[];

export function getReviewsByIds(ids: string[]): Review[] {
  return ids
    .map((id) => reviews.find((r) => r.id === id))
    .filter((r): r is Review => Boolean(r));
}

export function getReviewText(review: Review, locale: Locale): string {
  return review.text ? review.text[locale] : "";
}

import type { Locale, Localized } from "@/lib/i18n";
import data from "@/content/data/tours.json";

/**
 * CENTRALIZED TOUR DATA.
 *
 * The tours themselves live in `data/tours.json`, which is what the /admin
 * panel reads and writes. This module only types that JSON and exposes the
 * helpers the pages use, so nothing outside here needs to know where the
 * content came from.
 *
 * Editing by hand is still fine — keep it valid JSON and both locales filled.
 */

export type TourStatus = "available" | "last" | "recruiting" | "soldout" | "soon";
/** 1..4 → light / moderate / active / hard */
export type Difficulty = 1 | 2 | 3 | 4;
export type ActivityType = "nature" | "trekking" | "culture" | "balanced";

export interface ItineraryDay {
  title: Localized;
  route: Localized;
  activities: Localized;
  transferTime: Localized;
  load: Localized;
  meals: Localized;
  stay: Localized;
  note?: Localized;
  /** Optional per-day image. Falls back to the tour gallery when omitted. */
  photo?: string;
}

export interface TourFaqItem {
  q: Localized;
  a: Localized;
}

export interface Tour {
  id: string;
  slug: string;
  demo: boolean;
  country: Localized;
  region: Localized;
  name: Localized;
  datesLabel: Localized;
  startISO: string; // for ordering / schema
  durationDays: number;
  price: number;
  currency: string;
  seatsLeft: number;
  seatsTotal: number;
  status: TourStatus;
  difficulty: Difficulty;
  activity: ActivityType;
  groupSize: Localized;
  highlight: Localized; // one-line card feature
  shortDescription: Localized;
  fullDescription: Localized;
  highlights: Localized[];
  itinerary: ItineraryDay[];
  physical: {
    distanceKm: string;
    elevation: Localized;
    activityTime: Localized;
    routeType: Localized;
    experience: Localized;
  };
  accommodation: {
    type: Localized;
    occupancy: Localized;
    bathroom: Localized;
    single: Localized;
    features: Localized[];
  };
  included: Localized[];
  excluded: Localized[];
  gallery: string[]; // image URLs (demo: picsum seeds)
  videos: string[];
  reviewIds: string[];
  faq: TourFaqItem[];
  seo: { title: Localized; description: Localized };
}


/** The JSON is authored, not inferred: assert it against the Tour contract. */
export const tours: Tour[] = data as unknown as Tour[];

/* ---- helpers ---- */
export function getAllTours(): Tour[] {
  return [...tours].sort((a, b) => a.startISO.localeCompare(b.startISO));
}
export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
export function loc(value: Localized, locale: Locale): string {
  return value[locale];
}

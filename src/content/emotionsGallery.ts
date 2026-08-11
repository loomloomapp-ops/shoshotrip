import { siteConfig } from "@/content/config";

/**
 * Emotions gallery — single source of truth.
 * OWNER edits everything here: reorder cards, swap photos, add videos, change
 * posters, resize a card, or update the Instagram handle/URL. Components never
 * hardcode any of this.
 */

/** Instagram identity shown on every card. Change in ONE place. */
export const galleryInstagram = {
  handle: "@shoshotrip",
  url: siteConfig.instagram, // env-configurable in config.ts
} as const;

/** Card width tier: small = narrow (vertical photo), medium, large = wide (video). */
export type MediaSize = "small" | "medium" | "large";

export type GalleryItem =
  | { type: "image"; src: string; alt: string; size: MediaSize }
  | {
      type: "video";
      /** MP4 file (add to /public/media/emotions/). */
      src: string;
      /** Optional WebM for smaller files in Chrome/Firefox. */
      srcWebm?: string;
      /** Poster shown before play + while paused (no layout shift). */
      poster: string;
      alt: string;
      size: MediaSize;
    };

/**
 * The rail strictly alternates photo -> video -> photo -> video (owner request),
 * so the eye never meets two clips or two stills in a row.
 *
 * All eight files are web-optimized derivatives of the owner's originals, which
 * stay untouched in asets/:
 *   photo-1..4.jpg  <- IMG_6956 / IMG_6955 / IMG_6957 / IMG_6958
 *   clip-1..4.mp4   <- IMG_6959 / IMG_6960 / IMG_6961 / IMG_6962
 *                      (H.264 720p, 30fps, no audio track, faststart)
 *   clip-1..4-poster.jpg — first frame of each clip, so there is no layout shift
 * `srcWebm` is optional — add a VP9 .webm here to shave bytes in Chrome/Firefox.
 *
 * Card width follows the source aspect: portrait media reads as `small`, the
 * portrait aerial clip as `medium`, landscape clips as `large`.
 */
export const galleryItems: GalleryItem[] = [
  {
    type: "image",
    src: "/media/emotions/photo-1.jpg",
    alt: "Мандрівники ShoSho Trip біля льодовика Періто-Морено",
    size: "small",
  },
  {
    type: "video",
    src: "/media/emotions/clip-1.mp4",
    poster: "/media/emotions/clip-1-poster.jpg",
    alt: "Учасники туру танцюють на дорозі під горою Фіцрой",
    size: "large",
  },
  {
    type: "image",
    src: "/media/emotions/photo-2.jpg",
    alt: "Пілот запускає дрон на тлі гори Фіцрой",
    size: "small",
  },
  {
    type: "video",
    src: "/media/emotions/clip-2.mp4",
    poster: "/media/emotions/clip-2-poster.jpg",
    alt: "Політ над зеленою скелею та океаном",
    size: "medium",
  },
  {
    type: "image",
    src: "/media/emotions/photo-3.jpg",
    alt: "Учасники туру ShoSho Trip у рятувальних жилетах перед виходом у море",
    size: "small",
  },
  {
    type: "video",
    src: "/media/emotions/clip-3.mp4",
    poster: "/media/emotions/clip-3-poster.jpg",
    alt: "Автомобіль на порожній дорозі серед пустельного плато",
    size: "large",
  },
  {
    type: "image",
    src: "/media/emotions/photo-4.jpg",
    alt: "Рюкзак із нашивками країн на скелі біля льодовика",
    size: "small",
  },
  {
    type: "video",
    src: "/media/emotions/clip-4.mp4",
    poster: "/media/emotions/clip-4-poster.jpg",
    alt: "Капсульний готель у горах на маршруті ShoSho Trip",
    size: "large",
  },
];

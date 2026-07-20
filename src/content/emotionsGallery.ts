import { siteConfig } from "@/content/config";
import { LANDSCAPE, PORTRAIT } from "@/content/media";

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
 * Approx. reference composition: narrow photo -> vertical photo -> vertical
 * photo -> large video -> photo -> large video (+ a couple more so the rail has
 * scroll room and edges always peek the next card).
 *
 * VIDEO FILES: the two `video` entries use real web-optimized clips generated
 * from the owner's originals (assets/IMG_4627.MOV, assets/IMG_5590.MOV):
 *   - /media/emotions/clip-1.mp4, clip-2.mp4  (H.264 720p, faststart)
 *   - /media/emotions/clip-1-poster.jpg, clip-2-poster.jpg
 * The originals stay untouched in assets/. `srcWebm` is optional — add a VP9
 * .webm here to shave bytes in Chrome/Firefox if you ever transcode one.
 */
export const galleryItems: GalleryItem[] = [
  {
    type: "image",
    src: PORTRAIT[0],
    alt: "Учасники авторського туру ShoSho Trip на гірській стежці",
    size: "small",
  },
  {
    type: "image",
    src: PORTRAIT[1],
    alt: "Світанок у горах під час подорожі ShoSho Trip",
    size: "small",
  },
  {
    type: "image",
    src: PORTRAIT[3],
    alt: "Мандрівники ShoSho Trip милуються краєвидом",
    size: "small",
  },
  {
    type: "video",
    src: "/media/emotions/clip-1.mp4", // з IMG_4627.MOV (H.264, faststart)
    poster: "/media/emotions/clip-1-poster.jpg",
    alt: "Емоції з авторського туру ShoSho Trip",
    size: "large",
  },
  {
    type: "image",
    src: LANDSCAPE[4],
    alt: "Гірський краєвид на маршруті ShoSho Trip",
    size: "medium",
  },
  {
    type: "video",
    src: "/media/emotions/clip-2.mp4", // з IMG_5590.MOV (H.264, faststart)
    poster: "/media/emotions/clip-2-poster.jpg",
    alt: "Моменти з подорожі ShoSho Trip",
    size: "large",
  },
  {
    type: "image",
    src: PORTRAIT[4],
    alt: "Портрет учасниці подорожі ShoSho Trip на тлі гір",
    size: "small",
  },
  {
    type: "image",
    src: LANDSCAPE[0],
    alt: "Панорама з маршруту авторського туру ShoSho Trip",
    size: "medium",
  },
];

/**
 * Central media manifest — maps real owner assets (in /public/media) to slots.
 * Generated landscape (1200x800) and portrait (800x1200) crops of the 5 source
 * photos. Swap/extend here; components never hardcode image paths.
 *
 * VIDEO: source clips are /public/media originals (.MOV, not web-optimized).
 * To enable the hero video, transcode with ffmpeg to hero.mp4 + hero.webm:
 *   ffmpeg -i IMG_6127.MOV -vf scale=1280:-2 -an -movflags +faststart hero.mp4
 *   ffmpeg -i IMG_6127.MOV -vf scale=1280:-2 -an -c:v libvpx-vp9 hero.webm
 * Until those files exist, the hero shows the landscape poster below.
 */

export const LANDSCAPE = [
  "/media/ph5-l.jpg",
  "/media/ph1-l.jpg",
  "/media/ph2-l.jpg",
  "/media/ph3-l.jpg",
  "/media/ph4-l.jpg",
] as const;

export const PORTRAIT = [
  "/media/ph1-p.jpg",
  "/media/ph2-p.jpg",
  "/media/ph3-p.jpg",
  "/media/ph4-p.jpg",
  "/media/ph5-p.jpg",
] as const;

/** Hero background. Two crops of the same scene: the landscape frame is the
 *  desktop/tablet default, the portrait one takes over on phones (<768px)
 *  where a wide frame would be cropped down to a thin strip. */
export const heroPoster = "/media/hero-banner.jpg";
export const heroPosterPortrait = "/media/hero-banner-portrait.jpg";

/** Optional clip layered over the hero photo. Null while no such file exists —
 *  the hero then renders no <video> at all, instead of asking the server for a
 *  file that is not there on every visit. Point these at the transcoded paths
 *  (see the ffmpeg lines above) and the video layer comes back by itself. */
export const heroVideoMp4: string | null = null;
export const heroVideoWebm: string | null = null;

/** Full-bleed looping video behind the closing "final CTA" panel. The .mp4 is
 * an H.264 clip (owner source). Poster shows until it loads / if it fails. */
export const finalCtaVideoMp4 = "/media/final-cta.mp4";
export const finalCtaPoster = "/media/hero-banner.jpg";

/* Founder photos moved to `data/team.json` (photo + focus per person), so the
   team block is no longer limited to a fixed pair. */
export const whyMain = "/media/ph3-p.jpg";
export const whyInset = "/media/ph2-l.jpg";

/** Full-bleed scene behind the "Why ShoSho Trip" card deck. Owner photo, shot
 *  portrait — the stage crops it, see .why-stage__img object-position. */
export const whyScene = "/media/why-scene.jpg";
/** Full-bleed scene behind the tour-matcher quiz. */
export const quizScene = "/media/quiz-scene.jpg";

/** Deterministic pick from a list (no Math.random — SSR-stable). */
export function pickLandscape(i: number): string {
  return LANDSCAPE[i % LANDSCAPE.length];
}
export function pickPortrait(i: number): string {
  return PORTRAIT[i % PORTRAIT.length];
}

/** Build a mixed gallery of `n` images starting at an offset. */
export function buildGallery(offset: number, n = 6): string[] {
  const pool = [
    LANDSCAPE[0],
    PORTRAIT[0],
    LANDSCAPE[1],
    PORTRAIT[1],
    LANDSCAPE[2],
    PORTRAIT[2],
    LANDSCAPE[3],
    PORTRAIT[3],
    LANDSCAPE[4],
    PORTRAIT[4],
  ];
  return Array.from({ length: n }, (_, k) => pool[(offset + k) % pool.length]);
}

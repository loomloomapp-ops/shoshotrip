import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";
import { TravelPreloader } from "./TravelPreloader";

/**
 * Server wrapper for the brand preloader.
 *
 * Reads the real ShoSho emblem (`public/logo-full.svg`) at build time and
 * splits it into two coordinate-aligned layers so the client can animate them
 * independently:
 *   - illustration  → the single compound mountain / waterfall / traveller path
 *                     (fill), revealed with a bottom-up mask wipe + blur.
 *   - wordmark      → the ten "SHO SHO" letter strokes, drawn on via
 *                     stroke-dashoffset.
 *
 * Colour is intentionally stripped here and re-applied from CSS, so the mark
 * can shift from milk → forest-deep during the lime pulse without touching the
 * source asset.
 */

const VIEWBOX = "0 0 1441 1147";

function stripPaint(pathTag: string): string {
  return pathTag
    .replace(/\s*fill="[^"]*"/g, "")
    .replace(/\s*stroke="[^"]*"/g, "");
}

function buildLayers(): { illus: string; word: string } {
  const file = path.join(process.cwd(), "public", "logo-full.svg");
  let raw = "";
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return { illus: "", word: "" };
  }

  const tags = raw.match(/<path\b[^>]*\/>/g) ?? [];
  const illusTags: string[] = [];
  const wordTags: string[] = [];

  for (const tag of tags) {
    // The illustration is the one large filled compound path; the wordmark
    // letters are the remaining stroked paths.
    if (/fill="black"/.test(tag) || tag.length > 4000) illusTags.push(stripPaint(tag));
    else wordTags.push(stripPaint(tag));
  }

  return { illus: illusTags.join(""), word: wordTags.join("") };
}

export function PreloaderGate({ locale }: { locale: Locale }) {
  const { illus, word } = buildLayers();
  if (!illus && !word) return null;
  return (
    <TravelPreloader locale={locale} viewBox={VIEWBOX} illusMarkup={illus} wordMarkup={word} />
  );
}

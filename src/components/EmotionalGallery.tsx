import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { withBreaks } from "@/lib/text";
import { Reveal } from "@/components/Reveal";
import { EmotionsRail } from "@/components/EmotionsRail";
import { ArrowUpRight } from "@/components/Icons";

/**
 * "Emotions" section — our heading over faint concentric arcs, then a
 * full-bleed horizontal media rail (photos + videos) that drags, swipes and
 * plays one video at a time. Composition/interaction mirror the Tourvia
 * reference; content, palette and type are ShoSho's. The rail is an isolated
 * client leaf (EmotionsRail); this wrapper stays a server component.
 */
export function EmotionalGallery({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.emotions;

  return (
    <section className="section emotions" id="emotions">
      <div className="emotions__arcs" aria-hidden="true" />

      <div className="container">
        <Reveal className="emotions__head">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="emotions__title">{withBreaks(t.title)}</h2>
          <div className="emotions-cta">
            <Link href={localePath(locale, "tours")} className="cta" aria-label={dict.cta.wantSame}>
              <span className="cta__label">{dict.cta.wantSame}</span>
              <span className="cta__go" aria-hidden="true">
                <ArrowUpRight width={18} height={18} />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="emotions__rail-wrap">
        <EmotionsRail />
      </div>
    </section>
  );
}

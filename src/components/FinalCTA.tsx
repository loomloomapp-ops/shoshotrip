import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { Reveal } from "@/components/Reveal";
import { withBreaks } from "@/lib/text";
import { ArrowUpRight } from "@/components/Icons";
import { finalCtaVideoMp4, finalCtaPoster } from "@/content/media";

/**
 * Closing CTA — a full-bleed video panel that mirrors the footer's floating
 * shape (10px inset, 25px radius) so the two close the page as a pair. A soft
 * gradient wash keeps the white headline and unified CTAs legible over the clip.
 */
export function FinalCTA({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.finalCta;

  return (
    <section className="section final-cta">
      <div className="final-cta__panel on-dark">
        <video
          className="final-cta__media"
          autoPlay
          muted
          loop
          playsInline
          poster={finalCtaPoster}
          preload="none"
          aria-hidden="true"
        >
          <source src={finalCtaVideoMp4} type="video/mp4" />
        </video>
        <div className="final-cta__scrim" aria-hidden="true" />

        <Reveal className="final-cta__inner" scale>
          <h2>{withBreaks(t.title)}</h2>
          <p className="lead">{withBreaks(t.text)}</p>
          <div className="final-cta__actions">
            <Link href={localePath(locale, "tours")} className="cta" aria-label={dict.cta.viewTours}>
              <span className="cta__label">{dict.cta.viewTours}</span>
              <span className="cta__go" aria-hidden="true">
                <ArrowUpRight width={18} height={18} />
              </span>
            </Link>
            <Link href="#quiz" className="cta cta--ghost" aria-label={dict.nav.chooseTour}>
              <span className="cta__label">{dict.nav.chooseTour}</span>
              <span className="cta__go" aria-hidden="true">
                <ArrowUpRight width={18} height={18} />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

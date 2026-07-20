import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { getAllTours } from "@/content/tours";
import { TourCard } from "@/components/TourCard";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight } from "@/components/Icons";

/** Homepage "Available tours" — first tours + link to the full listing. */
export function ToursSection({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.toursSection;
  const tours = getAllTours().slice(0, 3);

  return (
    <section className="section section--sand" id="tours">
      <div className="container">
        <Reveal className="section-head section-head--center">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p className="lead" style={{ textAlign: "center", marginInline: "auto" }}>{t.subtitle}</p>
          <div className="tours-section__all-wrap">
            <Link href={localePath(locale, "tours")} className="cta" aria-label={t.allTours}>
              <span className="cta__label">{t.allTours}</span>
              <span className="cta__go" aria-hidden="true">
                <ArrowUpRight width={18} height={18} />
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-3 tour-grid tours-section__grid">
          {tours.map((tour, i) => (
            <Reveal key={tour.id} delay={i * 0.08}>
              <TourCard tour={tour} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

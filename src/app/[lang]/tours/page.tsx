import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getAllTours } from "@/content/tours";
import { siteConfig } from "@/content/config";
import { TourGrid } from "@/components/TourGrid";
import { TourQuiz } from "@/components/TourQuiz";
import { FAQ } from "@/components/FAQ";
import { Reveal } from "@/components/Reveal";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  if (!isLocale(params.lang)) return {};
  const dict = getDict(params.lang);
  return buildMetadata({
    locale: params.lang,
    title: dict.meta.tours.title,
    description: dict.meta.tours.description,
    path: "tours",
  });
}

export default function ToursPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const dict = getDict(locale);
  const tours = getAllTours();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.breadcrumbs.home, item: siteConfig.siteUrl + localePath(locale) },
      { "@type": "ListItem", position: 2, name: dict.breadcrumbs.tours, item: siteConfig.siteUrl + localePath(locale, "tours") },
    ],
  };

  return (
    <>
      <section className="section packages-hero">
        <div className="container">
          <Reveal className="section-head section-head--center packages-hero__head">
            <span className="eyebrow">{dict.toursSection.eyebrow}</span>
            <h1>{dict.toursSection.title}</h1>
          </Reveal>
          <TourGrid tours={tours} locale={locale} />
        </div>
      </section>

      <TourQuiz locale={locale} />
      <FAQ locale={locale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

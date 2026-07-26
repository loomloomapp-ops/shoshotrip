import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, locales, type Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getAllTours, getTourBySlug, loc } from "@/content/tours";
import { getReviewsByIds, getReviewText } from "@/content/reviews";
import { siteConfig } from "@/content/config";
import { LeadForm } from "@/components/LeadForm";
import { PackageSlider } from "@/components/tour/PackageSlider";
import { FAQ } from "@/components/FAQ";
import {
  ArrowLeft,
  Calendar,
  Users,
  Star,
  Check,
  Mountain,
  Sunrise,
  MapPin,
  Wallet,
  Clock,
} from "@/components/Icons";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getAllTours().map((tour) => ({ lang, slug: tour.slug })),
  );
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Metadata {
  if (!isLocale(params.lang)) return {};
  const tour = getTourBySlug(params.slug);
  if (!tour) return {};
  return buildMetadata({
    locale: params.lang,
    title: loc(tour.seo.title, params.lang),
    description: loc(tour.seo.description, params.lang),
    path: `tours/${tour.slug}`,
    image: tour.gallery[0],
  });
}

// Rotating icon set for the "Amenities / What's included" grid.
const AMENITY_ICONS = [Check, Mountain, Sunrise, MapPin, Users, Wallet, Calendar, Clock];

export default function TourPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const tour = getTourBySlug(params.slug);
  if (!tour) notFound();

  const dict = getDict(locale);
  const t = dict.tourPage;
  const reviews = getReviewsByIds(tour.reviewIds);
  const featured = reviews.find((r) => r.text) ?? reviews[0];

  const ua = locale === "ua";
  const priceLabel = `${tour.currency}${tour.price.toLocaleString("uk-UA")}`;
  const maxPeople = ua ? `Макс. ${tour.seatsTotal} осіб` : `Max ${tour.seatsTotal} people`;
  const ratingLabel = `${dict.hero.rating.score} · 47 ${ua ? "відгуків" : "reviews"}`;
  const bookable = tour.status !== "soldout" && tour.status !== "soon";

  const tripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: loc(tour.name, locale),
    description: loc(tour.shortDescription, locale),
    touristType: loc(tour.groupSize, locale),
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.itinerary.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name: loc(d.title, locale) },
      })),
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "EUR",
      availability:
        tour.status === "soldout"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: siteConfig.siteUrl + localePath(locale, `tours/${tour.slug}`),
    },
    ...(reviews.length > 0 && {
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewBody: getReviewText(r, locale),
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
      })),
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.breadcrumbs.home, item: siteConfig.siteUrl + localePath(locale) },
      { "@type": "ListItem", position: 2, name: dict.breadcrumbs.tours, item: siteConfig.siteUrl + localePath(locale, "tours") },
      { "@type": "ListItem", position: 3, name: loc(tour.name, locale), item: siteConfig.siteUrl + localePath(locale, `tours/${tour.slug}`) },
    ],
  };

  return (
    <>
      <section className="tour-detail">
        <div className="container">
          {/* Back link */}
          <Link href={localePath(locale, "tours")} className="td-back">
            <ArrowLeft width={20} height={20} />
            <span>{t.backToTours}</span>
          </Link>

          {/* Name + meta row */}
          <h1 className="td-name">{loc(tour.name, locale)}</h1>
          <ul className="td-meta">
            <li className="td-meta__item">
              <Calendar width={18} height={18} />
              <span>{loc(tour.datesLabel, locale)}</span>
            </li>
            <li className="td-meta__item">
              <Users width={18} height={18} />
              <span>{maxPeople}</span>
            </li>
            <li className="td-meta__item">
              <Star width={18} height={18} />
              <span>{ratingLabel}</span>
            </li>
          </ul>

          {/* Image slider */}
          <PackageSlider
            images={tour.gallery}
            alt={loc(tour.name, locale)}
            labels={t.lightbox}
          />

          {/* Two-column body: details + sticky booking form */}
          <div className="td-body">
            <div className="td-main">
              {/* Tour details */}
              <div className="td-block">
                <h2 className="td-block__title">{t.about}</h2>
                <p className="td-block__text">{loc(tour.fullDescription, locale)}</p>
              </div>

              {/* Plan chart */}
              <div className="td-block">
                <h3 className="td-block__title td-block__title--sm">{t.itinerary}</h3>
                <ul className="td-plan">
                  {tour.itinerary.map((day, i) => (
                    <li key={i} className="td-plan__row">
                      <span className="td-plan__day">
                        {t.day} {i + 1}
                      </span>
                      <span className="td-plan__text">
                        {loc(day.title, locale)}
                        <span className="td-plan__route"> — {loc(day.route, locale)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="td-plan__note">{t.itineraryNote}</p>
              </div>

              {/* Amenities / what's included */}
              <div className="td-block">
                <h3 className="td-block__title td-block__title--sm">{t.included}</h3>
                <div className="td-amenities">
                  {tour.included.map((item, i) => {
                    const Icon = AMENITY_ICONS[i % AMENITY_ICONS.length];
                    return (
                      <div key={i} className="td-amenity">
                        <span className="td-amenity__icon">
                          <Icon width={20} height={20} />
                        </span>
                        <span>{loc(item, locale)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review card */}
              {featured && (
                <figure className="td-review">
                  <div className="td-review__stars" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} width={18} height={18} />
                    ))}
                  </div>
                  <blockquote className="td-review__quote">
                    {getReviewText(featured, locale)}
                  </blockquote>
                  <figcaption className="td-review__author">{featured.name}</figcaption>
                </figure>
              )}
            </div>

            {/* Sticky booking form */}
            <aside className="td-aside" id="book">
              <div className="td-book">
                <div className="td-book__price">
                  <span className="td-book__amount">{priceLabel}</span>
                  <span className="td-book__per">{dict.common.perPerson}</span>
                </div>

                <ul className="td-book__facts">
                  <li>
                    <Calendar width={16} height={16} />
                    <span>{loc(tour.datesLabel, locale)}</span>
                  </li>
                  <li>
                    <Clock width={16} height={16} />
                    <span>
                      {tour.durationDays} {dict.toursSection.card.days}
                    </span>
                  </li>
                  <li>
                    <Users width={16} height={16} />
                    <span>{loc(tour.groupSize, locale)}</span>
                  </li>
                  {bookable && (
                    <li>
                      <Mountain width={16} height={16} />
                      <span>
                        {tour.seatsLeft} {dict.toursSection.card.seatsLeft}
                      </span>
                    </li>
                  )}
                </ul>

                <LeadForm
                  locale={locale}
                  source="tour"
                  submitLabel={dict.cta.bookSeat}
                  context={{
                    tourName: loc(tour.name, locale),
                    tourSlug: tour.slug,
                    tourDate: loc(tour.datesLabel, locale),
                  }}
                />

                <p className="td-book__note">{t.bookNote}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {tour.faq.length > 0 && (
        <FAQ
          locale={locale}
          items={tour.faq.map((f) => ({ q: f.q, a: [f.a] }))}
          title={t.faq}
          eyebrow={dict.faq.eyebrow}
        />
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

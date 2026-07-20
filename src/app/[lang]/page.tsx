import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { homeFaq } from "@/content/faq";
import { loc } from "@/content/tours";
import { Hero } from "@/components/Hero";
import { EmotionalGallery } from "@/components/EmotionalGallery";
import { ToursSection } from "@/components/ToursSection";
import { WhyUs } from "@/components/WhyUs";
import { Founders } from "@/components/Founders";
import { TourQuiz } from "@/components/TourQuiz";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  if (!isLocale(params.lang)) return {};
  const dict = getDict(params.lang);
  return buildMetadata({
    locale: params.lang,
    title: dict.meta.home.title,
    description: dict.meta.home.description,
  });
}

export default function HomePage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaq.map((item) => ({
      "@type": "Question",
      name: loc(item.q, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: [...item.a.map((p) => loc(p, locale)), ...(item.list?.map((l) => loc(l, locale)) ?? [])].join(" "),
      },
    })),
  };

  return (
    <>
      <Hero locale={locale} />
      <EmotionalGallery locale={locale} />
      <ToursSection locale={locale} />
      <WhyUs locale={locale} />
      <Founders locale={locale} />
      <TourQuiz locale={locale} />
      <Testimonials locale={locale} />
      <FAQ locale={locale} />
      <FinalCTA locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

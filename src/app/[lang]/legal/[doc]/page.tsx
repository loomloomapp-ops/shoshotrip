import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, locales, type Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getLegalDoc, legalDocs, localizedLegalDate } from "@/content/legal";
import { loc } from "@/content/tours";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return locales.flatMap((lang) => legalDocs.map((d) => ({ lang, doc: d.slug })));
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; doc: string };
}): Metadata {
  if (!isLocale(params.lang)) return {};
  const doc = getLegalDoc(params.doc);
  if (!doc) return {};
  return buildMetadata({
    locale: params.lang,
    title: `${loc(doc.title, params.lang)} — ShoSho Trip`,
    description: loc(doc.title, params.lang),
    path: `legal/${doc.slug}`,
  });
}

export default function LegalPage({
  params,
}: {
  params: { lang: string; doc: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const doc = getLegalDoc(params.doc);
  if (!doc) notFound();
  const dict = getDict(locale);

  return (
    <article className="section legal-page">
      <div className="container container--narrow">
        <Breadcrumbs
          items={[
            { label: dict.breadcrumbs.home, href: localePath(locale) },
            { label: loc(doc.title, locale) },
          ]}
        />
        <header className="legal-page__head">
          <h1>{loc(doc.title, locale)}</h1>
          <p className="legal-page__updated">
            {dict.legal.updated}: {localizedLegalDate(doc.updated, locale)}
          </p>
        </header>
        <div className="legal-page__body">
          {doc.body.map((para, i) => {
            const text = loc(para, locale);
            if (text.startsWith("## ")) {
              return <h2 key={i}>{text.replace("## ", "")}</h2>;
            }
            return <p key={i}>{text}</p>;
          })}
        </div>
      </div>
    </article>
  );
}

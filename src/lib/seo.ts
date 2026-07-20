import type { Metadata } from "next";
import { siteConfig } from "@/content/config";
import { hreflang, localePath, locales, type Locale } from "@/lib/i18n";

interface SeoInput {
  locale: Locale;
  title: string;
  description: string;
  path?: string; // locale-agnostic path, e.g. "tours" or "tours/carpathians-sunrise"
  image?: string;
}

/** Build Metadata with canonical + full hreflang alternates. */
export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  image,
}: SeoInput): Metadata {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const canonical = base + localePath(locale, path);

  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[hreflang[l]] = base + localePath(l, path);
  });
  languages["x-default"] = base + localePath("ua", path);

  const ogImage = image || `${base}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.brand,
      type: "website",
      locale: hreflang[locale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** JSON-LD helper — render inside a <script type="application/ld+json">. */
export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) };
}

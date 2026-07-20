export const locales = ["ua", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ua";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Build a locale-aware path. Both locales are prefixed ("/ua", "/en") so the
 * static export maps 1:1 to real files and client-side routing works without a
 * server rewrite. The site root ("/") redirects to the default locale.
 */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** hreflang code for <link> / metadata. */
export const hreflang: Record<Locale, string> = {
  ua: "uk-UA",
  en: "en",
};

/** A localized string pair used across tour data. */
export type Localized = Record<Locale, string>;

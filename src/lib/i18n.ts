export const locales = ["ua", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ua";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Build a locale-aware path. UA is the root ("/"), EN is prefixed ("/en"). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  const base = locale === defaultLocale ? "" : `/${locale}`;
  return `${base}/${clean}`.replace(/\/+$/, "") || "/";
}

/** hreflang code for <link> / metadata. */
export const hreflang: Record<Locale, string> = {
  ua: "uk-UA",
  en: "en",
};

/** A localized string pair used across tour data. */
export type Localized = Record<Locale, string>;

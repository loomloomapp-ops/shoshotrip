"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/** Swap locale while preserving the current path (UA=root, EN=/en). */
function swapLocale(pathname: string, current: Locale, target: Locale): string {
  // Strip the current locale prefix to get the shared path.
  let shared = pathname;
  if (current !== defaultLocale) {
    shared = pathname.replace(new RegExp(`^/${current}`), "") || "/";
  }
  if (target === defaultLocale) return shared || "/";
  return `/${target}${shared === "/" ? "" : shared}`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={swapLocale(pathname, locale, l)}
          className={`lang-switch__item${l === locale ? " is-active" : ""}`}
          aria-current={l === locale ? "true" : undefined}
          hrefLang={l === "ua" ? "uk" : "en"}
          onClick={() => l !== locale && track("language_switch", { to: l })}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

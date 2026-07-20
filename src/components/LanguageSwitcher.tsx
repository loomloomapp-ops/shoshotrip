"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/** Swap locale while preserving the current path. Both locales are prefixed. */
function swapLocale(pathname: string, current: Locale, target: Locale): string {
  // Strip the current locale prefix (with or without a trailing slash).
  const shared = pathname.replace(new RegExp(`^/${current}(?=/|$)`), "");
  return `/${target}${shared}`.replace(/\/+$/, "") || `/${target}`;
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

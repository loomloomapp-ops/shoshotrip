import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { siteConfig } from "@/content/config";
import { legalNav } from "@/content/legal";
import { withBreaks } from "@/lib/text";
import { Logo } from "@/components/Logo";
import {
  Instagram,
  Telegram,
  WhatsApp,
  Phone,
  Mail,
  Heart,
} from "@/components/Icons";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.footer;
  const home = localePath(locale);
  const year = 2026;

  const navItems = [
    { label: dict.nav.about, href: `${home}#about` },
    { label: dict.nav.emotions, href: `${home}#emotions` },
    { label: dict.nav.tours, href: localePath(locale, "tours") },
    { label: dict.nav.why, href: `${home}#why` },
    { label: dict.nav.reviews, href: `${home}#reviews` },
    { label: dict.nav.faq, href: `${home}#faq` },
    { label: dict.nav.contacts, href: `${home}#contacts` },
  ];

  const socials = [
    { key: "tg", href: siteConfig.telegram, label: "Telegram", Icon: Telegram },
    { key: "ig", href: siteConfig.instagram, label: "Instagram", Icon: Instagram },
    { key: "wa", href: siteConfig.whatsapp, label: "WhatsApp", Icon: WhatsApp },
  ];

  return (
    <footer className="site-footer section--dark" id="contacts">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo light variant="full" />
            <p className="site-footer__tagline">{t.tagline}</p>

            {/* Contacts collapsed under the logo (dedicated column removed to
                make room for the fund card). Phone + email sit above socials. */}
            <ul className="site-footer__contacts">
              <li>
                <a href={siteConfig.phoneHref}>
                  <Phone width={16} height={16} /> {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={siteConfig.emailHref}>
                  <Mail width={16} height={16} /> {siteConfig.emailDisplay}
                </a>
              </li>
            </ul>

            <div className="site-footer__socials">
              {socials.map(({ key, href, label, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className="site-footer__col" aria-label={t.nav}>
            <h3 className="site-footer__heading">{t.nav}</h3>
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__col" aria-label={t.docs}>
            <h3 className="site-footer__heading">{t.docs}</h3>
            <ul>
              {legalNav.map((doc) => (
                <li key={doc.slug}>
                  <Link href={localePath(locale, `legal/${doc.slug}`)}>
                    {dict.legal[doc.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Charity fund card. QR is a placeholder until the real one is
              supplied; photos are placeholder tiles (TODO: real fund photos). */}
          <aside className="site-footer__fund">
            <Heart className="fund__heart" width={26} height={26} aria-hidden="true" />

            <div className="fund__photos" aria-hidden="true">
              <span className="fund__photo fund__photo--a" />
              <span className="fund__photo fund__photo--b" />
              <span className="fund__photo fund__photo--c" />
            </div>

            <div className="fund__body">
              <div className="fund__copy">
                <span className="fund__eyebrow">{t.fund.eyebrow}</span>
                <h3 className="fund__title">{withBreaks(t.fund.title)}</h3>
                <p className="fund__text">{t.fund.text}</p>
              </div>

              <div className="fund__aside">
                <div className="fund__qr" role="img" aria-label={t.fund.qrAlt}>
                  <FundQrPlaceholder />
                </div>
                <a href="#" className="fund__cta" aria-label={t.fund.cta}>
                  {t.fund.cta}
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} {siteConfig.brand}. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Placeholder QR — a QR-like grid (finder squares + fixed modules) that reads
 * as a code without being scannable. Swap for the real fund QR when provided.
 */
function FundQrPlaceholder() {
  const finder = (x: number, y: number) => (
    <>
      <rect x={x} y={y} width={7} height={7} rx={1} fill="none" stroke="#14201c" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#14201c" />
    </>
  );
  const rows = [
    "001011010", "110100101", "010111001", "101001110", "011010100",
    "100110011", "001101101", "110011010", "011100110",
  ];
  return (
    <svg viewBox="0 0 21 21" width="100%" height="100%" role="presentation">
      <rect width="21" height="21" fill="#fff" />
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
      {rows.map((row, r) =>
        row.split("").map((c, k) =>
          c === "1" ? (
            <rect key={`${r}-${k}`} x={8 + k} y={8 + r} width={1} height={1} fill="#14201c" />
          ) : null,
        ),
      )}
      <rect x={8} y={0} width={1} height={5} fill="#14201c" />
      <rect x={12} y={2} width={1} height={4} fill="#14201c" />
      <rect x={2} y={9} width={4} height={1} fill="#14201c" />
      <rect x={16} y={9} width={3} height={1} fill="#14201c" />
      <rect x={9} y={16} width={1} height={4} fill="#14201c" />
      <rect x={13} y={15} width={4} height={1} fill="#14201c" />
    </svg>
  );
}

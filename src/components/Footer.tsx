import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { siteConfig } from "@/content/config";
import { legalNav } from "@/content/legal";
import { Logo } from "@/components/Logo";
import { Instagram, Telegram, WhatsApp, Phone } from "@/components/Icons";

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

  return (
    <footer className="site-footer section--dark" id="contacts">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo light variant="full" />
            <p className="site-footer__tagline">{t.tagline}</p>
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

          <div className="site-footer__col">
            <h3 className="site-footer__heading">{t.contacts}</h3>
            <ul className="site-footer__contacts">
              <li>
                <a href={siteConfig.phoneHref}><Phone width={16} height={16} /> {siteConfig.phoneDisplay}</a>
              </li>
              <li>
                <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer">
                  <Telegram width={16} height={16} /> {siteConfig.telegramDisplay}
                </a>
              </li>
              <li>
                <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsApp width={16} height={16} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram width={16} height={16} /> {siteConfig.instagramDisplay}
                </a>
              </li>
            </ul>
          </div>

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
        </div>

        <div className="site-footer__bottom">
          <p>© {year} {siteConfig.brand}. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}

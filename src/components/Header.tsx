"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { siteConfig } from "@/content/config";
import { useHideOnScroll, useScrollLock } from "@/lib/hooks";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { track } from "@/lib/analytics";
import {
  ArrowUpRight,
  Instagram,
  Telegram,
  WhatsApp,
  Menu,
  Close,
} from "@/components/Icons";

interface NavItem {
  key: string;
  label: string;
  href: string; // anchor on home, full path elsewhere
}

export function Header({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const { hidden, scrolled } = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollLock(menuOpen);

  const home = localePath(locale);
  const toursPath = localePath(locale, "tours");

  // The transparent/light header only reads on the dark home hero. Every other
  // page has a light canvas at the top, so force the solid (dark-text)
  // treatment there — otherwise the nav is invisible over the cream background.
  const pathname = usePathname();
  const isHome = pathname === home;
  const solid = scrolled || !isHome;

  const nav: NavItem[] = [
    { key: "about", label: dict.nav.about, href: `${home}#about` },
    { key: "emotions", label: dict.nav.emotions, href: `${home}#emotions` },
    { key: "tours", label: dict.nav.tours, href: toursPath },
    { key: "why", label: dict.nav.why, href: `${home}#why` },
    { key: "reviews", label: dict.nav.reviews, href: `${home}#reviews` },
    { key: "faq", label: dict.nav.faq, href: `${home}#faq` },
    { key: "contacts", label: dict.nav.contacts, href: `${home}#contacts` },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${solid ? " is-scrolled" : ""}${hidden && !menuOpen ? " is-hidden" : ""}`}>
      <div className="container site-header__inner">
        <Link href={home} className="site-header__logo" aria-label={siteConfig.brand} onClick={closeMenu}>
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.key} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher locale={locale} />
          <div className="site-header__social">
            <a href={siteConfig.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" onClick={() => track("instagram_click", { from: "header" })}>
              <Instagram width={18} height={18} />
            </a>
            <a href={siteConfig.telegram} aria-label="Telegram" target="_blank" rel="noopener noreferrer" onClick={() => track("telegram_click", { from: "header" })}>
              <Telegram width={18} height={18} />
            </a>
          </div>
          <Link href={toursPath} className="btn btn--forest btn--sm site-header__cta">
            {dict.nav.chooseTour}
            <span className="btn__icon"><ArrowUpRight width={14} height={14} /></span>
          </Link>
          <button
            type="button"
            className="site-header__burger"
            aria-label={menuOpen ? dict.mobileMenu.close : dict.mobileMenu.open}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <Menu width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu__top container">
          <Link href={home} className="site-header__logo" aria-label={siteConfig.brand} onClick={closeMenu}>
            <Logo />
          </Link>
          <button type="button" className="mobile-menu__close" aria-label={dict.mobileMenu.close} onClick={closeMenu}>
            <Close width={26} height={26} />
          </button>
        </div>
        <nav className="mobile-menu__nav container" aria-label="Mobile">
          {nav.map((item, i) => (
            <Link
              key={item.key}
              href={item.href}
              className="mobile-menu__link"
              style={{ ["--i" as string]: i }}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__footer container">
          <Link href={toursPath} className="btn btn--primary btn--full" onClick={closeMenu}>
            {dict.nav.chooseTour}
            <span className="btn__icon"><ArrowUpRight width={14} height={14} /></span>
          </Link>
          <div className="mobile-menu__socials">
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              <Instagram width={20} height={20} /> Instagram
            </a>
            <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              <Telegram width={20} height={20} /> Telegram
            </a>
            <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              <WhatsApp width={20} height={20} /> WhatsApp
            </a>
          </div>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}

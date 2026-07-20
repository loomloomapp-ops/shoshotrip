"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { siteConfig } from "@/content/config";
import { LeadModal } from "@/components/LeadModal";
import { LeadForm } from "@/components/LeadForm";
import { track } from "@/lib/analytics";
import { ArrowRight, ArrowUpRight, Telegram, WhatsApp, Close } from "@/components/Icons";

/** Mobile sticky "Match a tour" bar + desktop floating contact widget. */
export function SiteWidgets({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [modalOpen, setModalOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  // Keep the floating widget out of the hero (its arrows/CTA sit in the same
  // bottom-right zone). Reveal it once the hero is mostly scrolled past.
  const [heroPassed, setHeroPassed] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) {
      setHeroPassed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setHeroPassed(entry.intersectionRatio < 0.35),
      { threshold: [0, 0.35, 1] },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const openModal = () => {
    setWidgetOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      {/* Mobile sticky CTA (bottom sheet trigger) + direct Telegram link */}
      <div className="sticky-cta">
        <button type="button" className="btn btn--forest btn--full sticky-cta__btn" onClick={openModal}>
          {dict.stickyCta.label}
          <span className="btn__icon"><ArrowUpRight width={16} height={16} /></span>
        </button>
        <a
          href={siteConfig.telegram}
          className="sticky-cta__tg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.widget.telegram}
          onClick={() => track("telegram_click", { from: "sticky" })}
        >
          <Telegram width={22} height={22} />
        </a>
      </div>

      {/* Desktop floating widget */}
      <div className={`contact-widget${heroPassed ? " is-visible" : ""}`}>
        {widgetOpen && (
          <div className="contact-widget__panel" role="dialog" aria-label={dict.widget.trigger}>
            <button
              type="button"
              className="contact-widget__close"
              aria-label={dict.widget.close}
              onClick={() => setWidgetOpen(false)}
            >
              <Close width={18} height={18} />
            </button>
            <p className="contact-widget__title">{dict.widget.trigger}</p>
            <button type="button" className="contact-widget__action" onClick={openModal}>
              <span className="contact-widget__ico contact-widget__ico--lead"><ArrowRight width={16} height={16} /></span>
              {dict.widget.lead}
            </button>
            <a
              href={siteConfig.telegram}
              className="contact-widget__action"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("telegram_click", { from: "widget" })}
            >
              <span className="contact-widget__ico contact-widget__ico--tg"><Telegram width={16} height={16} /></span>
              {dict.widget.telegram}
            </a>
            <a
              href={siteConfig.whatsapp}
              className="contact-widget__action"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: "widget" })}
            >
              <span className="contact-widget__ico contact-widget__ico--wa"><WhatsApp width={16} height={16} /></span>
              {dict.widget.whatsapp}
            </a>
          </div>
        )}
        <button
          type="button"
          className={`contact-widget__trigger${widgetOpen ? " is-open" : ""}`}
          aria-expanded={widgetOpen}
          onClick={() => setWidgetOpen((v) => !v)}
        >
          {widgetOpen ? <Close width={22} height={22} /> : <span>{dict.widget.trigger}</span>}
        </button>
      </div>

      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={dict.stickyCta.label}
        variant="sheet"
      >
        <LeadForm locale={locale} source="widget" submitLabel={dict.cta.pickTrip} />
      </LeadModal>
    </>
  );
}

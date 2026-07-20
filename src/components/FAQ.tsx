"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dictionaries";
import { homeFaq, type FaqItem } from "@/content/faq";
import { loc } from "@/content/tours";
import { siteConfig } from "@/content/config";
import { withBreaks } from "@/lib/text";
import { Reveal } from "@/components/Reveal";
import { Plus, Minus, Telegram } from "@/components/Icons";

interface FAQProps {
  locale: Locale;
  items?: FaqItem[];
  title?: string;
  eyebrow?: string;
  dark?: boolean;
}

export function FAQ({ locale, items, title, eyebrow, dark = false }: FAQProps) {
  const dict = getDict(locale);
  const data = items ?? homeFaq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={`section${dark ? " section--dark" : ""}`} id="faq">
      <div className="container faq-grid">
        <Reveal className="faq-aside">
          <span className={`eyebrow${dark ? " eyebrow--light" : ""}`}>{eyebrow ?? dict.faq.eyebrow}</span>
          <h2 className="faq-aside__title">{title ?? dict.faq.title}</h2>
          <p className="faq-aside__sub">{withBreaks(dict.faq.contactText)}</p>
          <a
            href={siteConfig.telegram}
            className="cta faq-aside__cta"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.faq.contact}
          >
            <span className="cta__label">{dict.faq.contact}</span>
            <span className="cta__go" aria-hidden="true">
              <Telegram width={16} height={16} />
            </span>
          </a>
        </Reveal>

        <div className="faq-list">
          {data.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} className="faq-item" delay={i * 0.05}>
                <h3 className="faq-item__q">
                  <button
                    type="button"
                    className="faq-item__trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{loc(item.q, locale)}</span>
                    <span className="faq-item__icon">
                      {isOpen ? <Minus width={18} height={18} /> : <Plus width={18} height={18} />}
                    </span>
                  </button>
                </h3>
                <div className={`faq-item__panel${isOpen ? " is-open" : ""}`}>
                  <div className="faq-item__panel-inner">
                    {item.a.map((p, pi) => (
                      <p key={pi}>{loc(p, locale)}</p>
                    ))}
                    {item.list && (
                      <ul className="faq-item__list">
                        {item.list.map((li, li2) => (
                          <li key={li2}>{loc(li, locale)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

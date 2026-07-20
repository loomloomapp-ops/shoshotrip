import type { Locale, Localized } from "@/lib/i18n";
import { siteConfig } from "@/content/config";

/**
 * Legal document templates. Content is a genuine baseline draft with clearly
 * marked [PLACEHOLDER] fields the owner must fill. No invented legal data.
 */
export interface LegalDoc {
  slug: string;
  title: Localized;
  updated: string;
  body: Localized[]; // paragraphs; headings use "## " prefix
}

const L = (ua: string, en: string): Localized => ({ ua, en });
const pp = siteConfig.prepaymentPercent;

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: L("Політика конфіденційності", "Privacy Policy"),
    updated: "2026-07-01",
    body: [
      L(
        `Ця Політика конфіденційності описує, як ${siteConfig.brand} збирає, використовує та зберігає персональні дані користувачів сайту. Розпорядник даних: [LEGAL_NAME], [REGISTERED_ADDRESS], [EMAIL].`,
        `This Privacy Policy describes how ${siteConfig.brand} collects, uses and stores personal data of website users. Data controller: [LEGAL_NAME], [REGISTERED_ADDRESS], [EMAIL].`,
      ),
      L("## Які дані ми збираємо", "## What data we collect"),
      L(
        "Ми обробляємо дані, які ви добровільно залишаєте у формах: ім’я, номер телефону та, за бажанням, Telegram. Також автоматично можуть збиратися технічні дані (сторінка, реферер, UTM-мітки, час заявки) для обробки звернення.",
        "We process data you voluntarily provide in forms: name, phone number and, optionally, Telegram. Technical data (page, referrer, UTM tags, submission time) may also be collected automatically to process your request.",
      ),
      L("## Мета обробки", "## Purpose of processing"),
      L(
        "Дані використовуються виключно для зв’язку з вами, підбору й організації подорожі та відповіді на ваші запити. Ми не продаємо та не передаємо ваші дані третім сторонам, крім випадків, необхідних для надання послуги.",
        "Data is used solely to contact you, match and organize a trip, and answer your requests. We do not sell or share your data with third parties except where necessary to provide the service.",
      ),
      L("## Зберігання та ваші права", "## Storage and your rights"),
      L(
        "Ви маєте право отримати доступ до своїх даних, виправити або видалити їх, а також відкликати згоду. Для цього напишіть на [EMAIL].",
        "You have the right to access, correct or delete your data and to withdraw consent. To do so, write to [EMAIL].",
      ),
    ],
  },
  {
    slug: "public-offer",
    title: L("Публічна оферта", "Public Offer"),
    updated: "2026-07-01",
    body: [
      L(
        `Цей документ є публічною офертою [LEGAL_NAME] (далі — Виконавець) щодо надання послуг з організації авторських групових подорожей під брендом ${siteConfig.brand}.`,
        `This document is a public offer by [LEGAL_NAME] (the "Provider") to render services organizing author-led small-group trips under the ${siteConfig.brand} brand.`,
      ),
      L("## Предмет", "## Subject"),
      L(
        "Виконавець організовує подорож згідно з програмою конкретного туру, опублікованою на сайті. Замовник погоджується з умовами, залишаючи заявку та вносячи передоплату.",
        "The Provider organizes a trip according to the specific tour program published on the website. The Client accepts the terms by leaving a request and making a prepayment.",
      ),
      L("## Вартість і оплата", "## Price and payment"),
      L(
        `Вартість указана на сторінці туру. Бронювання підтверджується передоплатою в розмірі ${pp}%. Реквізити для оплати: [LEGAL_NAME], [TAX_ID].`,
        `The price is stated on the tour page. A booking is confirmed with a ${pp}% prepayment. Payment details: [LEGAL_NAME], [TAX_ID].`,
      ),
      L("## Відповідальність", "## Liability"),
      L(
        "Програма може коригуватися залежно від погоди, стану маршрутів і локальних умов. Виконавець не несе відповідальності за форс-мажорні обставини поза його контролем.",
        "The program may be adjusted depending on weather, trail conditions and local circumstances. The Provider is not liable for force-majeure events beyond its control.",
      ),
    ],
  },
  {
    slug: "booking-terms",
    title: L("Умови бронювання", "Booking Terms"),
    updated: "2026-07-01",
    body: [
      L("## Як забронювати", "## How to book"),
      L(
        "Щоб забронювати місце, залиште заявку на сайті або напишіть у Telegram, Instagram чи WhatsApp. Ми уточнимо деталі та підтвердимо наявність місць.",
        "To book a seat, leave a request on the website or message us on Telegram, Instagram or WhatsApp. We will clarify the details and confirm availability.",
      ),
      L("## Підтвердження", "## Confirmation"),
      L(
        `Бронювання вважається підтвердженим після внесення передоплати в розмірі ${pp}% від вартості послуги. Спосіб оплати: на банківську картку, на рахунок або готівкою.`,
        `A booking is considered confirmed after a ${pp}% prepayment of the service cost. Payment methods: bank card, bank account or cash.`,
      ),
      L("## Що входить", "## What is included"),
      L(
        "Перелік того, що входить і не входить у вартість, наведено на сторінці кожного туру.",
        "The list of what is and isn’t included is provided on each tour page.",
      ),
    ],
  },
  {
    slug: "payment-refund",
    title: L("Умови оплати та повернення", "Payment & Refund Terms"),
    updated: "2026-07-01",
    body: [
      L("## Оплата", "## Payment"),
      L(
        `Передоплата — ${pp}% від вартості. Решта суми сплачується у строк, зазначений у програмі туру або узгоджений із Виконавцем.`,
        `Prepayment is ${pp}% of the cost. The remaining amount is paid within the deadline stated in the tour program or agreed with the Provider.`,
      ),
      L("## Повернення коштів", "## Refunds"),
      L(
        "Умови повернення передоплати залежать від строку скасування та зазначаються в договорі до конкретного туру. Частина витрат, уже сплачених партнерам (проживання, транспорт, квитки), може бути неповоротною. Точні умови узгоджуються перед оплатою: [EMAIL].",
        "Prepayment refund conditions depend on the cancellation timing and are stated in the agreement for the specific tour. Part of the costs already paid to partners (accommodation, transport, tickets) may be non-refundable. Exact terms are agreed before payment: [EMAIL].",
      ),
    ],
  },
  {
    slug: "data-consent",
    title: L("Згода на обробку персональних даних", "Personal Data Consent"),
    updated: "2026-07-01",
    body: [
      L(
        `Залишаючи заявку, ви надаєте ${siteConfig.brand} ([LEGAL_NAME]) згоду на обробку зазначених персональних даних (ім’я, телефон, Telegram) з метою звʼязку та організації подорожі.`,
        `By submitting a request, you grant ${siteConfig.brand} ([LEGAL_NAME]) consent to process the personal data provided (name, phone, Telegram) for the purpose of contact and trip organization.`,
      ),
      L(
        "Згода діє до її відкликання. Ви можете відкликати згоду або запросити видалення даних, написавши на [EMAIL].",
        "The consent is valid until withdrawn. You may withdraw consent or request data deletion by writing to [EMAIL].",
      ),
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}

export const legalNav: { slug: string; key: "privacy" | "offer" | "booking" | "payment" | "dataConsent" }[] = [
  { slug: "privacy-policy", key: "privacy" },
  { slug: "public-offer", key: "offer" },
  { slug: "booking-terms", key: "booking" },
  { slug: "payment-refund", key: "payment" },
  { slug: "data-consent", key: "dataConsent" },
];

export function localizedLegalDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "ua" ? "uk-UA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

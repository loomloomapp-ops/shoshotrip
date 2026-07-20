import type { Localized } from "@/lib/i18n";

export interface FaqItem {
  q: Localized;
  a: Localized[]; // paragraphs
  list?: Localized[]; // optional bullet list appended
}

const L = (ua: string, en: string): Localized => ({ ua, en });

/** Homepage / general FAQ. Content per ShoSho Trip brief. */
export const homeFaq: FaqItem[] = [
  {
    q: L("Для кого підходять тури ShoSho Trip?", "Who are ShoSho Trip tours for?"),
    a: [
      L(
        "Наші подорожі підходять людям, які хочуть побачити більше, ніж пропонують стандартні туристичні програми. Важливо бути відкритими до нових знайомств, ранніх підйомів, активних прогулянок і невеликих пригод.",
        "Our trips are for people who want to see more than standard tourist programs offer. It matters to be open to new encounters, early mornings, active walks and small adventures.",
      ),
      L(
        "Для кожного туру ми окремо зазначаємо рівень фізичної підготовки. Якщо ви сумніваєтеся, залиште заявку — ми чесно підкажемо, чи підійде вам конкретний маршрут.",
        "For each tour we note the required fitness level separately. If you’re unsure, leave a request — we’ll honestly tell you whether a specific route fits you.",
      ),
    ],
  },
  {
    q: L("Що входить у вартість туру?", "What’s included in the tour price?"),
    a: [
      L(
        "Наповнення залежить від конкретного маршруту. На сторінці кожного туру окремо зазначається, що входить і не входить у вартість.",
        "It depends on the specific route. Each tour page separately lists what is and isn’t included.",
      ),
      L("Зазвичай у програму можуть входити:", "Typically the program may include:"),
    ],
    list: [
      L("проживання;", "accommodation;"),
      L("трансфери за маршрутом;", "transfers along the route;"),
      L("організація подорожі;", "trip organization;"),
      L("супровід Віктора й Андрія;", "guiding by Viktor and Andrii;"),
      L("частина активностей та екскурсій.", "part of the activities and excursions."),
    ],
  },
  {
    q: L("Які умови проживання?", "What are the accommodation conditions?"),
    a: [
      L(
        "Умови залежать від формату подорожі. Це можуть бути готелі, апартаменти, гостьові будинки або автентичне локальне житло.",
        "Conditions depend on the trip format. It can be hotels, apartments, guesthouses or authentic local housing.",
      ),
      L(
        "На сторінці туру завжди вказується формат розміщення та можливі особливості. Наші подорожі не завжди про максимальний комфорт, але ми заздалегідь чесно розповідаємо, до чого готуватися.",
        "The tour page always states the accommodation format and possible specifics. Our trips aren’t always about maximum comfort, but we honestly tell you in advance what to expect.",
      ),
    ],
  },
  {
    q: L("Що брати із собою?", "What should I bring?"),
    a: [
      L(
        "Після бронювання учасник отримує детальний список речей відповідно до сезону, країни та рівня активності.",
        "After booking, every participant receives a detailed packing list based on the season, country and activity level.",
      ),
      L("Зазвичай важливо мати:", "Usually it’s important to have:"),
    ],
    list: [
      L("зручне взуття;", "comfortable footwear;"),
      L("одяг для різних погодних умов;", "clothing for different weather;"),
      L("невеликий рюкзак;", "a small backpack;"),
      L("особисту аптечку;", "a personal first-aid kit;"),
      L("документи;", "documents;"),
      L("страхування.", "insurance."),
    ],
  },
  {
    q: L("Чи допомагаєте ви з авіаквитками?", "Do you help with flights?"),
    a: [
      L(
        "Так. Ми можемо допомогти знайти оптимальний маршрут, зручні рейси та пояснити, які квитки потрібно придбати.",
        "Yes. We can help find an optimal route, convenient flights and explain which tickets you need to buy.",
      ),
      L(
        "Умови придбання авіаквитків і точка зустрічі зазначаються в описі кожного туру.",
        "Ticket purchasing conditions and the meeting point are stated in each tour’s description.",
      ),
    ],
  },
  {
    q: L("Як забронювати тур?", "How do I book a tour?"),
    a: [
      L(
        "Щоб забронювати місце, потрібно залишити заявку на сайті або написати у Telegram, Instagram чи WhatsApp.",
        "To book a seat, leave a request on the website or message us on Telegram, Instagram or WhatsApp.",
      ),
      L(
        "Після уточнення деталей бронювання підтверджується передоплатою в розмірі 30% від вартості послуги. Доступні способи оплати: на банківську картку, на рахунок або готівкою.",
        "After we clarify the details, the booking is confirmed with a 30% prepayment of the service cost. Payment methods: bank card, bank account or cash.",
      ),
    ],
  },
];

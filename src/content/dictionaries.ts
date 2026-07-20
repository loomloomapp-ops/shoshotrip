import type { Locale } from "@/lib/i18n";

/**
 * All UI + marketing copy, per locale. UA is primary, EN is a full manual
 * translation (no machine translation). Owner-editable single source.
 */
export type Dict = (typeof dictionaries)["ua"];

export const dictionaries = {
  ua: {
    meta: {
      langName: "Українська",
      home: {
        title: "ShoSho Trip — авторські групові подорожі від Віктора й Андрія",
        description:
          "Авторські групові тури зі світанками, гірськими стежками та живими знайомствами. Маршрути за межами стандартних туристичних програм.",
      },
      tours: {
        title: "Тури ShoSho Trip — оберіть наступну пригоду",
        description:
          "Усі доступні авторські подорожі ShoSho Trip. Оберіть напрямок, дати й формат групи або пройдіть короткий тест на підбір туру.",
      },
    },
    nav: {
      about: "Про нас",
      emotions: "Емоції",
      tours: "Тури",
      why: "Чому ми",
      reviews: "Відгуки",
      faq: "FAQ",
      contacts: "Контакти",
      chooseTour: "Забронювати тур",
    },
    cta: {
      viewTours: "Переглянути тури",
      pickTrip: "Підібрати подорож",
      chooseTrip: "Обрати подорож",
      bookSeat: "Забронювати місце",
      wantSame: "Хочу так само",
      writeTelegram: "Написати в Telegram",
      details: "Детальніше",
      findTrip: "Знайти свою подорож",
      chooseAdventure: "Обрати свою пригоду",
      pickTourShort: "Підібрати тур",
    },
    hero: {
      title: "Подорожі, після ||яких відчуваєш, \nщо справді живеш",
      subtitle:
        "Авторські групові тури від Віктора й Андрія — зі світанками, гірськими стежками, \nживими знайомствами та маршрутами за межами стандартних туристичних програм.",
      markers: [
        "Авторські маршрути",
        "Невеликі групи",
        "Особистий супровід",
        "Нестандартні локації",
      ],
      cta: "Обрати подорож",
      rating: {
        score: "4.9",
        label: "ShoSho Trip",
        note: "На основі 47 відгуків мандрівників",
      },
      slider: {
        eyebrow: "Найближчі напрямки",
        from: "від",
      },
      videoUnavailable: "Відео недоступне",
    },
    emotions: {
      eyebrow: "Емоції на наших турах",
      title: "Це складно описати. \nКраще один ||раз відчути",
      text: "Без рекламних постановок. Тільки моменти, заради яких ми прокидаємося до світанку, звертаємо з туристичних маршрутів і вирушаємо далі.",
      captions: [
        "Зустріти світанок раніше за туристичні автобуси.",
        "Побачити краєвид, до якого потрібно дійти.",
        "Познайомитися з людьми, яких не зустрінеш у готельному холі.",
        "Повернутися додому трохи іншою людиною.",
      ],
    },
    toursSection: {
      eyebrow: "Доступні тури",
      title: "Обери наступну пригоду",
      subtitle:
        "У кожної подорожі свій темп, рівень активності та характер. Перегляньте програми або пройдіть короткий тест — ми допоможемо знайти вашу",
      allTours: "Усі тури",
      filters: {
        direction: "Напрямок",
        month: "Місяць",
        activity: "Активність",
        duration: "Тривалість",
        budget: "Бюджет",
        all: "Усі",
        reset: "Скинути фільтри",
      },
      empty: {
        title: "Немає турів за цими фільтрами",
        text: "Спробуйте змінити параметри або пройдіть тест — ми підберемо подорож індивідуально.",
      },
      card: {
        from: "від",
        days: "днів",
        seatsLeft: "вільних місць",
        groupSize: "у групі",
        level: "Рівень",
      },
    },
    why: {
      eyebrow: "Чому ShoSho Trip",
      title: "Ми не показуємо країну з вікна туристичного автобуса",
      text: "Ми створюємо маршрути, які хотіли б пройти самі. Без зайвих туристичних декорацій, але з місцями, людьми й моментами, заради яких варто вирушати в дорогу",
      cards: [
        {
          title: "Світанки замість черг",
          text: "Починаємо день там, де ще немає натовпу, шуму та стандартних туристичних маршрутів.",
        },
        {
          title: "Гірські стежки замість асфальту",
          text: "Обираємо маршрути, де потрібно трохи більше зусиль, але враження того варті.",
        },
        {
          title: "Живі знайомства замість туристичних шоу",
          text: "Знайомимося з людьми, культурою та справжньою атмосферою місць.",
        },
        {
          title: "Невеликі групи замість натовпу",
          text: "Подорожуємо камерно, щоб кожному було комфортно та цікаво.",
        },
        {
          title: "Справжня атмосфера замість програми для галочки",
          text: "Не намагаємося побачити все одразу — залишаємо час відчути місце.",
        },
        {
          title: "Враження замість гонитви за кількістю локацій",
          text: "Для нас важлива не кількість точок на карті, а те, що залишиться після подорожі.",
        },
      ],
    },
    founders: {
      eyebrow: "Хто їде з вами",
      title: "Віктор і Андрій",
      text: "Віктор і Андрій — два мандрівники, закохані у справжні пригоди. \nМи створюємо дійсно авторські тури для тих, хто хоче побачити світ за межами звичних туристичних маршрутів",
      viktor: {
        name: "Віктор",
        role: "Співзасновник • Автор маршрутів",
        bio: "Знає десятки місць, яких немає у туристичних путівниках.",
      },
      andriy: {
        name: "Андрій",
        role: "Співзасновник • Супровід груп",
        bio: "Тримає ритм групи так, щоб у дорозі було легко й цікаво кожному.",
      },
    },
    quiz: {
      eyebrow: "Тест на підбір туру",
      title: "Не знаєте, який тур обрати?",
      text: "Пройдіть короткий тест. Ми врахуємо ваші побажання, рівень фізичної підготовки та комфортний формат групи й запропонуємо подорож, яка вам підійде.",
      start: "Пройти тест",
      step: "Крок",
      of: "з",
      back: "Назад",
      next: "Далі",
      progress: "Прогрес тесту",
      steps: [
        {
          question: "Який формат подорожі вам ближчий?",
          options: [
            "Максимум природи та активностей",
            "Баланс активностей і відпочинку",
            "Більше атмосфери, культури та гастрономії",
            "Не знаю — хочу рекомендацію",
          ],
        },
        {
          question: "Як ви оцінюєте свою фізичну підготовку?",
          options: [
            "Мінімальна — комфортні прогулянки без складних підйомів",
            "Середня — можу активно ходити кілька годин",
            "Хороша — готовий до трекінгу та перепадів висоти",
            "Висока — люблю складні маршрути та виклики",
          ],
        },
        {
          question: "Який розмір групи вам комфортний?",
          options: ["До 8 людей", "8–12 людей", "12–16 людей", "Не має значення"],
        },
        {
          question: "З ким плануєте подорожувати?",
          options: [
            "Сам або сама",
            "З партнером",
            "З друзями",
            "Ще не вирішив або не вирішила",
          ],
        },
        {
          question: "Коли плануєте подорож?",
          options: [
            "Найближчі 1–2 місяці",
            "Через 3–6 місяців",
            "Пізніше",
            "Готовий до найближчої цікавої пропозиції",
          ],
        },
      ],
      final: {
        title: "Останній крок",
        text: "Залиште контакти — і ми надішлемо персональну добірку.",
        submit: "Отримати підбір туру",
      },
      success: {
        title: "Дякуємо!",
        text: "Ми переглянемо ваші відповіді та зв’яжемося з вами, щоб запропонувати відповідну подорож.",
      },
    },
    reviews: {
      eyebrow: "Відгуки",
      title: "Люди повертаються з подорожей. \nЕмоції залишаються",
      cta: "Обрати свою пригоду",
      prev: "Попередній відгук",
      next: "Наступний відгук",
      formats: { video: "Відеовідгук", message: "Повідомлення", photo: "Фото з подорожі" },
      tabs: { video: "Відео-відгуки", text: "Текстові відгуки" },
      empty: "Скоро тут з'являться відгуки цього формату.",
      profile: "Профіль автора",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Часті питання",
      contactText: "Не знайшли відповідь? \nНапишіть нам — підкажемо з вибором туру",
      contact: "Написати нам",
    },
    finalCta: {
      title: "Можливо, найкраща подорож року \nпочинається саме тут",
      text: "Оберіть готовий маршрут або розкажіть, якої пригоди вам хочеться. \nМи допоможемо знайти подорож, яка відповідатиме вашому темпу, підготовці та настрою",
    },
    footer: {
      tagline: "Авторські групові подорожі від Віктора й Андрія.",
      nav: "Навігація",
      contacts: "Контакти",
      docs: "Документи",
      rights: "Усі права захищено.",
      requisites: "Реквізити: ",
    },
    form: {
      name: "Ваше ім’я",
      namePlaceholder: "Як до вас звертатися",
      phone: "Номер телефону",
      telegram: "Telegram",
      telegramPlaceholder: "@username (необов’язково)",
      consent:
        "Погоджуюся з політикою конфіденційності та обробкою персональних даних.",
      sending: "Надсилаємо…",
      errors: {
        name: "Вкажіть ваше ім’я",
        phone: "Вкажіть коректний номер телефону",
        consent: "Потрібна згода на обробку даних",
        generic: "Не вдалося надіслати. Спробуйте ще раз або напишіть у Telegram.",
      },
      success: {
        title: "Заявку надіслано",
        text: "Дякуємо! Ми зв’яжемося з вами найближчим часом.",
      },
    },
    stickyCta: {
      label: "Підібрати тур",
    },
    widget: {
      trigger: "Є питання про тур?",
      lead: "Залишити заявку",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      close: "Закрити",
    },
    mobileMenu: {
      open: "Відкрити меню",
      close: "Закрити меню",
    },
    tourPage: {
      backToTours: "Усі тури",
      about: "Коротко про подорож",
      highlights: "Головні моменти",
      itinerary: "Програма по днях",
      itineraryNote:
        "Програма може коригуватися залежно від погоди, стану маршрутів і локальних умов.",
      day: "День",
      difficulty: "Фізична підготовка",
      difficultyLevels: ["Легкий", "Помірний", "Активний", "Складний"],
      distance: "Кілометраж",
      elevation: "Перепади висоти",
      activityTime: "Тривалість активностей",
      routeType: "Тип маршруту",
      experience: "Потрібний досвід",
      accommodation: "Проживання",
      roomType: "Тип житла",
      occupancy: "Людей у кімнаті",
      bathroom: "Санвузол",
      single: "Одномісне розміщення",
      included: "Що входить у вартість",
      excluded: "Що не входить у вартість",
      whoLeads: "Хто їде з вами",
      gallery: "Галерея",
      reviews: "Відгуки",
      faq: "Часті питання туру",
      bookTitle: "Забронювати місце",
      bookNote:
        "Бронювання підтверджується після внесення передоплати в розмірі 30%.",
      dates: "Дати",
      duration: "Тривалість",
      price: "Вартість",
      seats: "Вільні місця",
      groupSize: "Розмір групи",
      country: "Країна",
      region: "Регіон",
      similarReviews: "Відгуки учасників",
    },
    breadcrumbs: { home: "Головна", tours: "Тури" },
    availability: {
      available: "Є місця",
      last: "Залишилося 2 місця",
      recruiting: "Набір групи",
      soldout: "Місць немає",
      soon: "Скоро",
    },
    legal: {
      privacy: "Політика конфіденційності",
      offer: "Публічна оферта",
      booking: "Умови бронювання",
      payment: "Умови оплати та повернення",
      dataConsent: "Згода на обробку персональних даних",
      updated: "Оновлено",
    },
    common: {
      currency: "€",
      perPerson: "за особу",
      scrollHint: "",
    },
  },

  en: {
    meta: {
      langName: "English",
      home: {
        title: "ShoSho Trip — small-group author trips by Viktor & Andrii",
        description:
          "Author-led small-group trips with sunrises, mountain trails and real local encounters. Routes beyond the standard tourist programs.",
      },
      tours: {
        title: "ShoSho Trip tours — choose your next adventure",
        description:
          "All available ShoSho Trip journeys. Pick a direction, dates and group format, or take a short quiz and we will match a trip for you.",
      },
    },
    nav: {
      about: "About",
      emotions: "Emotions",
      tours: "Tours",
      why: "Why us",
      reviews: "Reviews",
      faq: "FAQ",
      contacts: "Contacts",
      chooseTour: "Book a tour",
    },
    cta: {
      viewTours: "View tours",
      pickTrip: "Match my trip",
      chooseTrip: "Choose a trip",
      bookSeat: "Book a seat",
      wantSame: "I want this too",
      writeTelegram: "Message on Telegram",
      details: "Details",
      findTrip: "Find your trip",
      chooseAdventure: "Choose your adventure",
      pickTourShort: "Match a tour",
    },
    hero: {
      title: "Trips that make you \nfeel truly alive",
      subtitle:
        "Author-led small-group tours by Viktor and Andrii — with sunrises, mountain trails, \nreal encounters and routes beyond the standard tourist programs.",
      markers: [
        "Author routes",
        "Small groups",
        "Personal guiding",
        "Off-the-map places",
      ],
      cta: "Choose your trip",
      rating: {
        score: "4.9",
        label: "ShoSho Trip",
        note: "Based on 47 traveller reviews",
      },
      slider: {
        eyebrow: "Upcoming destinations",
        from: "from",
      },
      videoUnavailable: "Video unavailable",
    },
    emotions: {
      eyebrow: "Emotions on our trips",
      title: "Hard to describe. \nBetter felt once",
      text: "No staged advertising. Only the moments we wake up before dawn for, step off the tourist routes for, and keep going.",
      captions: [
        "Meet the sunrise before the tour buses.",
        "Reach a view you actually have to walk to.",
        "Meet people you’d never find in a hotel lobby.",
        "Come home a slightly different person.",
      ],
    },
    toursSection: {
      eyebrow: "Available tours",
      title: "Choose your next adventure",
      subtitle:
        "Every journey has its own pace, activity level and character. Browse the programs or take a short quiz — we’ll help you find yours.",
      allTours: "All tours",
      filters: {
        direction: "Direction",
        month: "Month",
        activity: "Activity",
        duration: "Duration",
        budget: "Budget",
        all: "All",
        reset: "Reset filters",
      },
      empty: {
        title: "No tours match these filters",
        text: "Try different parameters, or take the quiz — we’ll match a trip for you.",
      },
      card: {
        from: "from",
        days: "days",
        seatsLeft: "seats left",
        groupSize: "in group",
        level: "Level",
      },
    },
    why: {
      eyebrow: "Why ShoSho Trip",
      title: "We don’t show you a country through a tour-bus window",
      text: "We build the routes we’d want to walk ourselves. No tourist decorations — just the places, people and moments worth setting out for.",
      cards: [
        {
          title: "Sunrises instead of queues",
          text: "We start the day where there are no crowds, no noise and no standard tourist routes yet.",
        },
        {
          title: "Mountain trails instead of asphalt",
          text: "We choose routes that ask for a little more effort, but the impressions are worth it.",
        },
        {
          title: "Real encounters instead of tourist shows",
          text: "We get to know the people, the culture and the true atmosphere of each place.",
        },
        {
          title: "Small groups instead of crowds",
          text: "We travel in an intimate format, so everyone feels comfortable and involved.",
        },
        {
          title: "Real atmosphere instead of a checkbox program",
          text: "We don’t try to see everything at once; we leave time to feel a place.",
        },
        {
          title: "Impressions instead of chasing a location count",
          text: "What matters to us is not the number of points on a map, but what stays with you after the trip.",
        },
      ],
    },
    founders: {
      eyebrow: "Who travels with you",
      title: "Viktor & Andrii",
      text: "Viktor and Andrii are two travellers in love with real adventure. \nWe create genuinely author-led tours for people who want to see the world beyond the usual tourist routes",
      viktor: {
        name: "Viktor",
        role: "Co-founder • Route author",
        bio: "Knows dozens of places you will not find in any travel guide.",
      },
      andriy: {
        name: "Andrii",
        role: "Co-founder • Group guide",
        bio: "Keeps the group's rhythm so the road feels easy for everyone.",
      },
    },
    quiz: {
      eyebrow: "Trip matcher",
      title: "Not sure which tour to choose?",
      text: "Take a short quiz. We’ll factor in your preferences, fitness level and comfortable group format, and suggest a trip that fits you.",
      start: "Take the quiz",
      step: "Step",
      of: "of",
      back: "Back",
      next: "Next",
      progress: "Quiz progress",
      steps: [
        {
          question: "Which trip format feels closer to you?",
          options: [
            "Maximum nature and activity",
            "A balance of activity and rest",
            "More atmosphere, culture and food",
            "Not sure — I’d like a recommendation",
          ],
        },
        {
          question: "How would you rate your fitness?",
          options: [
            "Minimal — comfortable walks, no hard climbs",
            "Medium — I can walk actively for a few hours",
            "Good — ready for trekking and altitude changes",
            "High — I love hard routes and challenges",
          ],
        },
        {
          question: "What group size is comfortable for you?",
          options: ["Up to 8 people", "8–12 people", "12–16 people", "Doesn’t matter"],
        },
        {
          question: "Who are you planning to travel with?",
          options: [
            "Solo",
            "With a partner",
            "With friends",
            "Haven’t decided yet",
          ],
        },
        {
          question: "When are you planning to travel?",
          options: [
            "In the next 1–2 months",
            "In 3–6 months",
            "Later",
            "Ready for the next interesting offer",
          ],
        },
      ],
      final: {
        title: "Last step",
        text: "Leave your contacts and we’ll send a personal selection.",
        submit: "Get my tour selection",
      },
      success: {
        title: "Thank you!",
        text: "We’ll review your answers and get in touch to suggest a fitting trip.",
      },
    },
    reviews: {
      eyebrow: "Reviews",
      title: "People come home from trips. \nThe emotions stay",
      cta: "Choose your adventure",
      prev: "Previous review",
      next: "Next review",
      formats: { video: "Video review", message: "Message", photo: "Trip photo" },
      tabs: { video: "Video reviews", text: "Text reviews" },
      empty: "Reviews in this format are coming soon.",
      profile: "Author profile",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      contactText: "Didn’t find your answer? Message us and we’ll help you choose a tour.",
      contact: "Message us",
    },
    finalCta: {
      title: "Maybe the best trip of your year starts right here",
      text: "Pick a ready route or tell us what kind of adventure you want. We’ll help you find a trip that fits your pace, fitness and mood.",
    },
    footer: {
      tagline: "Author-led small-group trips by Viktor and Andrii.",
      nav: "Navigation",
      contacts: "Contacts",
      docs: "Documents",
      rights: "All rights reserved.",
      requisites: "Business details: ",
    },
    form: {
      name: "Your name",
      namePlaceholder: "How should we call you",
      phone: "Phone number",
      telegram: "Telegram",
      telegramPlaceholder: "@username (optional)",
      consent:
        "I agree with the privacy policy and the processing of my personal data.",
      sending: "Sending…",
      errors: {
        name: "Please enter your name",
        phone: "Please enter a valid phone number",
        consent: "Consent to data processing is required",
        generic: "Couldn’t send. Please try again or message us on Telegram.",
      },
      success: {
        title: "Request sent",
        text: "Thank you! We’ll get in touch with you shortly.",
      },
    },
    stickyCta: { label: "Match a tour" },
    widget: {
      trigger: "Questions about a tour?",
      lead: "Leave a request",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      close: "Close",
    },
    mobileMenu: { open: "Open menu", close: "Close menu" },
    tourPage: {
      backToTours: "All tours",
      about: "About this trip",
      highlights: "Highlights",
      itinerary: "Day-by-day itinerary",
      itineraryNote:
        "The program may be adjusted depending on weather, trail conditions and local circumstances.",
      day: "Day",
      difficulty: "Fitness level",
      difficultyLevels: ["Easy", "Moderate", "Active", "Hard"],
      distance: "Distance",
      elevation: "Elevation gain",
      activityTime: "Activity time",
      routeType: "Route type",
      experience: "Experience needed",
      accommodation: "Accommodation",
      roomType: "Room type",
      occupancy: "People per room",
      bathroom: "Bathroom",
      single: "Single occupancy",
      included: "What’s included",
      excluded: "What’s not included",
      whoLeads: "Who travels with you",
      gallery: "Gallery",
      reviews: "Reviews",
      faq: "Tour FAQ",
      bookTitle: "Book a seat",
      bookNote: "Booking is confirmed after a 30% prepayment.",
      dates: "Dates",
      duration: "Duration",
      price: "Price",
      seats: "Seats left",
      groupSize: "Group size",
      country: "Country",
      region: "Region",
      similarReviews: "Traveller reviews",
    },
    breadcrumbs: { home: "Home", tours: "Tours" },
    availability: {
      available: "Seats available",
      last: "2 seats left",
      recruiting: "Group forming",
      soldout: "Sold out",
      soon: "Coming soon",
    },
    legal: {
      privacy: "Privacy Policy",
      offer: "Public Offer",
      booking: "Booking Terms",
      payment: "Payment & Refund Terms",
      dataConsent: "Personal Data Consent",
      updated: "Updated",
    },
    common: { currency: "€", perPerson: "per person", scrollHint: "" },
  },
} satisfies Record<Locale, unknown>;

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] as Dict;
}

import type { Locale, Localized } from "@/lib/i18n";
import { buildGallery } from "@/content/media";

/**
 * CENTRALIZED TOUR DATA — single source of truth.
 * OWNER: edit / add tours here only. Do not duplicate tour content in components.
 * Demo tours below use realistic content flagged with `demo: true`.
 * Replace gallery seeds with real assets under /public/tours.
 */

export type TourStatus = "available" | "last" | "recruiting" | "soldout" | "soon";
/** 1..4 → light / moderate / active / hard */
export type Difficulty = 1 | 2 | 3 | 4;
export type ActivityType = "nature" | "trekking" | "culture" | "balanced";

export interface ItineraryDay {
  title: Localized;
  route: Localized;
  activities: Localized;
  transferTime: Localized;
  load: Localized;
  meals: Localized;
  stay: Localized;
  note?: Localized;
}

export interface TourFaqItem {
  q: Localized;
  a: Localized;
}

export interface Tour {
  id: string;
  slug: string;
  demo: boolean;
  country: Localized;
  region: Localized;
  name: Localized;
  datesLabel: Localized;
  startISO: string; // for ordering / schema
  durationDays: number;
  price: number;
  currency: string;
  seatsLeft: number;
  seatsTotal: number;
  status: TourStatus;
  difficulty: Difficulty;
  activity: ActivityType;
  groupSize: Localized;
  highlight: Localized; // one-line card feature
  shortDescription: Localized;
  fullDescription: Localized;
  highlights: Localized[];
  itinerary: ItineraryDay[];
  physical: {
    distanceKm: string;
    elevation: Localized;
    activityTime: Localized;
    routeType: Localized;
    experience: Localized;
  };
  accommodation: {
    type: Localized;
    occupancy: Localized;
    bathroom: Localized;
    single: Localized;
    features: Localized[];
  };
  included: Localized[];
  excluded: Localized[];
  gallery: string[]; // image URLs (demo: picsum seeds)
  videos: string[];
  reviewIds: string[];
  faq: TourFaqItem[];
  seo: { title: Localized; description: Localized };
}

const L = (ua: string, en: string): Localized => ({ ua, en });

/* --------------------------------------------------------------------- */

export const tours: Tour[] = [
  {
    id: "carpathians-sunrise",
    slug: "carpathians-sunrise",
    demo: true,
    country: L("Україна", "Ukraine"),
    region: L("Карпати, Чорногірський хребет", "Carpathians, Chornohora ridge"),
    name: L("Карпати: світанки на хребті", "Carpathians: sunrises on the ridge"),
    datesLabel: L("12–17 вересня 2026", "12–17 September 2026"),
    startISO: "2026-09-12",
    durationDays: 6,
    price: 640,
    currency: "€",
    seatsLeft: 4,
    seatsTotal: 12,
    status: "available",
    difficulty: 3,
    activity: "trekking",
    groupSize: L("8–12 людей", "8–12 people"),
    highlight: L(
      "Три світанки над хмарами на найвищих вершинах Чорногори",
      "Three above-the-clouds sunrises on Chornohora’s highest peaks",
    ),
    shortDescription: L(
      "Шість днів на головному хребті українських Карпат: нічівлі в наметах і колибах, підйом на Говерлу до світанку, дикі полонини й вечори біля ватри.",
      "Six days on the main ridge of the Ukrainian Carpathians: nights in tents and shepherd huts, a pre-dawn climb up Hoverla, wild meadows and evenings by the fire.",
    ),
    fullDescription: L(
      "Це маршрут для тих, хто хоче побачити Карпати не з оглядового майданчика, а зсередини. Ми пройдемо класичну лінію Чорногори, але зробимо це у своєму темпі: піднімемося на вершини до того, як туди дійдуть організовані групи, зустрінемо світанки над морем хмар і заночуємо там, звідки видно і зорі, і далекі вогні сіл. Дні активні, з перепадами висоти, зате нагорода — тиша й краєвиди, які неможливо передати фото.",
      "This route is for those who want to see the Carpathians from the inside, not from a viewing platform. We’ll walk the classic Chornohora line, but at our own pace: climbing the peaks before the organized groups arrive, meeting sunrises above a sea of clouds and sleeping where you can see both the stars and the distant village lights. The days are active with real elevation, but the reward is silence and views no photo can carry.",
    ),
    highlights: [
      L("Зустрінемо світанок на Говерлі до туристичних груп", "Meet the sunrise on Hoverla before the crowds"),
      L("Пройдемо нетуристичною стежкою через полонини", "Walk an off-tourist trail across wild meadows"),
      L("Заночуємо в горах під зоряним небом", "Spend a night in the mountains under the stars"),
      L("Спробуємо справжню гуцульську кухню в колибі", "Taste real Hutsul food in a shepherd’s hut"),
      L("Побачимо озеро Несамовите на світанку", "See Nesamovyte lake at dawn"),
    ],
    itinerary: [
      {
        title: L("Збір і акліматизація", "Arrival and warm-up"),
        route: L("Яремче — Заросляк", "Yaremche — Zaroslyak"),
        activities: L("Знайомство групи, легкий вихід до водоспаду", "Group meet-up, easy hike to a waterfall"),
        transferTime: L("2 год трансфер, 2 год прогулянка", "2 h transfer, 2 h walk"),
        load: L("Легке", "Light"),
        meals: L("Вечеря", "Dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Підйом на Говерлу", "Climbing Hoverla"),
        route: L("Заросляк — Говерла — Брескул", "Zaroslyak — Hoverla — Breskul"),
        activities: L("Сходження на найвищу вершину, вихід на хребет", "Summit of the highest peak, onto the ridge"),
        transferTime: L("7–8 год трекінгу", "7–8 h trekking"),
        load: L("Високе", "High"),
        meals: L("Сніданок, перекус", "Breakfast, trail snack"),
        stay: L("Намети на хребті", "Tents on the ridge"),
        note: L("Ранній підйом заради світанку", "Early start for the sunrise"),
      },
      {
        title: L("Хребет і озеро Несамовите", "The ridge and Nesamovyte lake"),
        route: L("Туркул — Несамовите — Пожижевська", "Turkul — Nesamovyte — Pozhyzhevska"),
        activities: L("Перехід хребтом, купання охочих в озері", "Ridge traverse, a swim for the brave"),
        transferTime: L("6 год трекінгу", "6 h trekking"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Колиба", "Shepherd hut"),
      },
      {
        title: L("Полонини й локальна культура", "Meadows and local culture"),
        route: L("Пожижевська — полонина Гаджина", "Pozhyzhevska — Hadzhyna meadow"),
        activities: L("Знайомство з вівчарями, дегустація бринзи", "Meeting shepherds, tasting fresh cheese"),
        transferTime: L("4 год прогулянки", "4 h walking"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Колиба", "Shepherd hut"),
      },
      {
        title: L("Спуск і термальні джерела", "Descent and thermal springs"),
        route: L("Полонина — Яремче", "Meadow — Yaremche"),
        activities: L("Спуск у долину, відпочинок у термах", "Descent to the valley, rest at the springs"),
        transferTime: L("5 год спуску", "5 h descent"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок", "Breakfast"),
        stay: L("Готель", "Hotel"),
      },
      {
        title: L("Прощальний ранок", "Farewell morning"),
        route: L("Яремче", "Yaremche"),
        activities: L("Вільний ранок, від’їзд", "Free morning, departure"),
        transferTime: L("—", "—"),
        load: L("Легке", "Light"),
        meals: L("Сніданок", "Breakfast"),
        stay: L("—", "—"),
      },
    ],
    physical: {
      distanceKm: "≈ 62 km",
      elevation: L("до +1400 м за день", "up to +1400 m per day"),
      activityTime: L("6–8 годин активності на день", "6–8 hours of activity per day"),
      routeType: L("Гірський трекінг з ночівлями", "Mountain trekking with overnights"),
      experience: L("Бажаний досвід багатоденних походів", "Multi-day hiking experience preferred"),
    },
    accommodation: {
      type: L("Гостьові будинки, колиби, намети", "Guesthouses, shepherd huts, tents"),
      occupancy: L("2–4 людини", "2–4 people"),
      bathroom: L("Спільний на хребті, окремий у долині", "Shared on the ridge, private in the valley"),
      single: L("Можливе в долині за доплату", "Available in the valley for a surcharge"),
      features: [
        L("Спальники видаємо за потреби", "Sleeping bags provided if needed"),
        L("Гаряча вечеря щодня", "Hot dinner every day"),
      ],
    },
    included: [
      L("Супровід Віктора й Андрія на всьому маршруті", "Guiding by Viktor and Andrii along the whole route"),
      L("Проживання за програмою", "Accommodation per the program"),
      L("Трансфери за маршрутом", "Transfers along the route"),
      L("Груповий спорядження та аптечка", "Group gear and first-aid kit"),
      L("Частина харчування (сніданки й вечері)", "Part of the meals (breakfasts and dinners)"),
    ],
    excluded: [
      L("Дорога до Яремче й назад", "Travel to Yaremche and back"),
      L("Обіди й перекуси поза програмою", "Lunches and snacks outside the program"),
      L("Особисте спорядження", "Personal gear"),
      L("Страхування", "Insurance"),
      L("Особисті витрати", "Personal expenses"),
    ],
    gallery: buildGallery(0),
    videos: [],
    reviewIds: ["r1", "r3"],
    faq: [
      {
        q: L("Де і коли зустрічаємося?", "Where and when do we meet?"),
        a: L(
          "Точка зустрічі — Яремче, ранок першого дня. Точний час і локацію надсилаємо після бронювання.",
          "The meeting point is Yaremche, on the morning of day one. Exact time and location are sent after booking.",
        ),
      },
      {
        q: L("Наскільки складний маршрут?", "How hard is the route?"),
        a: L(
          "Рівень 3 з 4. Потрібна впевнена фізична форма і бажано досвід багатоденних походів.",
          "Level 3 of 4. Solid fitness is required, and multi-day hiking experience is preferred.",
        ),
      },
      {
        q: L("Яка погода у вересні?", "What’s the weather like in September?"),
        a: L(
          "Вдень +10…+18 °C, вночі в горах може бути близько 0 °C. Детальний список одягу надсилаємо заздалегідь.",
          "Daytime +10…+18 °C, nights in the mountains can drop near 0 °C. We send a detailed clothing list in advance.",
        ),
      },
    ],
    seo: {
      title: L(
        "Тур у Карпати: світанки на хребті — ShoSho Trip",
        "Carpathians ridge trek: sunrises tour — ShoSho Trip",
      ),
      description: L(
        "6-денний авторський трекінг Чорногорою: Говерла на світанку, ночівлі в горах, полонини та гуцульська кухня.",
        "A 6-day author-led Chornohora trek: Hoverla at dawn, mountain overnights, wild meadows and Hutsul food.",
      ),
    },
  },

  {
    id: "georgia-svaneti",
    slug: "georgia-svaneti",
    demo: true,
    country: L("Грузія", "Georgia"),
    region: L("Сванетія, Верхня Сванетія", "Svaneti, Upper Svaneti"),
    name: L("Грузія: Сванетія без асфальту", "Georgia: Svaneti off the asphalt"),
    datesLabel: L("3–11 жовтня 2026", "3–11 October 2026"),
    startISO: "2026-10-03",
    durationDays: 9,
    price: 980,
    currency: "€",
    seatsLeft: 2,
    seatsTotal: 12,
    status: "last",
    difficulty: 3,
    activity: "balanced",
    groupSize: L("10–14 людей", "10–14 people"),
    highlight: L(
      "Середньовічні вежі Ушгулі, трекінг до льодовика і застілля з місцевими",
      "Ushguli’s medieval towers, a glacier trek and a feast with locals",
    ),
    shortDescription: L(
      "Дев’ять днів у краю кам’яних веж: трекінг між гірськими селами, найвище постійне поселення Європи, домашнє грузинське застілля й краєвиди Шхари.",
      "Nine days in the land of stone towers: trekking between mountain villages, Europe’s highest permanent settlement, a home Georgian feast and the views of Shkhara.",
    ),
    fullDescription: L(
      "Сванетія — це інша Грузія: сувора, автентична й гостинна водночас. Ми пройдемо класичний трек Мествія — Ушгулі, але не поспішаючи, з ночівлями в родинних гостьових будинках, де вечеря перетворюється на справжнє застілля. Побачимо льодовик Шхари, середньовічні вежі, яким тисяча років, і навчимося трохи розуміти людей, для яких гори — це дім, а не маршрут.",
      "Svaneti is a different Georgia: severe, authentic and hospitable at once. We’ll walk the classic Mestia–Ushguli trek, but unhurried, with nights in family guesthouses where dinner becomes a real feast. We’ll see the Shkhara glacier, thousand-year-old medieval towers, and learn to understand a little the people for whom the mountains are home, not a route.",
    ),
    highlights: [
      L("Дійдемо до найвищого села Європи — Ушгулі", "Reach Europe’s highest village — Ushguli"),
      L("Трек до підніжжя льодовика Шхара", "Trek to the foot of the Shkhara glacier"),
      L("Вечеря-застілля в родині сванів", "A feast dinner with a Svan family"),
      L("Підйом до озер Корульді на світанку", "Sunrise climb to the Koruldi lakes"),
      L("Дегустація домашнього вина й чачі", "Tasting home wine and chacha"),
    ],
    itinerary: [
      {
        title: L("Приліт і дорога в гори", "Arrival and the road to the mountains"),
        route: L("Кутаїсі — Местія", "Kutaisi — Mestia"),
        activities: L("Трансфер через перевали, вечеря знайомства", "Transfer over the passes, welcome dinner"),
        transferTime: L("5 год трансфер", "5 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Вечеря", "Dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Озера Корульді", "Koruldi lakes"),
        route: L("Местія — хрест — озера Корульді", "Mestia — the cross — Koruldi lakes"),
        activities: L("Акліматизаційний трек з панорамою Ушби", "Acclimatization trek with Ushba panorama"),
        transferTime: L("6 год трекінгу", "6 h trekking"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Перехід у Жабеші", "Crossing to Zhabeshi"),
        route: L("Местія — Жабеші", "Mestia — Zhabeshi"),
        activities: L("Перший день класичного треку", "First day of the classic trek"),
        transferTime: L("6–7 год трекінгу", "6–7 h trekking"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Родинний дім", "Family home"),
      },
      {
        title: L("Перевал Гуулі", "The Guuli pass"),
        route: L("Жабеші — Адіші", "Zhabeshi — Adishi"),
        activities: L("Найкрасивіший перевал маршруту", "The most scenic pass of the route"),
        transferTime: L("7 год трекінгу", "7 h trekking"),
        load: L("Високе", "High"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
        note: L("Переправа через гірську річку", "River crossing on the way"),
      },
      {
        title: L("Льодовик Адіші", "Adishi glacier"),
        route: L("Адіші — Іпрарі", "Adishi — Iprari"),
        activities: L("Вихід до льодовика й перевал Чхутнієрі", "Glacier viewpoint and Chkhutnieri pass"),
        transferTime: L("6 год трекінгу", "6 h trekking"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Ушгулі", "Ushguli"),
        route: L("Іпрарі — Ушгулі", "Iprari — Ushguli"),
        activities: L("Прихід у найвище село Європи", "Arriving at Europe’s highest village"),
        transferTime: L("4 год трекінгу", "4 h trekking"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Підніжжя Шхари", "The foot of Shkhara"),
        route: L("Ушгулі — льодовик Шхара — Ушгулі", "Ushguli — Shkhara glacier — Ushguli"),
        activities: L("Радіальний вихід до льодовика", "Out-and-back trek to the glacier"),
        transferTime: L("5 год трекінгу", "5 h trekking"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Повернення і застілля", "Return and feast"),
        route: L("Ушгулі — Местія", "Ushguli — Mestia"),
        activities: L("Трансфер, прощальне грузинське застілля", "Transfer, farewell Georgian feast"),
        transferTime: L("3 год трансфер", "3 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, застілля", "Breakfast, feast"),
        stay: L("Гостьовий будинок", "Guesthouse"),
      },
      {
        title: L("Від’їзд", "Departure"),
        route: L("Местія — Кутаїсі", "Mestia — Kutaisi"),
        activities: L("Трансфер до аеропорту", "Transfer to the airport"),
        transferTime: L("5 год трансфер", "5 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок", "Breakfast"),
        stay: L("—", "—"),
      },
    ],
    physical: {
      distanceKm: "≈ 58 km",
      elevation: L("до +1000 м за день", "up to +1000 m per day"),
      activityTime: L("5–7 годин активності на день", "5–7 hours of activity per day"),
      routeType: L("Хат-ту-хат трекінг", "Hut-to-hut trekking"),
      experience: L("Достатньо середньої фізичної форми", "Medium fitness is enough"),
    },
    accommodation: {
      type: L("Родинні гостьові будинки", "Family guesthouses"),
      occupancy: L("2–3 людини", "2–3 people"),
      bathroom: L("Переважно окремий", "Mostly private"),
      single: L("Можливе за доплату", "Available for a surcharge"),
      features: [
        L("Домашня грузинська кухня щодня", "Home Georgian cooking daily"),
        L("Перенесення багажу між селами", "Luggage transfer between villages"),
      ],
    },
    included: [
      L("Супровід Віктора й Андрія", "Guiding by Viktor and Andrii"),
      L("Проживання в гостьових будинках", "Accommodation in guesthouses"),
      L("Сніданки й вечері", "Breakfasts and dinners"),
      L("Усі трансфери за програмою", "All transfers per the program"),
      L("Перенесення основного багажу", "Main luggage transfer"),
    ],
    excluded: [
      L("Авіаквитки до Кутаїсі", "Flights to Kutaisi"),
      L("Обіди на маршруті", "Lunches on the route"),
      L("Страхування", "Insurance"),
      L("Особисті витрати", "Personal expenses"),
    ],
    gallery: buildGallery(3),
    videos: [],
    reviewIds: ["r2"],
    faq: [
      {
        q: L("Де точка зустрічі?", "Where is the meeting point?"),
        a: L(
          "Аеропорт Кутаїсі. Ми підбираємо групу й разом їдемо в гори.",
          "Kutaisi airport. We gather the group and drive to the mountains together.",
        ),
      },
      {
        q: L("Чи потрібен досвід трекінгу?", "Do I need trekking experience?"),
        a: L(
          "Бажаний, але достатньо середньої форми: щодня ходимо 5–7 годин з рюкзаком на день.",
          "Preferred, but medium fitness is enough: we walk 5–7 hours a day with a daypack.",
        ),
      },
    ],
    seo: {
      title: L(
        "Тур у Грузію: Сванетія і трек до Ушгулі — ShoSho Trip",
        "Georgia tour: Svaneti trek to Ushguli — ShoSho Trip",
      ),
      description: L(
        "9-денна авторська подорож Сванетією: трек Местія — Ушгулі, льодовик Шхара, вежі й грузинське застілля.",
        "A 9-day author-led Svaneti journey: the Mestia–Ushguli trek, the Shkhara glacier, stone towers and a Georgian feast.",
      ),
    },
  },

  {
    id: "morocco-atlas",
    slug: "morocco-atlas",
    demo: true,
    country: L("Марокко", "Morocco"),
    region: L("Високий Атлас і Сахара", "High Atlas and the Sahara"),
    name: L("Марокко: від Атласу до дюн", "Morocco: from the Atlas to the dunes"),
    datesLabel: L("14–22 листопада 2026", "14–22 November 2026"),
    startISO: "2026-11-14",
    durationDays: 9,
    price: 1150,
    currency: "€",
    seatsLeft: 12,
    seatsTotal: 14,
    status: "recruiting",
    difficulty: 2,
    activity: "culture",
    groupSize: L("12–16 людей", "12–16 people"),
    highlight: L(
      "Берберські села, ночівля в наметах серед дюн і ранок у пустелі",
      "Berber villages, a night in tents among the dunes and a desert dawn",
    ),
    shortDescription: L(
      "Дев’ять днів контрастів: лабіринти Марракеша, перевали Високого Атласу, берберська гостинність і ніч під зорями серед піщаних дюн Сахари.",
      "Nine days of contrasts: the labyrinths of Marrakech, High Atlas passes, Berber hospitality and a night under the stars among the Sahara dunes.",
    ),
    fullDescription: L(
      "Це найм’якший за навантаженням маршрут ShoSho Trip і водночас один із найяскравіших за враженнями. Ми починаємо в гарячому Марракеші, піднімаємося в береберські села Атласу, ночуємо в родинних ріадах і закінчуємо тим, заради чого варто їхати в Марокко, — ніччю в пустелі, коли навколо тільки пісок, тиша й неймовірна кількість зірок.",
      "This is the gentlest ShoSho Trip route by load and at the same time one of the brightest by impressions. We start in hot Marrakech, climb into the Berber villages of the Atlas, sleep in family riads and finish with the reason to come to Morocco at all — a night in the desert, when there’s only sand, silence and an unbelievable number of stars.",
    ),
    highlights: [
      L("Загубимося в медині Марракеша з місцевим гідом", "Get lost in the Marrakech medina with a local guide"),
      L("Пройдемо берберськими стежками Атласу", "Walk Berber trails in the Atlas"),
      L("Заночуємо в наметовому таборі серед дюн", "Sleep in a tented camp among the dunes"),
      L("Зустрінемо світанок у пустелі Сахара", "Meet the sunrise in the Sahara"),
      L("Спробуємо справжній таджин у берберській родині", "Taste a real tagine with a Berber family"),
    ],
    itinerary: [
      {
        title: L("Марракеш", "Marrakech"),
        route: L("Приліт — медина", "Arrival — medina"),
        activities: L("Прогулянка старим містом, площа Джемаа-ель-Фна", "Old-town walk, Jemaa el-Fnaa square"),
        transferTime: L("1 год трансфер", "1 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Вечеря", "Dinner"),
        stay: L("Ріад", "Riad"),
      },
      {
        title: L("В Атлас", "Into the Atlas"),
        route: L("Марракеш — долина Іміль", "Marrakech — Imlil valley"),
        activities: L("Трансфер у гори, легкий вихід до села", "Transfer to the mountains, easy village walk"),
        transferTime: L("2 год трансфер, 2 год прогулянка", "2 h transfer, 2 h walk"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гірський гестхаус", "Mountain guesthouse"),
      },
      {
        title: L("Берберські села", "Berber villages"),
        route: L("Іміль — навколишні села", "Imlil — surrounding villages"),
        activities: L("Трекінг між селами, обід у родині", "Village-to-village trek, lunch with a family"),
        transferTime: L("5 год трекінгу", "5 h trekking"),
        load: L("Помірне", "Moderate"),
        meals: L("Сніданок, обід, вечеря", "Breakfast, lunch, dinner"),
        stay: L("Гірський гестхаус", "Mountain guesthouse"),
      },
      {
        title: L("Перевал Тізі-н-Тічка", "Tizi n’Tichka pass"),
        route: L("Атлас — Айт-Бен-Хадду", "Atlas — Ait Ben Haddou"),
        activities: L("Переїзд через перевал, старовинна касба", "Drive over the pass, ancient kasbah"),
        transferTime: L("4 год трансфер", "4 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Ріад", "Riad"),
      },
      {
        title: L("Долина Драа", "The Draa valley"),
        route: L("Айт-Бен-Хадду — Загора", "Ait Ben Haddou — Zagora"),
        activities: L("Дорога оазисами й пальмовими гаями", "Drive through oases and palm groves"),
        transferTime: L("5 год трансфер", "5 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Гестхаус", "Guesthouse"),
      },
      {
        title: L("Ніч у пустелі", "Night in the desert"),
        route: L("Загора — дюни Ерг-Легзіра", "Zagora — Erg Lehzira dunes"),
        activities: L("Верблюди на захід сонця, ночівля в таборі", "Camels at sunset, night in the camp"),
        transferTime: L("2 год трансфер, 1 год на верблюдах", "2 h transfer, 1 h by camel"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря біля вогню", "Breakfast, dinner by the fire"),
        stay: L("Наметовий табір", "Tented camp"),
        note: L("Світанок серед дюн", "Sunrise among the dunes"),
      },
      {
        title: L("Назад через гори", "Back through the mountains"),
        route: L("Пустеля — Уарзазат", "Desert — Ouarzazate"),
        activities: L("Дорога назад, кіностудії Уарзазата", "Drive back, Ouarzazate film studios"),
        transferTime: L("4 год трансфер", "4 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Ріад", "Riad"),
      },
      {
        title: L("Повернення в Марракеш", "Return to Marrakech"),
        route: L("Уарзазат — Марракеш", "Ouarzazate — Marrakech"),
        activities: L("Вільний вечір, прощальна вечеря", "Free evening, farewell dinner"),
        transferTime: L("4 год трансфер", "4 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок, вечеря", "Breakfast, dinner"),
        stay: L("Ріад", "Riad"),
      },
      {
        title: L("Від’їзд", "Departure"),
        route: L("Марракеш", "Marrakech"),
        activities: L("Трансфер до аеропорту", "Transfer to the airport"),
        transferTime: L("1 год трансфер", "1 h transfer"),
        load: L("Легке", "Light"),
        meals: L("Сніданок", "Breakfast"),
        stay: L("—", "—"),
      },
    ],
    physical: {
      distanceKm: "≈ 24 km трекінгу",
      elevation: L("невеликі перепади", "gentle elevation"),
      activityTime: L("2–5 годин активності на день", "2–5 hours of activity per day"),
      routeType: L("Культурний маршрут з легким трекінгом", "Cultural route with light trekking"),
      experience: L("Досвід не потрібен", "No experience needed"),
    },
    accommodation: {
      type: L("Ріади, гестхауси, наметовий табір", "Riads, guesthouses, tented camp"),
      occupancy: L("2 людини", "2 people"),
      bathroom: L("Окремий, крім табору в пустелі", "Private, except the desert camp"),
      single: L("Можливе за доплату", "Available for a surcharge"),
      features: [
        L("Автентичні ріади в старому місті", "Authentic riads in the old town"),
        L("Наметовий табір із матрацами й ковдрами", "Tented camp with mattresses and blankets"),
      ],
    },
    included: [
      L("Супровід Віктора й Андрія", "Guiding by Viktor and Andrii"),
      L("Проживання за програмою", "Accommodation per the program"),
      L("Сніданки й вечері, частина обідів", "Breakfasts, dinners and some lunches"),
      L("Усі трансфери комфортним транспортом", "All transfers by comfortable transport"),
      L("Верблюди та ніч у пустелі", "Camels and the desert night"),
    ],
    excluded: [
      L("Авіаквитки до Марракеша", "Flights to Marrakech"),
      L("Обіди поза програмою", "Lunches outside the program"),
      L("Вхідні квитки в деякі локації", "Entrance fees at some locations"),
      L("Страхування", "Insurance"),
    ],
    gallery: buildGallery(6),
    videos: [],
    reviewIds: ["r4"],
    faq: [
      {
        q: L("Наскільки це фізично складно?", "How physically demanding is it?"),
        a: L(
          "Рівень 2 з 4. Маршрут підходить навіть без досвіду трекінгу — переходи короткі.",
          "Level 2 of 4. The route suits people without trekking experience — the walks are short.",
        ),
      },
      {
        q: L("Що вдягати в пустелі вночі?", "What to wear in the desert at night?"),
        a: L(
          "Уночі в пустелі прохолодно, тож потрібна тепла кофта. Детальний список надсилаємо після бронювання.",
          "Desert nights are cool, so bring a warm layer. We send a detailed list after booking.",
        ),
      },
    ],
    seo: {
      title: L(
        "Тур у Марокко: Атлас, Сахара і берберські села — ShoSho Trip",
        "Morocco tour: Atlas, Sahara and Berber villages — ShoSho Trip",
      ),
      description: L(
        "9-денна авторська подорож Марокко: Марракеш, Високий Атлас, ніч у наметах серед дюн Сахари й берберська гостинність.",
        "A 9-day author-led Morocco journey: Marrakech, the High Atlas, a night in tents among the Sahara dunes and Berber hospitality.",
      ),
    },
  },
];

/* ---- helpers ---- */
export function getAllTours(): Tour[] {
  return [...tours].sort((a, b) => a.startISO.localeCompare(b.startISO));
}
export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
export function loc(value: Localized, locale: Locale): string {
  return value[locale];
}

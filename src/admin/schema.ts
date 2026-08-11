/**
 * Field schemas for the admin panel.
 *
 * Every editable entity is described once, here, and the form engine renders
 * it. Writing bespoke forms for a Tour (30+ fields, half of them bilingual,
 * three nested lists) would be a wall of near-identical JSX that drifts out of
 * sync with the types the site actually reads.
 *
 * When a field is added to `Tour`, `Review` or `TeamMember`, add it here too
 * and the editor picks it up.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "image"
  | "i18n" // Localized, single line
  | "i18n-area" // Localized, multi-line
  | "i18n-list" // Localized[]
  | "string-list" // string[]
  | "i18n-paragraphs" // { ua: string[]; en: string[] }
  | "group" // fixed set of sub-fields
  | "list"; // repeating set of sub-fields

export interface Field {
  key: string;
  /** Ukrainian label — the panel is used in Ukrainian. */
  label: string;
  kind: FieldKind;
  /** Shown under the input; use it for rules that are easy to get wrong. */
  hint?: string;
  options?: Array<{ value: string | number; label: string }>;
  /** Sub-fields for `group` and `list`. */
  fields?: Field[];
  /** For `list`: which sub-field to show in the collapsed row header. */
  titleKey?: string;
  /** For `list`: label of the "add" button. */
  addLabel?: string;
  /** Blocks saving while empty. */
  required?: boolean;
  /** Full width in the two-column form grid. */
  wide?: boolean;
}

export interface EntitySchema {
  /** Storage key + route segment. */
  name: "tours" | "team" | "reviews";
  title: string;
  /** JSON file in the repository. */
  path: string;
  /** Field whose value labels a row in the list view. */
  labelKey: string;
  /** Field used as the stable identity. */
  idKey: string;
  fields: Field[];
  /** A blank record for "add new". */
  blank: () => Record<string, unknown>;
}

const L = () => ({ ua: "", en: "" });

/* ---- Tours --------------------------------------------------------------- */

const itineraryDay: Field[] = [
  { key: "title", label: "Назва дня", kind: "i18n", required: true },
  { key: "route", label: "Маршрут", kind: "i18n", hint: "Наприклад: Марракеш — медина" },
  { key: "activities", label: "Опис дня", kind: "i18n-area", wide: true },
  { key: "transferTime", label: "Дорога", kind: "i18n" },
  { key: "load", label: "Навантаження", kind: "i18n" },
  { key: "meals", label: "Харчування", kind: "i18n" },
  { key: "stay", label: "Ночівля", kind: "i18n" },
  {
    key: "photo",
    label: "Фото дня",
    kind: "image",
    hint: "Не обов'язково. Якщо порожньо — береться фото з галереї туру.",
    wide: true,
  },
];

const tourFields: Field[] = [
  { key: "name", label: "Назва туру", kind: "i18n", required: true, wide: true },
  {
    key: "slug",
    label: "Адреса сторінки",
    kind: "text",
    required: true,
    hint: "Латиницею, через дефіс. Змінювати після публікації не варто — старі посилання перестануть працювати.",
  },
  { key: "country", label: "Країна", kind: "i18n", required: true },
  { key: "region", label: "Регіон", kind: "i18n" },
  { key: "datesLabel", label: "Дати (як показувати)", kind: "i18n", hint: "Наприклад: 14–22 листопада 2026" },
  {
    key: "startISO",
    label: "Дата початку",
    kind: "text",
    required: true,
    hint: "Формат РРРР-ММ-ДД. За нею тури сортуються.",
  },
  { key: "durationDays", label: "Тривалість, днів", kind: "number", required: true },
  { key: "price", label: "Ціна", kind: "number", required: true },
  { key: "currency", label: "Валюта", kind: "text" },
  { key: "seatsTotal", label: "Місць усього", kind: "number" },
  { key: "seatsLeft", label: "Вільних місць", kind: "number" },
  {
    key: "status",
    label: "Статус",
    kind: "select",
    options: [
      { value: "available", label: "Набір відкрито" },
      { value: "last", label: "Останні місця" },
      { value: "recruiting", label: "Триває набір" },
      { value: "soldout", label: "Місць немає" },
      { value: "soon", label: "Скоро" },
    ],
  },
  {
    key: "difficulty",
    label: "Складність",
    kind: "select",
    options: [
      { value: 1, label: "1 — легкий" },
      { value: 2, label: "2 — помірний" },
      { value: 3, label: "3 — активний" },
      { value: 4, label: "4 — складний" },
    ],
  },
  {
    key: "activity",
    label: "Тип активності",
    kind: "select",
    options: [
      { value: "nature", label: "Природа" },
      { value: "trekking", label: "Трекінг" },
      { value: "culture", label: "Культура" },
      { value: "balanced", label: "Збалансований" },
    ],
  },
  { key: "groupSize", label: "Розмір групи", kind: "i18n", hint: "Наприклад: 12–16 людей" },
  { key: "highlight", label: "Родзинка (один рядок на картці)", kind: "i18n", wide: true },
  { key: "shortDescription", label: "Короткий опис", kind: "i18n-area", wide: true },
  { key: "fullDescription", label: "Повний опис", kind: "i18n-area", wide: true },
  {
    key: "highlights",
    label: "Головні моменти",
    kind: "i18n-list",
    addLabel: "Додати момент",
    wide: true,
  },
  {
    key: "itinerary",
    label: "Програма по днях",
    kind: "list",
    fields: itineraryDay,
    titleKey: "title",
    addLabel: "Додати день",
    wide: true,
  },
  {
    key: "physical",
    label: "Фізичні параметри",
    kind: "group",
    wide: true,
    fields: [
      { key: "distanceKm", label: "Кілометраж", kind: "text" },
      { key: "elevation", label: "Перепади висоти", kind: "i18n" },
      { key: "activityTime", label: "Тривалість активностей", kind: "i18n" },
      { key: "routeType", label: "Тип маршруту", kind: "i18n" },
      { key: "experience", label: "Потрібний досвід", kind: "i18n" },
    ],
  },
  {
    key: "accommodation",
    label: "Проживання",
    kind: "group",
    wide: true,
    fields: [
      { key: "type", label: "Тип житла", kind: "i18n" },
      { key: "occupancy", label: "Людей у кімнаті", kind: "i18n" },
      { key: "bathroom", label: "Санвузол", kind: "i18n" },
      { key: "single", label: "Одномісне розміщення", kind: "i18n" },
      { key: "features", label: "Особливості", kind: "i18n-list", addLabel: "Додати пункт", wide: true },
    ],
  },
  {
    key: "included",
    label: "Що входить у вартість",
    kind: "i18n-list",
    addLabel: "Додати пункт",
    wide: true,
  },
  {
    key: "excluded",
    label: "Що не входить",
    kind: "i18n-list",
    addLabel: "Додати пункт",
    wide: true,
  },
  {
    key: "gallery",
    label: "Галерея",
    kind: "string-list",
    hint: "Ці ж фото підставляються дням програми, якщо в дня немає власного.",
    addLabel: "Додати фото",
    wide: true,
  },
  {
    key: "faq",
    label: "Питання і відповіді",
    kind: "list",
    titleKey: "q",
    addLabel: "Додати питання",
    wide: true,
    fields: [
      { key: "q", label: "Питання", kind: "i18n", wide: true },
      { key: "a", label: "Відповідь", kind: "i18n-area", wide: true },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    kind: "group",
    wide: true,
    fields: [
      { key: "title", label: "Заголовок у пошуку", kind: "i18n", wide: true },
      { key: "description", label: "Опис у пошуку", kind: "i18n-area", wide: true },
    ],
  },
  {
    key: "demo",
    label: "Демо-тур",
    kind: "select",
    hint: "Демо-тури — це зразки для верстки. Реальному туру поставте «Ні».",
    options: [
      { value: "true", label: "Так" },
      { value: "false", label: "Ні" },
    ],
  },
];

/* ---- Team ---------------------------------------------------------------- */

const teamFields: Field[] = [
  { key: "name", label: "Ім'я", kind: "i18n", required: true },
  { key: "role", label: "Роль", kind: "i18n", hint: "Наприклад: Співзасновник • Автор маршрутів" },
  { key: "bio", label: "Короткий опис", kind: "i18n-area", wide: true },
  { key: "photo", label: "Фото", kind: "image", required: true, wide: true },
  {
    key: "focus",
    label: "Кадрування фото",
    kind: "select",
    hint: "Картка обрізає фото. Оберіть, яку частину лишити видимою.",
    options: [
      { value: "50% 12%", label: "Верх — людина на весь зріст" },
      { value: "50% 30%", label: "Верхня третина" },
      { value: "50% 50%", label: "Центр" },
      { value: "50% 70%", label: "Низ — людина в нижній частині кадру" },
    ],
  },
  {
    key: "instagram",
    label: "Instagram",
    kind: "text",
    hint: "Повне посилання. Якщо порожньо — веде на акаунт компанії.",
    wide: true,
  },
  {
    key: "story",
    label: "Особиста історія",
    kind: "i18n-paragraphs",
    hint: "Кожен абзац окремо. Якщо порожньо — кнопка «Читати історію» не показується.",
    addLabel: "Додати абзац",
    wide: true,
  },
];

/* ---- Reviews ------------------------------------------------------------- */

const reviewFields: Field[] = [
  { key: "name", label: "Ім'я автора", kind: "text", required: true },
  {
    key: "kind",
    label: "Формат",
    kind: "select",
    hint: "Від формату залежить, які поля нижче використовуються.",
    options: [
      { value: "text", label: "Текстовий відгук" },
      { value: "video", label: "Відео" },
      { value: "screenshot", label: "Скриншот повідомлення" },
      { value: "photo", label: "Фото учасника" },
    ],
  },
  { key: "tour", label: "Який тур", kind: "i18n", wide: true },
  { key: "text", label: "Текст відгуку", kind: "i18n-area", wide: true },
  { key: "photo", label: "Фото автора", kind: "image", wide: true },
  { key: "date", label: "Дата", kind: "text", hint: "Формат ДД.ММ.РРРР" },
  {
    key: "instagram",
    label: "Instagram автора",
    kind: "text",
    hint: "Заповнюйте тільки якщо автор дозволив посилатися на його профіль.",
  },
  { key: "video", label: "Відео (файл)", kind: "text", hint: "Шлях виду /media/reviews/clip.mp4", wide: true },
  { key: "poster", label: "Обкладинка відео", kind: "image", wide: true },
  { key: "screenshot", label: "Скриншот", kind: "image", wide: true },
  {
    key: "demo",
    label: "Демо-відгук",
    kind: "select",
    hint: "Демо-відгуки вигадані. Реальний відгук позначайте «Ні» — інакше він видається за вигаданий.",
    options: [
      { value: "true", label: "Так" },
      { value: "false", label: "Ні" },
    ],
  },
];

/* ---- Registry ------------------------------------------------------------ */

export const schemas: EntitySchema[] = [
  {
    name: "tours",
    title: "Тури",
    path: "src/content/data/tours.json",
    labelKey: "name",
    idKey: "id",
    fields: tourFields,
    blank: () => ({
      id: "",
      slug: "",
      demo: false,
      country: L(),
      region: L(),
      name: L(),
      datesLabel: L(),
      startISO: "",
      durationDays: 7,
      price: 0,
      currency: "EUR",
      seatsLeft: 0,
      seatsTotal: 12,
      status: "available",
      difficulty: 2,
      activity: "balanced",
      groupSize: L(),
      highlight: L(),
      shortDescription: L(),
      fullDescription: L(),
      highlights: [],
      itinerary: [],
      physical: {
        distanceKm: "",
        elevation: L(),
        activityTime: L(),
        routeType: L(),
        experience: L(),
      },
      accommodation: { type: L(), occupancy: L(), bathroom: L(), single: L(), features: [] },
      included: [],
      excluded: [],
      gallery: [],
      videos: [],
      reviewIds: [],
      faq: [],
      seo: { title: L(), description: L() },
    }),
  },
  {
    name: "team",
    title: "Команда",
    path: "src/content/data/team.json",
    labelKey: "name",
    idKey: "id",
    fields: teamFields,
    blank: () => ({
      id: "",
      name: L(),
      role: L(),
      bio: L(),
      photo: "",
      focus: "50% 50%",
      instagram: "",
      story: { ua: [], en: [] },
    }),
  },
  {
    name: "reviews",
    title: "Відгуки",
    path: "src/content/data/reviews.json",
    labelKey: "name",
    idKey: "id",
    fields: reviewFields,
    blank: () => ({
      id: "",
      demo: false,
      kind: "text",
      name: "",
      photo: "",
      tour: L(),
      text: L(),
    }),
  },
];

/** Latin, lowercase, hyphenated — safe for a URL and for a file name. */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
    з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
    о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "'": "", "’": "",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in map ? map[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

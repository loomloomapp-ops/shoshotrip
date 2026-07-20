import type { Locale, Localized } from "@/lib/i18n";
import { PORTRAIT } from "@/content/media";

/**
 * DEMO reviews for layout. Flagged `demo: true` — NOT presented as verified
 * real customers. OWNER: replace with real reviews (with consent) before launch.
 *
 * Formats (`kind`):
 *  - "text"       — written review (quote + author)
 *  - "video"      — video review: `video` URL + `poster` image (falls back to a
 *                   play-poster when the clip is not yet uploaded)
 *  - "screenshot" — a real message screenshot (`screenshot` image) or, when none
 *                   is provided, a styled message bubble built from `text`
 *  - "photo"      — a participant photo (`photo`) with an optional caption `text`
 * `instagram` (author profile link) is shown ONLY when present — i.e. by consent.
 */
export type ReviewKind = "text" | "video" | "screenshot" | "photo";

export interface Review {
  id: string;
  demo: true;
  kind: ReviewKind;
  name: string;
  photo: string; // author avatar / participant photo
  tour: Localized;
  date?: string; // display date (DD.MM.YYYY) — shown on video cards
  instagram?: string; // author profile — present == consented to link
  text?: Localized; // review body / caption / message text
  video?: string; // real clip URL (kind: video)
  poster?: string; // video / screenshot poster (kind: video)
  screenshot?: string; // real message-screenshot image (kind: screenshot)
}

const L = (ua: string, en: string): Localized => ({ ua, en });

export const reviews: Review[] = [
  {
    id: "r1",
    demo: true,
    kind: "text",
    name: "Марта Козак",
    photo: "https://picsum.photos/seed/review-marta/200/200",
    tour: L("Карпати: світанки на хребті", "Carpathians: sunrises on the ridge"),
    instagram: "https://instagram.com/",
    text: L(
      "Я думала, що знаю Карпати. Виявилося, ні. Світанок на Говерлі, коли під тобою хмари, — це те, що я тепер згадую в найсіріші робочі дні.",
      "I thought I knew the Carpathians. Turns out I didn’t. The sunrise on Hoverla with clouds beneath you is what I now remember on the greyest workdays.",
    ),
  },
  {
    id: "r5",
    demo: true,
    kind: "video",
    name: "Соломія Верес",
    photo: "https://picsum.photos/seed/review-solomia/200/200",
    tour: L("Грузія: Сванетія без асфальту", "Georgia: Svaneti off the asphalt"),
    date: "12.03.2026",
    instagram: "https://instagram.com/",
    poster: PORTRAIT[2],
    // OWNER: add a web-optimized clip (mp4) and set `video` to its URL.
    text: L(
      "Записала коротке відео просто з перевалу — слова тут зайві.",
      "I filmed a short clip right from the pass — words are redundant here.",
    ),
  },
  {
    id: "r2",
    demo: true,
    kind: "text",
    name: "Олег Данилюк",
    photo: "https://picsum.photos/seed/review-oleh/200/200",
    tour: L("Грузія: Сванетія без асфальту", "Georgia: Svaneti off the asphalt"),
    text: L(
      "Хлопці зробили те, чого не робить жодне турагентство: познайомили нас із реальними людьми. Вечеря в родині сванів була кращою за будь-який ресторан.",
      "The guys did what no travel agency does: they introduced us to real people. Dinner with a Svan family beat any restaurant.",
    ),
  },
  {
    id: "r6",
    demo: true,
    kind: "screenshot",
    name: "Христина Мельник",
    photo: "https://picsum.photos/seed/review-khrystyna/200/200",
    tour: L("Марокко: від Атласу до дюн", "Morocco: from the Atlas to the dunes"),
    // OWNER: set `screenshot` to a real chat screenshot to show it instead.
    text: L(
      "Щойно повернулась і одразу пишу: це були найкращі 8 днів року. Дякую, що витягли мене з зони комфорту!",
      "Just got back and writing right away: the best 8 days of the year. Thanks for pulling me out of my comfort zone!",
    ),
  },
  {
    id: "r3",
    demo: true,
    kind: "text",
    name: "Ірина Гнатюк",
    photo: "https://picsum.photos/seed/review-iryna/200/200",
    tour: L("Карпати: світанки на хребті", "Carpathians: sunrises on the ridge"),
    instagram: "https://instagram.com/",
    text: L(
      "Було складно. І саме тому це найкраща моя подорож. Повернулася додому іншою людиною — не пафос, а факт.",
      "It was hard. And that’s exactly why it’s my best trip. I came home a different person — not a slogan, a fact.",
    ),
  },
  {
    id: "r7",
    demo: true,
    kind: "photo",
    name: "Назар Ткачук",
    photo: PORTRAIT[0],
    tour: L("Карпати: світанки на хребті", "Carpathians: sunrises on the ridge"),
    instagram: "https://instagram.com/",
    text: L("Той самий кадр із хребта, який тепер на заставці телефону.", "That shot from the ridge — now my phone wallpaper."),
  },
  {
    id: "r4",
    demo: true,
    kind: "text",
    name: "Дмитро Савчук",
    photo: "https://picsum.photos/seed/review-dmytro/200/200",
    tour: L("Марокко: від Атласу до дюн", "Morocco: from the Atlas to the dunes"),
    text: L(
      "Ніч у пустелі й тиша, якої я не чув ніколи. Група була невелика, і за тиждень ми стали справжніми друзями.",
      "A night in the desert and a silence I’d never heard. The group was small, and in a week we became real friends.",
    ),
  },
  {
    id: "r8",
    demo: true,
    kind: "video",
    name: "Юлія Комар",
    photo: "https://picsum.photos/seed/review-yulia/200/200",
    tour: L("Карпати: світанки на хребті", "Carpathians: sunrises on the ridge"),
    date: "28.02.2026",
    instagram: "https://instagram.com/",
    poster: PORTRAIT[0],
    text: L(
      "Знімала на телефон — і навіть так видно, наскільки там красиво.",
      "Filmed it on my phone, and even so you can see how beautiful it is.",
    ),
  },
  {
    id: "r9",
    demo: true,
    kind: "video",
    name: "Богдан Гринько",
    photo: "https://picsum.photos/seed/review-bohdan/200/200",
    tour: L("Марокко: від Атласу до дюн", "Morocco: from the Atlas to the dunes"),
    date: "05.05.2026",
    poster: PORTRAIT[3],
    text: L(
      "Коротке відео з дюн на заході сонця. Мурашки досі.",
      "A short clip from the dunes at sunset. Still gives me chills.",
    ),
  },
  {
    id: "r10",
    demo: true,
    kind: "video",
    name: "Аліна Дорош",
    photo: "https://picsum.photos/seed/review-alina/200/200",
    tour: L("Грузія: Сванетія без асфальту", "Georgia: Svaneti off the asphalt"),
    date: "19.04.2026",
    instagram: "https://instagram.com/",
    poster: PORTRAIT[1],
    text: L(
      "Записала перші враження одразу після спуску — емоції зашкалюють.",
      "Recorded my first impressions right after the descent — emotions off the charts.",
    ),
  },
];

export function getReviewsByIds(ids: string[]): Review[] {
  return ids
    .map((id) => reviews.find((r) => r.id === id))
    .filter((r): r is Review => Boolean(r));
}

export function getReviewText(review: Review, locale: Locale): string {
  return review.text ? review.text[locale] : "";
}

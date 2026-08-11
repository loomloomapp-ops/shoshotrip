import type { Locale, Localized } from "@/lib/i18n";
import data from "@/content/data/team.json";

/**
 * The people shown in the "Who travels with you" block.
 *
 * This used to be hard-coded in `dictionaries.ts` as two fixed keys (`viktor`,
 * `andriy`), which made a third person impossible to add. It is now a list in
 * `data/team.json` that the /admin panel reads and writes; the section headings
 * around it stay in the dictionaries, because they are UI copy, not people.
 */

export interface TeamMember {
  /** Stable key, used for React keys and admin routing. Never shown. */
  id: string;
  name: Localized;
  role: Localized;
  /** One-line intro shown on the card. */
  bio: Localized;
  photo: string;
  /** `object-position` for the photo, so the card crop keeps the face in frame. */
  focus: string;
  /** Personal profile link. Empty falls back to the brand account. */
  instagram: string;
  /** Long-form story, revealed behind "read more". Empty hides the toggle. */
  story: { ua: string[]; en: string[] };
}

export const team: TeamMember[] = data as unknown as TeamMember[];

/** Story paragraphs for one locale (empty array when no story is written). */
export function memberStory(member: TeamMember, locale: Locale): string[] {
  return member.story?.[locale] ?? [];
}

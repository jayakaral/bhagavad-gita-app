import { getVerses } from "../data/gita-index";
import type { ScriptureLanguage } from "../data/gita-types";

export interface ReaderLocation {
  chapter: number;
  verse: number;
}

export function getPreviousLocation(location: ReaderLocation, language: ScriptureLanguage): ReaderLocation | null {
  const verses = getVerses(location.chapter, language);
  const index = verses.findIndex((verse) => verse.verse === location.verse);
  if (index > 0) return { chapter: location.chapter, verse: verses[index - 1].verse };
  if (location.chapter === 1) return null;
  const previousChapterVerses = getVerses(location.chapter - 1, language);
  return { chapter: location.chapter - 1, verse: previousChapterVerses.at(-1)?.verse ?? 1 };
}

export function getNextLocation(location: ReaderLocation, language: ScriptureLanguage): ReaderLocation | null {
  const verses = getVerses(location.chapter, language);
  const index = verses.findIndex((verse) => verse.verse === location.verse);
  if (index >= 0 && index < verses.length - 1) return { chapter: location.chapter, verse: verses[index + 1].verse };
  if (location.chapter === 18) return null;
  return { chapter: location.chapter + 1, verse: 1 };
}

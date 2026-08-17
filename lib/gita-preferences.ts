import type { ScriptureLanguage } from "@/data/gita-types";
import { isReadingTheme, type ReadingTheme } from "./reading-themes";

export type ReadingScale = 0.94 | 1 | 1.08;
export type NarrationVoice = "male" | "female";

export interface ReadingLocation {
  chapter: number;
  verse: number;
}

export interface GitaPreferences {
  language: ScriptureLanguage;
  readingScale: ReadingScale;
  readingTheme: ReadingTheme;
  narrationVoice: NarrationVoice;
  lastReading: ReadingLocation;
  bookmarks: string[];
}

export const DEFAULT_GITA_PREFERENCES: GitaPreferences = {
  language: "en",
  readingScale: 1,
  readingTheme: "dharma",
  narrationVoice: "male",
  lastReading: { chapter: 2, verse: 47 },
  bookmarks: [],
};

const validScales: ReadingScale[] = [0.94, 1, 1.08];

export function bookmarkKey(chapter: number, verse: number): string {
  return `${chapter}:${verse}`;
}

export function parseBookmarkKey(key: string): ReadingLocation | null {
  const [chapter, verse] = key.split(":").map(Number);
  if (!Number.isInteger(chapter) || !Number.isInteger(verse) || chapter < 1 || chapter > 18 || verse < 1) {
    return null;
  }
  return { chapter, verse };
}

export function normalizePreferences(value: unknown): GitaPreferences {
  if (!value || typeof value !== "object") return DEFAULT_GITA_PREFERENCES;
  const candidate = value as Partial<GitaPreferences>;
  const language = candidate.language === "hi" ? "hi" : "en";
  const readingScale = validScales.includes(candidate.readingScale as ReadingScale)
    ? (candidate.readingScale as ReadingScale)
    : DEFAULT_GITA_PREFERENCES.readingScale;
  const readingTheme = isReadingTheme(candidate.readingTheme) ? candidate.readingTheme : DEFAULT_GITA_PREFERENCES.readingTheme;
  const narrationVoice: NarrationVoice = candidate.narrationVoice === "female" ? "female" : "male";
  const lastReading = candidate.lastReading && Number.isInteger(candidate.lastReading.chapter) && Number.isInteger(candidate.lastReading.verse)
    ? { chapter: Math.min(18, Math.max(1, candidate.lastReading.chapter)), verse: Math.max(1, candidate.lastReading.verse) }
    : DEFAULT_GITA_PREFERENCES.lastReading;
  const bookmarks = Array.isArray(candidate.bookmarks)
    ? [...new Set(candidate.bookmarks.filter((bookmark): bookmark is string => typeof bookmark === "string" && parseBookmarkKey(bookmark) !== null))]
    : [];

  return { language, readingScale, readingTheme, narrationVoice, lastReading, bookmarks };
}

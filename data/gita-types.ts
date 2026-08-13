export type ScriptureLanguage = "en" | "hi";

export interface GitaChapter {
  chapter: number;
  sanskritName: string;
  englishName: string;
  title: string;
  description: string;
  verseCount: number;
  sourceUrl: string;
}

export interface GitaVerse {
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  interpretation: string;
  chapter: number;
  verseNumber: string;
}

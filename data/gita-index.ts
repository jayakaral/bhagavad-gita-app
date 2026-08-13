import type { GitaChapter, GitaVerse, ScriptureLanguage } from "./gita-types";

const chapterData = require("./chapters.json") as GitaChapter[];

const verseFiles: Record<ScriptureLanguage, Record<number, GitaVerse[]>> = {
  en: {
    1: require("./en/chapter_1.json"), 2: require("./en/chapter_2.json"), 3: require("./en/chapter_3.json"),
    4: require("./en/chapter_4.json"), 5: require("./en/chapter_5.json"), 6: require("./en/chapter_6.json"),
    7: require("./en/chapter_7.json"), 8: require("./en/chapter_8.json"), 9: require("./en/chapter_9.json"),
    10: require("./en/chapter_10.json"), 11: require("./en/chapter_11.json"), 12: require("./en/chapter_12.json"),
    13: require("./en/chapter_13.json"), 14: require("./en/chapter_14.json"), 15: require("./en/chapter_15.json"),
    16: require("./en/chapter_16.json"), 17: require("./en/chapter_17.json"), 18: require("./en/chapter_18.json"),
  },
  hi: {
    1: require("./hi/chapter_1.json"), 2: require("./hi/chapter_2.json"), 3: require("./hi/chapter_3.json"),
    4: require("./hi/chapter_4.json"), 5: require("./hi/chapter_5.json"), 6: require("./hi/chapter_6.json"),
    7: require("./hi/chapter_7.json"), 8: require("./hi/chapter_8.json"), 9: require("./hi/chapter_9.json"),
    10: require("./hi/chapter_10.json"), 11: require("./hi/chapter_11.json"), 12: require("./hi/chapter_12.json"),
    13: require("./hi/chapter_13.json"), 14: require("./hi/chapter_14.json"), 15: require("./hi/chapter_15.json"),
    16: require("./hi/chapter_16.json"), 17: require("./hi/chapter_17.json"), 18: require("./hi/chapter_18.json"),
  },
};

export const chapters = chapterData;

export function getChapter(chapterNumber: number): GitaChapter | undefined {
  return chapterData.find((chapter) => chapter.chapter === chapterNumber);
}

export function getVerses(chapterNumber: number, language: ScriptureLanguage): GitaVerse[] {
  return verseFiles[language][chapterNumber] ?? [];
}

export function getVerse(chapterNumber: number, verseNumber: number, language: ScriptureLanguage): GitaVerse | undefined {
  return getVerses(chapterNumber, language).find((verse) => verse.verse === verseNumber);
}

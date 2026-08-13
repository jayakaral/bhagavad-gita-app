import { describe, expect, it } from "vitest";

import { chapters, getVerse, getVerses } from "../data/gita-index";
import { DEFAULT_GITA_PREFERENCES, normalizePreferences, parseBookmarkKey } from "../lib/gita-preferences";

describe("uploaded Bhagavad Gita data", () => {
  it("contains all 18 uploaded chapters with matching bilingual verse counts", () => {
    expect(chapters).toHaveLength(18);
    for (const chapter of chapters) {
      expect(getVerses(chapter.chapter, "en")).toHaveLength(chapter.verseCount);
      expect(getVerses(chapter.chapter, "hi")).toHaveLength(chapter.verseCount);
    }
  });

  it("keeps a matching verse reference across English and Hindi", () => {
    expect(getVerse(2, 47, "en")?.verseNumber).toBe("2.47");
    expect(getVerse(2, 47, "hi")?.verseNumber).toBe("2.47");
  });
});

describe("local Gita preferences", () => {
  it("normalizes incomplete or unsafe stored values", () => {
    expect(normalizePreferences(null)).toEqual(DEFAULT_GITA_PREFERENCES);
    expect(normalizePreferences({ language: "hi", readingScale: 1.08, lastReading: { chapter: 20, verse: 0 }, bookmarks: ["2:47", "invalid", "2:47"] })).toEqual({
      language: "hi", readingScale: 1.08, lastReading: { chapter: 18, verse: 1 }, bookmarks: ["2:47"],
    });
    expect(parseBookmarkKey("12:5")).toEqual({ chapter: 12, verse: 5 });
  });
});

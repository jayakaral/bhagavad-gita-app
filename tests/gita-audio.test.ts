import { describe, expect, it } from "vitest";

import {
  getAudioProjectId,
  getDefaultAudioLanguage,
  getVerseAudioUrl,
} from "../lib/gita-audio";

describe("Supabase verse audio URLs", () => {
  it("routes every chapter to its assigned public Supabase project", () => {
    const projectByChapter = [
      "hfcgbfjvnwhnazdizcvg", "hfcgbfjvnwhnazdizcvg", "hfcgbfjvnwhnazdizcvg", "hfcgbfjvnwhnazdizcvg",
      "xwahakifdjnjpmwyrjto", "xwahakifdjnjpmwyrjto", "xwahakifdjnjpmwyrjto", "xwahakifdjnjpmwyrjto", "xwahakifdjnjpmwyrjto", "xwahakifdjnjpmwyrjto",
      "vsfbmifquhpoyuhxxhat", "vsfbmifquhpoyuhxxhat", "vsfbmifquhpoyuhxxhat", "vsfbmifquhpoyuhxxhat", "vsfbmifquhpoyuhxxhat",
      "aalfhacqgcnylbcrwuea", "aalfhacqgcnylbcrwuea", "aalfhacqgcnylbcrwuea",
    ];

    projectByChapter.forEach((projectId, index) => {
      expect(getAudioProjectId(index + 1)).toBe(projectId);
    });
  });

  it("builds zero-padded public-storage URLs using the chapter-specific project", () => {
    expect(getVerseAudioUrl(5, 3, "sanskrit", "male")).toBe(
      "https://xwahakifdjnjpmwyrjto.supabase.co/storage/v1/object/public/gita-audio/chapter-05/chapter-05-verse-03-sanskrit-male.wav",
    );
    expect(getVerseAudioUrl(10, 42, "hindi", "female")).toBe(
      "https://xwahakifdjnjpmwyrjto.supabase.co/storage/v1/object/public/gita-audio/chapter-10/chapter-10-verse-42-hindi-female.wav",
    );
    expect(getVerseAudioUrl(11, 1, "english", "male")).toBe(
      "https://vsfbmifquhpoyuhxxhat.supabase.co/storage/v1/object/public/gita-audio/chapter-11/chapter-11-verse-01-english-male.wav",
    );
    expect(getVerseAudioUrl(18, 78, "sanskrit", "female")).toBe(
      "https://aalfhacqgcnylbcrwuea.supabase.co/storage/v1/object/public/gita-audio/chapter-18/chapter-18-verse-78-sanskrit-female.wav",
    );
  });

  it("uses the reader language as a sensible initial narration choice", () => {
    expect(getDefaultAudioLanguage("en")).toBe("english");
    expect(getDefaultAudioLanguage("hi")).toBe("hindi");
  });
});

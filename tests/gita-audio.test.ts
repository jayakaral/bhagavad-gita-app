import { describe, expect, it } from "vitest";

import {
  GITA_AUDIO_PUBLIC_BASE_URL,
  getDefaultAudioLanguage,
  getVerseAudioUrl,
} from "../lib/gita-audio";

describe("Supabase verse audio URLs", () => {
  it("builds the documented zero-padded public-storage pattern", () => {
    expect(getVerseAudioUrl(5, 3, "sanskrit", "male")).toBe(
      `${GITA_AUDIO_PUBLIC_BASE_URL}/chapter-05/chapter-05-verse-03-sanskrit-male.wav`,
    );
    expect(getVerseAudioUrl(10, 42, "hindi", "female")).toBe(
      `${GITA_AUDIO_PUBLIC_BASE_URL}/chapter-10/chapter-10-verse-42-hindi-female.wav`,
    );
  });

  it("uses the reader language as a sensible initial narration choice", () => {
    expect(getDefaultAudioLanguage("en")).toBe("english");
    expect(getDefaultAudioLanguage("hi")).toBe("hindi");
  });
});

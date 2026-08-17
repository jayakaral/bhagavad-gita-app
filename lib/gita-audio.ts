export const GITA_AUDIO_PUBLIC_BASE_URL =
  "https://vzronommlsjetagktvfi.supabase.co/storage/v1/object/public/gita-audio";

export const AUDIO_LANGUAGES = ["sanskrit", "english", "hindi"] as const;
export const AUDIO_VOICES = ["male", "female"] as const;

export type GitaAudioLanguage = (typeof AUDIO_LANGUAGES)[number];
export type GitaAudioVoice = (typeof AUDIO_VOICES)[number];

function padAudioNumber(value: number) {
  return Math.max(1, Math.floor(value)).toString().padStart(2, "0");
}

export function getVerseAudioUrl(
  chapter: number,
  verse: number,
  language: GitaAudioLanguage,
  voice: GitaAudioVoice,
) {
  const chapterNumber = padAudioNumber(chapter);
  const verseNumber = padAudioNumber(verse);
  const filename = `chapter-${chapterNumber}-verse-${verseNumber}-${language}-${voice}.wav`;

  return `${GITA_AUDIO_PUBLIC_BASE_URL}/chapter-${chapterNumber}/${filename}`;
}

export function getDefaultAudioLanguage(readerLanguage: "en" | "hi"): GitaAudioLanguage {
  return readerLanguage === "hi" ? "hindi" : "english";
}

export const GITA_AUDIO_CONNECTIONS: Array<{ projectId: string; chapters: number[] }> = [
  { projectId: "hfcgbfjvnwhnazdizcvg", chapters: [1, 2, 3, 4] },
  { projectId: "xwahakifdjnjpmwyrjto", chapters: [5, 6, 7, 8, 9, 10] },
  { projectId: "vsfbmifquhpoyuhxxhat", chapters: [11, 12, 13, 14, 15] },
  { projectId: "aalfhacqgcnylbcrwuea", chapters: [16, 17, 18] },
];

export const AUDIO_LANGUAGES = ["sanskrit", "english", "hindi"] as const;
export const AUDIO_VOICES = ["male", "female"] as const;

export type GitaAudioLanguage = (typeof AUDIO_LANGUAGES)[number];
export type GitaAudioVoice = (typeof AUDIO_VOICES)[number];

function padAudioNumber(value: number) {
  return Math.max(1, Math.floor(value)).toString().padStart(2, "0");
}

export function getAudioProjectId(chapter: number) {
  const chapterNumber = Math.floor(chapter);
  const connection = GITA_AUDIO_CONNECTIONS.find(({ chapters }) => chapters.includes(chapterNumber));

  if (!connection) {
    throw new RangeError(`No audio project is configured for Chapter ${chapter}.`);
  }

  return connection.projectId;
}

export function getGitaAudioPublicBaseUrl(chapter: number) {
  return `https://${getAudioProjectId(chapter)}.supabase.co/storage/v1/object/public/gita-audio`;
}

/** @deprecated Use getGitaAudioPublicBaseUrl(chapter) for chapter-specific routing. */
export const GITA_AUDIO_PUBLIC_BASE_URL = getGitaAudioPublicBaseUrl(1);

export function getVerseAudioUrl(
  chapter: number,
  verse: number,
  language: GitaAudioLanguage,
  voice: GitaAudioVoice,
) {
  const chapterNumber = padAudioNumber(chapter);
  const verseNumber = padAudioNumber(verse);
  const filename = `chapter-${chapterNumber}-verse-${verseNumber}-${language}-${voice}.wav`;

  return `${getGitaAudioPublicBaseUrl(chapter)}/chapter-${chapterNumber}/${filename}`;
}

export function getDefaultAudioLanguage(readerLanguage: "en" | "hi"): GitaAudioLanguage {
  return readerLanguage === "hi" ? "hindi" : "english";
}

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "audio", "chapter-1");

const readChapter = async (language) => JSON.parse(
  await readFile(path.join(projectRoot, "data", language, "chapter_1.json"), "utf8"),
);

const [english, hindi] = await Promise.all([readChapter("en"), readChapter("hi")]);
const entries = english.flatMap((englishVerse, index) => {
  const hindiVerse = hindi[index];
  const verse = String(englishVerse.verse).padStart(2, "0");
  const texts = {
    sanskrit: englishVerse.sanskrit.replaceAll("|", "।"),
    english: englishVerse.translation,
    hindi: hindiVerse.translation,
  };

  return Object.entries(texts).flatMap(([language, text]) => ["male", "female"].map((voice) => ({
    chapter: 1,
    verse: englishVerse.verse,
    language,
    voice,
    text,
    fileName: `chapter-01-verse-${verse}-${language}-${voice}.wav`,
  })));
});

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "verse-audio-manifest.json"),
  `${JSON.stringify({ chapter: 1, entries }, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({ entries: entries.length, outputDirectory }, null, 2));

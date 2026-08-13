import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = "/home/ubuntu/projects/geeta-00c6270e";
const dataRoot = path.join(projectRoot, "data");
const extractRoot = path.join(projectRoot, ".tmp-gita-import");

if (!existsSync(path.join(sourceRoot, "en.zip")) || !existsSync(path.join(sourceRoot, "hi.zip"))) {
  throw new Error("Expected English and Hindi Bhagavad Gita archives were not found.");
}

rmSync(extractRoot, { recursive: true, force: true });
mkdirSync(extractRoot, { recursive: true });
execFileSync("unzip", ["-q", path.join(sourceRoot, "en.zip"), "-d", extractRoot]);
execFileSync("unzip", ["-q", path.join(sourceRoot, "hi.zip"), "-d", extractRoot]);

const chapters = JSON.parse(readFileSync(path.join(sourceRoot, "chapters.json"), "utf8"));
for (const language of ["en", "hi"]) {
  const languageDirectory = path.join(extractRoot, language);
  const targetDirectory = path.join(dataRoot, language);
  rmSync(targetDirectory, { recursive: true, force: true });
  cpSync(languageDirectory, targetDirectory, { recursive: true });

  for (const chapter of chapters) {
    const filePath = path.join(targetDirectory, `chapter_${chapter.chapter}.json`);
    const verses = JSON.parse(readFileSync(filePath, "utf8"));
    if (verses.length !== chapter.verseCount) {
      throw new Error(`Chapter ${chapter.chapter} ${language} has ${verses.length} verses; expected ${chapter.verseCount}.`);
    }
  }
}

writeFileSync(path.join(dataRoot, "chapters.json"), `${JSON.stringify(chapters, null, 2)}\n`);
rmSync(extractRoot, { recursive: true, force: true });
console.log(`Prepared ${chapters.length} bilingual Bhagavad Gita chapters.`);

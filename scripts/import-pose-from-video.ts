import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { CandidatePoseEntry } from "@/lib/types/plans";

const manifestPath = process.argv[2];

if (!manifestPath) {
  throw new Error("Uso: npm run import:pose-from-video -- path/to/candidate-pose.json");
}

const inputPath = resolve(process.cwd(), manifestPath);
const content = await readFile(inputPath, "utf-8");
const candidate = JSON.parse(content) as CandidatePoseEntry;

const stagingDirectory = join(process.cwd(), "src", "data", "poseStaging");
await mkdir(stagingDirectory, { recursive: true });

const targetFile = join(stagingDirectory, `${candidate.id}.json`);
await writeFile(
  targetFile,
  `${JSON.stringify(
    {
      ...candidate,
      notes: [...candidate.notes, "Imported through import:pose-from-video script."],
    },
    null,
    2,
  )}\n`,
  "utf-8",
);

console.log(`Candidate pose importada en ${targetFile}`);

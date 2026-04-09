import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const id = process.argv[2];

if (!id) {
  throw new Error("Uso: npm run scaffold:sign -- NEW_SIGN_ID");
}

const filePath = resolve(process.cwd(), "src/data/signs.json");
const content = JSON.parse(readFileSync(filePath, "utf-8")) as Array<Record<string, unknown>>;

content.push({
  id,
  type: "pose",
  label: id.replaceAll("_", " "),
  tags: ["todo"],
  domain: "general",
  durationMs: 600,
  poseId: "NEUTRAL",
  synonyms: [id.toLowerCase()],
  intents: ["inform"],
  metadata: {
    placeholder: true,
    notes: "Entrada generada por scaffold. Reemplazar pose, tags y synonyms.",
  },
});

writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf-8");
console.log(`Sign scaffold creado: ${id}`);

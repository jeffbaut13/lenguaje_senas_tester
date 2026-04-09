import { appendFileSync } from "node:fs";
import { resolve } from "node:path";

const id = process.argv[2];

if (!id) {
  throw new Error("Uso: npm run scaffold:pose -- NEW_POSE_ID");
}

const filePath = resolve(process.cwd(), "src/data/poseLibrary.ts");

appendFileSync(
  filePath,
  `\n// Scaffold generado\n// pose("${id}", "${id.replaceAll("_", " ")}", "Describe la pose.", {\n//   RightUpperArm: [-20, 10, 20],\n// }, ["todo"], "custom"),\n`,
  "utf-8",
);

console.log(`Snippet de pose agregado al final de poseLibrary.ts para ${id}`);

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import type { CandidatePoseEntry } from "@/lib/types/plans";

export async function POST(request: Request) {
  const payload = (await request.json()) as CandidatePoseEntry;
  const stagingDirectory = join(process.cwd(), "src", "data", "poseStaging");
  await mkdir(stagingDirectory, { recursive: true });

  const fileName = `${payload.id}.json`;
  const targetPath = join(stagingDirectory, fileName);
  await writeFile(targetPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");

  return NextResponse.json({
    ok: true,
    path: `src/data/poseStaging/${fileName}`,
  });
}

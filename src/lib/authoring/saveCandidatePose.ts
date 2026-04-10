import type { CandidatePoseEntry } from "@/lib/types/plans";

export const saveCandidatePose = async (candidate: CandidatePoseEntry) => {
  const response = await fetch("/api/authoring/stage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la pose candidata en staging.");
  }

  return (await response.json()) as { ok: true; path: string };
};

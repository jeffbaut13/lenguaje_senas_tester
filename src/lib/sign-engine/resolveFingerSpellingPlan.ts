import { getAlphabetEntry } from "@/lib/repositories/alphabetRepository";
import type { PlayStep } from "@/lib/types/plans";

export const resolveFingerSpellingPlan = (token: string): PlayStep[] =>
  token
    .split("")
    .reduce<PlayStep[]>((steps, character, index) => {
      const entry = getAlphabetEntry(character);
      if (!entry) {
        return steps;
      }

      steps.push({
        id: `fingerspell-${token}-${index}`,
        type: "fingerspell",
        label: `Deletreo ${entry.char}`,
        durationMs: entry.durationMs,
        poseId: entry.poseId,
        token,
        source: "fallback",
      });

      return steps;
    }, []);

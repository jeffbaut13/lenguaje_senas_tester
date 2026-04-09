import phrases from "@/data/phrases.json";
import type { PhraseEntry } from "@/lib/types/plans";

export const phraseRepository = phrases as PhraseEntry[];

export const findPhraseByNormalizedText = (normalizedText: string) =>
  phraseRepository.find((entry) => normalizedText.includes(entry.normalized));

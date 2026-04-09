import { findSignsForToken } from "@/lib/repositories/signRepository";
import { tokenizeNormalizedText } from "@/lib/translation/normalizeText";

export interface TokenResolution {
  matchedSignIds: string[];
  unmatchedTokens: string[];
}

const STOP_WORDS = new Set(["de", "la", "el", "para", "con", "en", "y", "tu", "una", "un", "del"]);

export const resolveTokenPlan = (normalizedText: string): TokenResolution => {
  const matchedSignIds = new Set<string>();
  const unmatchedTokens: string[] = [];

  tokenizeNormalizedText(normalizedText).forEach((token) => {
    if (STOP_WORDS.has(token)) {
      return;
    }

    const signMatches = findSignsForToken(token);
    if (signMatches.length > 0) {
      matchedSignIds.add(signMatches[0].id);
      return;
    }

    unmatchedTokens.push(token);
  });

  return {
    matchedSignIds: Array.from(matchedSignIds),
    unmatchedTokens,
  };
};

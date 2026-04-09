const removeDiacritics = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const normalizeText = (value: string) =>
  removeDiacritics(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const tokenizeNormalizedText = (normalizedText: string) =>
  normalizedText.split(" ").filter((token) => token.length > 1);

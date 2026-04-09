import { extractSemanticTextFromElement, isLikelySemanticElement } from "@/lib/dom/extractSemanticTextFromElement";

const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 220;

export const findSemanticContainer = (startElement: HTMLElement | null): HTMLElement | null => {
  let current = startElement;

  while (current && current !== document.body) {
    if (current.dataset.translate === "ignore") {
      return null;
    }

    const forceScope = current.dataset.semanticScope === "block" || current.dataset.translate === "block";
    if (forceScope || isLikelySemanticElement(current)) {
      const text = extractSemanticTextFromElement(current);
      if (text.length >= MIN_TEXT_LENGTH && text.length <= MAX_TEXT_LENGTH) {
        return current;
      }
    }

    current = current.parentElement;
  }

  return null;
};

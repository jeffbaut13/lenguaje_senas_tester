const BLOCK_TAGS = new Set(["P", "DIV", "SECTION", "ARTICLE", "BUTTON", "A", "LI", "H1", "H2", "H3", "H4", "SPAN"]);

const shouldInsertSpace = (previous: string, next: string) => {
  if (!previous || !next) {
    return false;
  }

  return /[\p{L}\p{N}]$/u.test(previous) && /^[\p{L}\p{N}]/u.test(next);
};

export const extractSemanticTextFromElement = (element: HTMLElement) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let text = "";

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const chunk = node.textContent?.replace(/\s+/g, " ").trim();

    if (!chunk) {
      continue;
    }

    text += shouldInsertSpace(text, chunk) ? ` ${chunk}` : chunk;
  }

  if (!text) {
    text = element.innerText?.replace(/\s+/g, " ").trim() ?? "";
  }

  return text.replace(/\s+/g, " ").trim();
};

export const isLikelySemanticElement = (element: HTMLElement) => {
  if (element.dataset.translate === "ignore") {
    return false;
  }

  if (element.dataset.translate === "block") {
    return true;
  }

  return BLOCK_TAGS.has(element.tagName);
};

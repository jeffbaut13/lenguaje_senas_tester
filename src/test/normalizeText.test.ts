import { describe, expect, it } from "vitest";
import { normalizeText } from "@/lib/translation/normalizeText";

describe("normalizeText", () => {
  it("normaliza espacios, minúsculas y diacríticos", () => {
    expect(normalizeText("  Traducción   CONTEXTUAL en   LSC ")).toBe("traduccion contextual en lsc");
  });
});

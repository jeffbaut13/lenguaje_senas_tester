import alphabet from "@/data/alphabet.json";
import type { AlphabetEntry } from "@/lib/types/plans";

export const alphabetRepository = alphabet as AlphabetEntry[];

export const getAlphabetEntry = (character: string) =>
  alphabetRepository.find((entry) => entry.char === character.toUpperCase());

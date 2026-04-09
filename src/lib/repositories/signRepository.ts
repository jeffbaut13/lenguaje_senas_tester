import signs from "@/data/signs.json";
import type { SignEntry } from "@/lib/types/plans";

export const signRepository = signs as SignEntry[];

export const getSignEntry = (id: string) => signRepository.find((entry) => entry.id === id);

export const findSignsForToken = (token: string) =>
  signRepository.filter((entry) => entry.synonyms.some((synonym) => synonym === token));

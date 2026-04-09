"use client";

import { createContext, useContext } from "react";
import type { PlayPlan, PlaybackSnapshot, SemanticPlan, SignPlan, TriggerMode } from "@/lib/types/plans";

export interface TranslationContextValue {
  triggerMode: TriggerMode;
  setTriggerMode: (mode: TriggerMode) => void;
  widgetOpen: boolean;
  setWidgetOpen: (open: boolean) => void;
  debugOpen: boolean;
  setDebugOpen: (open: boolean) => void;
  speed: number;
  setSpeed: (value: number) => void;
  activeText: string;
  activeElementId: string | null;
  captureTextFromElement: (element: HTMLElement, force?: boolean) => void;
  semanticPlan: SemanticPlan | null;
  signPlan: SignPlan | null;
  playPlan: PlayPlan | null;
  playbackSnapshot: PlaybackSnapshot;
  playCurrent: () => void;
  stopPlayback: () => void;
  resetPlayback: () => void;
}

export const TranslationContext = createContext<TranslationContextValue | null>(null);

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslationContext must be used inside HoverCaptureProvider");
  }

  return context;
};

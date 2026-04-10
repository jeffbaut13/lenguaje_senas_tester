"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { findSemanticContainer } from "@/lib/dom/findSemanticContainer";
import { extractSemanticTextFromElement } from "@/lib/dom/extractSemanticTextFromElement";
import { DEMO_CONFIG } from "@/lib/config/demoConfig";
import { AvatarPlaybackController } from "@/lib/playback/AvatarPlaybackController";
import { TranslationContext } from "@/lib/state/TranslationContext";
import { planTranslation } from "@/lib/translation/planTranslation";
import type { PlayPlan, PlaybackSnapshot, SemanticPlan, SignPlan, TriggerMode } from "@/lib/types/plans";

const INITIAL_SNAPSHOT: PlaybackSnapshot = {
  status: "idle",
  currentStepIndex: -1,
  currentPoseId: "NEUTRAL",
  activeLabel: "Neutral",
  speed: DEMO_CONFIG.playback.defaultSpeed,
  queueLength: 0,
};

export function HoverCaptureProvider({ children }: { children: React.ReactNode }) {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>("click");
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [debugOpen, setDebugOpen] = useState(false);
  const [speed, setSpeed] = useState<number>(DEMO_CONFIG.playback.defaultSpeed);
  const [activeText, setActiveText] = useState("");
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [semanticPlan, setSemanticPlan] = useState<SemanticPlan | null>(null);
  const [signPlan, setSignPlan] = useState<SignPlan | null>(null);
  const [playPlan, setPlayPlan] = useState<PlayPlan | null>(null);
  const [playbackSnapshot, setPlaybackSnapshot] = useState<PlaybackSnapshot>(INITIAL_SNAPSHOT);
  const lastCapturedTextRef = useRef("");
  const [controller] = useState(
    () =>
      new AvatarPlaybackController({
        onSnapshot: setPlaybackSnapshot,
      }),
  );

  const captureTextFromElement = useCallback(
    (element: HTMLElement, force = false) => {
      const container = findSemanticContainer(element);
      if (!container) {
        return;
      }

      const text = extractSemanticTextFromElement(container);
      if (!text || (!force && text === lastCapturedTextRef.current)) {
        return;
      }

      lastCapturedTextRef.current = text;
      const bundle = planTranslation(text);
      const stableId = container.dataset.translateId ?? container.id ?? `block-${bundle.semanticPlan.normalizedText.slice(0, 28)}`;

      setActiveText(text);
      setActiveElementId(stableId);
      setSemanticPlan(bundle.semanticPlan);
      setSignPlan(bundle.signPlan);
      setPlayPlan(bundle.playPlan);
      controller.replace(bundle.playPlan);
    },
    [controller],
  );

  useEffect(() => {
    controller.setSpeed(speed);
  }, [controller, speed]);

  useEffect(() => {
    const handlePointerMove = (event: Event) => {
      if (triggerMode !== "hover") {
        return;
      }

      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target) {
        captureTextFromElement(target);
      }
    };

    const handleFocus = (event: Event) => {
      if (triggerMode !== "focus") {
        return;
      }

      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target) {
        captureTextFromElement(target, true);
      }
    };

    const handleClick = (event: Event) => {
      if (triggerMode !== "click") {
        return;
      }
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target) {
        captureTextFromElement(target, true);
      }
    };

    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("focusin", handleFocus, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("focusin", handleFocus, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [captureTextFromElement, triggerMode]);

  const value = {
    triggerMode,
    setTriggerMode,
    widgetOpen,
    setWidgetOpen,
    debugOpen,
    setDebugOpen,
    speed,
    setSpeed,
    activeText,
    activeElementId,
    captureTextFromElement,
    semanticPlan,
    signPlan,
    playPlan,
    playbackSnapshot,
    playCurrent: () => {
      if (playPlan) {
        controller.replace(playPlan);
      }
    },
    stopPlayback: () => controller.stop(),
    resetPlayback: () => controller.resetToNeutral(),
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

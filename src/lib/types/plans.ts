export type TriggerMode = "hover" | "focus" | "click";

export type SemanticIntent =
  | "inform"
  | "navigate"
  | "learn"
  | "support"
  | "integrate"
  | "implement"
  | "cta"
  | "contact"
  | "observe";

export type SemanticDomain =
  | "general"
  | "accessibility"
  | "integration"
  | "support"
  | "commerce"
  | "education";

export interface SemanticEntity {
  type: "cta" | "product" | "audience" | "feature" | "action" | "metric";
  value: string;
}

export interface SemanticPlan {
  sourceText: string;
  normalizedText: string;
  locale: string;
  signLanguage: string;
  domain: SemanticDomain;
  intent: SemanticIntent;
  entities: SemanticEntity[];
  confidence: number;
  notes: string[];
}

export interface SignSequenceUnit {
  kind: "pose" | "pause";
  poseId?: string;
  durationMs: number;
}

export interface SignEntry {
  id: string;
  type: "concept" | "pose" | "sequence";
  label: string;
  tags: string[];
  domain: SemanticDomain | "global";
  durationMs: number;
  poseId?: string;
  sequence?: SignSequenceUnit[];
  synonyms: string[];
  intents?: SemanticIntent[];
  metadata?: {
    placeholder?: boolean;
    notes?: string;
  };
}

export interface PhraseEntry {
  id: string;
  phrase: string;
  normalized: string;
  signIds: string[];
  intent?: SemanticIntent;
  domain?: SemanticDomain;
  tags: string[];
}

export interface AlphabetEntry {
  char: string;
  poseId: string;
  durationMs: number;
  tags: string[];
}

export interface TransitionEntry {
  id: string;
  from: string;
  to: string;
  durationMs: number;
  easing: "linear" | "easeInOut";
  metadata?: {
    notes?: string;
  };
}

export interface PoseEntry {
  id: string;
  label: string;
  description: string;
  durationMs: number;
  tags: string[];
  emphasis: number;
  bones: Record<string, [number, number, number]>;
  metadata?: {
    placeholder?: boolean;
    category?: string;
  };
}

export interface SignPlanStep {
  type: "sign" | "fingerspell";
  signId?: string;
  token?: string;
  reason: "phrase" | "intent" | "token" | "fallback";
}

export interface SignPlan {
  sourceText: string;
  matchedPhraseIds: string[];
  strategy: string[];
  steps: SignPlanStep[];
  unmatchedTokens: string[];
}

export interface PlayStep {
  id: string;
  type: "pose" | "transition" | "pause" | "fingerspell";
  label: string;
  durationMs: number;
  poseId?: string;
  signId?: string;
  token?: string;
  source?: string;
}

export interface PlayPlan {
  sourceText: string;
  steps: PlayStep[];
  finalPoseId: string;
}

export interface TranslationBundle {
  semanticPlan: SemanticPlan;
  signPlan: SignPlan;
  playPlan: PlayPlan;
}

export interface PlaybackSnapshot {
  status: "idle" | "playing" | "stopped";
  currentStepIndex: number;
  currentPoseId: string;
  activeLabel: string;
  activeToken?: string;
  speed: number;
  queueLength: number;
}

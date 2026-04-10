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

export interface PoseDescriptor {
  bones: Record<string, [number, number, number]>;
  emphasis?: number;
}

export interface HandPresetEntry {
  id: string;
  label: string;
  description: string;
  bones: Record<string, [number, number, number]>;
  tags: string[];
}

export interface PoseEntry {
  id: string;
  label: string;
  type?: "base_pose" | "micro_sequence" | "fingerspell" | "transition";
  description: string;
  durationMs: number;
  tags: string[];
  domainTags?: string[];
  signTags?: string[];
  emphasis: number;
  bones: Record<string, [number, number, number]>;
  targetDescriptor?: PoseDescriptor;
  playbackStrategy?: "procedural" | "clip" | "hybrid";
  source?: "manual" | "captured_from_video" | "hybrid";
  stagingRef?: string;
  metadata?: {
    placeholder?: boolean;
    category?: string;
    notes?: string;
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

export interface PlaybackSession {
  id: string;
  plan: PlayPlan;
  status: PlaybackSnapshot["status"];
  startedAt: number;
  speed: number;
}

export interface PoseCaptureInput {
  angle: "front" | "threeQuarter" | "side";
  fileName: string;
  mimeType: string;
  durationMs: number;
  width: number;
  height: number;
}

export interface PoseLandmarkPoint {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseKeyframeSnapshot {
  label: "start" | "middle" | "end";
  timeMs: number;
  angle: PoseCaptureInput["angle"];
  landmarks: Record<string, PoseLandmarkPoint>;
  sourceFrame: number;
}

export interface PoseCaptureResult {
  sourceVideos: PoseCaptureInput[];
  extractedAt: string;
  keyframes: {
    start: PoseKeyframeSnapshot[];
    middle: PoseKeyframeSnapshot[];
    end: PoseKeyframeSnapshot[];
  };
  notes: string[];
}

export interface CandidatePoseEntry {
  id: string;
  sourceVideos: PoseCaptureInput[];
  captureMode: "triple_video_authoring";
  extractedAt: string;
  keyframes: {
    start: PoseKeyframeSnapshot[];
    middle: PoseKeyframeSnapshot[];
    end: PoseKeyframeSnapshot[];
  };
  normalizedLandmarks: Record<string, PoseLandmarkPoint>;
  suggestedPoseDescriptor: PoseDescriptor;
  tags: string[];
  notes: string[];
  reviewStatus: "draft" | "reviewed" | "promoted";
}

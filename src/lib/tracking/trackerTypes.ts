import { Quaternion, Vector3 } from "three";

export type TrackingJointName =
  | "nose"
  | "leftEye"
  | "rightEye"
  | "leftEar"
  | "rightEar"
  | "leftShoulder"
  | "rightShoulder"
  | "leftElbow"
  | "rightElbow"
  | "leftWrist"
  | "rightWrist"
  | "leftHip"
  | "rightHip";

export interface PoseJoint {
  name: TrackingJointName;
  position: Vector3;
  imagePosition?: {
    x: number;
    y: number;
  };
  confidence: number;
}

export interface PoseFrame {
  timestamp: number;
  joints: Partial<Record<TrackingJointName, PoseJoint>>;
  averageConfidence: number;
  bodyConfidence: number;
  sourceResolution: {
    width: number;
    height: number;
  };
  latencyMs: number;
}

export interface BoneRotationTarget {
  quaternion: Quaternion;
  confidence: number;
  updatedAt: number;
  source: string;
}

export interface RetargetFrame {
  timestamp: number;
  hipsPositionOffset: Vector3;
  boneTargets: Partial<Record<string, BoneRotationTarget>>;
  averageConfidence: number;
}

export interface TrackingMetrics {
  renderFps: number;
  trackingFps: number;
  estimatedLatencyMs: number;
  averageConfidence: number;
  backend: string;
  model: string;
}

export interface TrackingControlsState {
  smoothingEnabled: boolean;
  showDebugSkeleton: boolean;
  showLandmarksOverlay: boolean;
  mirrorCamera: boolean;
  smoothingGlobal: number;
  rotationDamping: number;
  confidenceThreshold: number;
  resolutionPreset: "low" | "medium" | "high";
}

export interface TrackingLogEntry {
  id: string;
  level: "info" | "warning" | "error";
  message: string;
  timestamp: number;
}

export const TRACKING_BONE_CONNECTIONS: Array<[TrackingJointName, TrackingJointName]> = [
  ["leftEye", "rightEye"],
  ["nose", "leftEye"],
  ["nose", "rightEye"],
  ["leftEye", "leftEar"],
  ["rightEye", "rightEar"],
  ["leftShoulder", "rightShoulder"],
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],
  ["leftShoulder", "leftHip"],
  ["rightShoulder", "rightHip"],
  ["leftHip", "rightHip"],
];

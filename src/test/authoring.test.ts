import { describe, expect, it } from "vitest";
import { buildCandidatePose } from "@/lib/authoring/buildCandidatePose";
import { selectKeyPoseFrames } from "@/lib/authoring/selectKeyPoseFrames";
import type { PoseCaptureResult, PoseKeyframeSnapshot } from "@/lib/types/plans";

const snapshot = (
  label: PoseKeyframeSnapshot["label"],
  angle: PoseKeyframeSnapshot["angle"],
  timeMs: number,
): PoseKeyframeSnapshot => ({
  label,
  angle,
  timeMs,
  sourceFrame: Math.round(timeMs / 33),
  landmarks: {
    leftShoulder: { x: 0.2, y: 0.4, z: 0.1, visibility: 0.9 },
    rightShoulder: { x: 0.8, y: 0.42, z: 0.12, visibility: 0.91 },
    leftElbow: { x: 0.18, y: 0.68, z: 0.16, visibility: 0.88 },
    rightElbow: { x: 0.82, y: 0.7, z: 0.18, visibility: 0.9 },
    leftWrist: { x: 0.16, y: 0.92, z: 0.2, visibility: 0.84 },
    rightWrist: { x: 0.84, y: 0.91, z: 0.22, visibility: 0.85 },
  },
});

describe("authoring pipeline", () => {
  it("selecciona keyframes por etapa", () => {
    const snapshots = [
      snapshot("start", "front", 100),
      snapshot("middle", "threeQuarter", 500),
      snapshot("end", "side", 900),
    ];

    const keyframes = selectKeyPoseFrames(snapshots);

    expect(keyframes.start).toHaveLength(1);
    expect(keyframes.middle).toHaveLength(1);
    expect(keyframes.end).toHaveLength(1);
    expect(keyframes.middle[0]?.angle).toBe("threeQuarter");
  });

  it("construye una candidate pose desde la captura", () => {
    const captureResult: PoseCaptureResult = {
      sourceVideos: [
        { angle: "front", fileName: "front.mp4", mimeType: "video/mp4", durationMs: 1200, width: 1280, height: 720 },
        { angle: "threeQuarter", fileName: "three.mp4", mimeType: "video/mp4", durationMs: 1200, width: 1280, height: 720 },
        { angle: "side", fileName: "side.mp4", mimeType: "video/mp4", durationMs: 1200, width: 1280, height: 720 },
      ],
      extractedAt: "2026-04-10T00:00:00.000Z",
      keyframes: {
        start: [snapshot("start", "front", 100)],
        middle: [snapshot("middle", "threeQuarter", 500)],
        end: [snapshot("end", "side", 900)],
      },
      notes: ["draft"],
    };

    const candidate = buildCandidatePose(captureResult, "POSE_DRAFT", ["captured"], ["draft"]);

    expect(candidate.id).toBe("POSE_DRAFT");
    expect(candidate.reviewStatus).toBe("draft");
    expect(candidate.tags).toContain("captured");
    expect(candidate.suggestedPoseDescriptor.bones.LeftUpperArm).toBeDefined();
    expect(candidate.normalizedLandmarks.leftShoulder?.visibility).toBeGreaterThan(0.5);
  });
});

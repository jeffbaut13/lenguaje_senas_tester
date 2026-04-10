import type { PoseCaptureResult, PoseKeyframeSnapshot } from "@/lib/types/plans";

export const selectKeyPoseFrames = (snapshots: PoseKeyframeSnapshot[]) => {
  const filterByLabel = (label: PoseKeyframeSnapshot["label"]) => snapshots.filter((snapshot) => snapshot.label === label);

  return {
    start: filterByLabel("start"),
    middle: filterByLabel("middle"),
    end: filterByLabel("end"),
  } satisfies PoseCaptureResult["keyframes"];
};

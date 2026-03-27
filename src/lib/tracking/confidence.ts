import type { PoseFrame, TrackingJointName } from "@/lib/tracking/trackerTypes";

export const getJointConfidence = (frame: PoseFrame | null, jointName: TrackingJointName) =>
  frame?.joints[jointName]?.confidence ?? 0;

export const hasReliableJoint = (
  frame: PoseFrame | null,
  jointName: TrackingJointName,
  threshold: number,
) => getJointConfidence(frame, jointName) >= threshold;

export const averageJointConfidence = (frame: PoseFrame | null, joints: TrackingJointName[]) => {
  if (!frame) {
    return 0;
  }

  const values = joints.map((joint) => getJointConfidence(frame, joint));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

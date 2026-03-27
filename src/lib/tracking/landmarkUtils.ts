import { Vector3 } from "three";
import type { PoseFrame, TrackingJointName } from "@/lib/tracking/trackerTypes";
import { clamp } from "@/lib/utils/clamp";

export const getJoint = (frame: PoseFrame | null, jointName: TrackingJointName) =>
  frame?.joints[jointName] ?? null;

export const getJointVector = (
  frame: PoseFrame | null,
  from: TrackingJointName,
  to: TrackingJointName,
) => {
  const fromJoint = getJoint(frame, from);
  const toJoint = getJoint(frame, to);

  if (!fromJoint || !toJoint) {
    return null;
  }

  return toJoint.position.clone().sub(fromJoint.position);
};

export const midpoint = (
  frame: PoseFrame | null,
  a: TrackingJointName,
  b: TrackingJointName,
) => {
  const jointA = getJoint(frame, a);
  const jointB = getJoint(frame, b);

  if (!jointA || !jointB) {
    return null;
  }

  return jointA.position.clone().lerp(jointB.position, 0.5);
};

export const normalizedConfidence = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return clamp(avg, 0, 1);
};

export const makeVector = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);

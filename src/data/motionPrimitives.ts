import { getHandPresetBones, type HandPresetFamily, type HandPresetVariant } from "@/data/handLibrary";
import { clampBones, fromLimits, fromLimitsPairFromLeft, type BoneRotation } from "@/data/jointLimits";

export type PoseBones = Record<string, BoneRotation>;
export type BodySide = "left" | "right";

const mergePoseBones = (...sets: Array<Partial<PoseBones> | undefined>): PoseBones =>
	Object.assign({}, ...sets) as PoseBones;

const clampUnit = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const lerpBoneRotation = (a: BoneRotation, b: BoneRotation, t: number): BoneRotation => [
	a[0] + (b[0] - a[0]) * t,
	a[1] + (b[1] - a[1]) * t,
	a[2] + (b[2] - a[2]) * t,
];

// Pose de reposo del torso y brazos (simétrica: Left define, Right se deriva por espejo).
export const neutralBodyBones: PoseBones = {
	...fromLimitsPairFromLeft("LeftShoulder", [0.59, 0.32, 0]),
	...fromLimitsPairFromLeft("LeftUpperArm", [0.67, 0.41, 0.0]),
	...fromLimitsPairFromLeft("LeftLowerArm", [1.0, 0.91, 0.62]),
	...fromLimitsPairFromLeft("LeftHand", [0.5, 0.4, 0.5]),
	Chest: fromLimits("Chest", 0.5, 0.5, 0.5),
};

export const handPresetBones = (family: HandPresetFamily, variant: HandPresetVariant): PoseBones =>
	getHandPresetBones(family, variant) as PoseBones;

export const raiseHandPrimitive = (side: BodySide, lift = 1): PoseBones => {
	const t = clampUnit(lift);
	const headNeutral = fromLimits("Head", 0.5, 0.5, 0.5);

	if (side === "right") {
		return {
			RightUpperArm: lerpBoneRotation(neutralBodyBones.RightUpperArm as BoneRotation, fromLimits("RightUpperArm", 0.37, 0.61, 0.7), t),
			RightLowerArm: lerpBoneRotation(neutralBodyBones.RightLowerArm as BoneRotation, fromLimits("RightLowerArm", 0.31, 0.67, 0.44), t),
			RightHand: lerpBoneRotation(neutralBodyBones.RightHand as BoneRotation, fromLimits("RightHand", 0.58, 0.58, 0.6), t),
			Head: lerpBoneRotation(headNeutral, fromLimits("Head", 0.5, 0.57, 0.5), t),
			Chest: lerpBoneRotation(neutralBodyBones.Chest as BoneRotation, fromLimits("Chest", 0.58, 0.5, 0.5), t),
		};
	}

	return {
		LeftUpperArm: lerpBoneRotation(neutralBodyBones.LeftUpperArm as BoneRotation, fromLimits("LeftUpperArm", 0.37, 0.39, 0.3), t),
		LeftLowerArm: lerpBoneRotation(neutralBodyBones.LeftLowerArm as BoneRotation, fromLimits("LeftLowerArm", 0.31, 0.33, 0.56), t),
		LeftHand: lerpBoneRotation(neutralBodyBones.LeftHand as BoneRotation, fromLimits("LeftHand", 0.58, 0.42, 0.4), t),
		Head: lerpBoneRotation(headNeutral, fromLimits("Head", 0.5, 0.43, 0.5), t),
		Chest: lerpBoneRotation(neutralBodyBones.Chest as BoneRotation, fromLimits("Chest", 0.58, 0.5, 0.5), t),
	};
};

export const wristWavePrimitive = (side: BodySide, phase: "out" | "in", intensity = 1): PoseBones => {
	const t = clampUnit(intensity);

	if (side === "right") {
		const target: PoseBones = phase === "out"
			? {
				RightLowerArm: fromLimits("RightLowerArm", 0.36, 0.73, 0.4),
				RightHand: fromLimits("RightHand", 0.55, 0.72, 0.6),
			}
			: {
				RightLowerArm: fromLimits("RightLowerArm", 0.36, 0.27, 0.4),
				RightHand: fromLimits("RightHand", 0.55, 0.28, 0.6),
			};

		return {
			RightLowerArm: lerpBoneRotation(neutralBodyBones.RightLowerArm as BoneRotation, target.RightLowerArm as BoneRotation, t),
			RightHand: lerpBoneRotation(neutralBodyBones.RightHand as BoneRotation, target.RightHand as BoneRotation, t),
		};
	}

	const target: PoseBones = phase === "out"
		? {
			LeftLowerArm: fromLimits("LeftLowerArm", 0.64, 0.27, 0.6),
			LeftHand: fromLimits("LeftHand", 0.55, 0.28, 0.6),
		}
		: {
			LeftLowerArm: fromLimits("LeftLowerArm", 0.64, 0.73, 0.6),
			LeftHand: fromLimits("LeftHand", 0.55, 0.72, 0.6),
		};

	return {
		LeftLowerArm: lerpBoneRotation(neutralBodyBones.LeftLowerArm as BoneRotation, target.LeftLowerArm as BoneRotation, t),
		LeftHand: lerpBoneRotation(neutralBodyBones.LeftHand as BoneRotation, target.LeftHand as BoneRotation, t),
	};
};

export const composeMotionBones = (...layers: Array<Partial<PoseBones> | undefined>): PoseBones =>
	clampBones(mergePoseBones(...layers));

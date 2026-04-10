import type Human from "@vladmandic/human";
import type { Result } from "@vladmandic/human";
import type { PoseLandmarkPoint } from "@/lib/types/plans";

const LANDMARK_NAMES = [
  "nose",
  "leftEye",
  "rightEye",
  "leftShoulder",
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist",
  "leftHip",
  "rightHip",
] as const;

const toLandmarkRecord = (result: Result) => {
  const keypoints = result.body?.[0]?.keypoints ?? [];

  return LANDMARK_NAMES.reduce<Record<string, PoseLandmarkPoint>>((accumulator, keypointName) => {
    const point = keypoints.find((entry) => entry.part === keypointName);
    accumulator[keypointName] = {
      x: point?.position?.[0] ?? 0,
      y: point?.position?.[1] ?? 0,
      z: point?.position?.[2] ?? 0,
      visibility: point?.score ?? 0,
    };
    return accumulator;
  }, {});
};

let authoringHumanInstance: Human | null = null;

export const getAuthoringHumanClient = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  const { default: HumanRuntime } = await import("@vladmandic/human");

  if (!authoringHumanInstance) {
    authoringHumanInstance = new HumanRuntime({
      backend: "webgl",
      async: true,
      cacheModels: true,
      debug: false,
      warmup: "none",
      modelBasePath: "https://vladmandic.github.io/human-models/models/",
      face: { enabled: false },
      hand: { enabled: false },
      object: { enabled: false },
      segmentation: { enabled: false },
      gesture: { enabled: false },
      body: {
        enabled: true,
        modelPath: "movenet-lightning.json",
        maxDetected: 1,
        minConfidence: 0.2,
      },
    });
    await authoringHumanInstance.init();
    await authoringHumanInstance.load();
  }

  return authoringHumanInstance;
};

export const extractLandmarksWithMediapipeStyleAdapter = async (video: HTMLVideoElement) => {
  const human = await getAuthoringHumanClient();
  if (!human) {
    throw new Error("Human/MediaPipe adapter is only available in the browser.");
  }

  const result = await human.detect(video);
  return {
    rawResult: result,
    landmarks: toLandmarkRecord(result),
  };
};

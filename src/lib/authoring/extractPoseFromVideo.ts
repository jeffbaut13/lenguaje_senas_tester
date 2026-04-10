import { extractLandmarksWithMediapipeStyleAdapter } from "@/lib/authoring/mediapipeAdapter";
import type { PoseCaptureInput, PoseKeyframeSnapshot } from "@/lib/types/plans";

const loadVideoFromFile = (file: File) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error(`No se pudo cargar el video ${file.name}.`));
  });

const seekVideo = (video: HTMLVideoElement, timeSeconds: number) =>
  new Promise<void>((resolve, reject) => {
    const handleSeeked = () => {
      video.removeEventListener("seeked", handleSeeked);
      resolve();
    };
    const handleError = () => {
      video.removeEventListener("error", handleError);
      reject(new Error("Error al posicionar el video para extraer keyframes."));
    };

    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError, { once: true });
    video.currentTime = Math.max(0, Math.min(timeSeconds, video.duration || timeSeconds));
  });

export const buildCaptureInputFromFile = async (
  file: File,
  angle: PoseCaptureInput["angle"],
): Promise<{ captureInput: PoseCaptureInput; video: HTMLVideoElement }> => {
  const video = await loadVideoFromFile(file);
  const captureInput: PoseCaptureInput = {
    angle,
    fileName: file.name,
    mimeType: file.type,
    durationMs: Math.round((video.duration || 0) * 1000),
    width: video.videoWidth || 0,
    height: video.videoHeight || 0,
  };

  return {
    captureInput,
    video,
  };
};

export const extractPoseSnapshotsFromVideo = async (
  video: HTMLVideoElement,
  angle: PoseCaptureInput["angle"],
): Promise<PoseKeyframeSnapshot[]> => {
  const checkpoints = [
    { label: "start" as const, fraction: 0.1 },
    { label: "middle" as const, fraction: 0.5 },
    { label: "end" as const, fraction: 0.85 },
  ];

  const snapshots: PoseKeyframeSnapshot[] = [];

  for (const checkpoint of checkpoints) {
    const currentTime = (video.duration || 0) * checkpoint.fraction;
    await seekVideo(video, currentTime);

    const extraction = await extractLandmarksWithMediapipeStyleAdapter(video);
    snapshots.push({
      label: checkpoint.label,
      timeMs: Math.round(currentTime * 1000),
      angle,
      landmarks: extraction.landmarks,
      sourceFrame: Math.round(currentTime * 30),
    });
  }

  return snapshots;
};

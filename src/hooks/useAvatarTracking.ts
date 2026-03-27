"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Result } from "@vladmandic/human";
import { Vector3 } from "three";
import { APP_CONFIG } from "@/lib/config/appConfig";
import { BoneSmoothingController, VectorSmoothingController } from "@/lib/tracking/smoothing";
import { FpsCounter } from "@/lib/utils/fps";
import { HumanLoop } from "@/lib/human/humanLoop";
import { getHumanClient, warmupHumanClient } from "@/lib/human/humanClient";
import type {
  PoseFrame,
  TrackingControlsState,
  TrackingLogEntry,
  TrackingMetrics,
  TrackingJointName,
} from "@/lib/tracking/trackerTypes";
import { TRACKING_BONE_CONNECTIONS } from "@/lib/tracking/trackerTypes";
import type { VRMRig } from "@/lib/vrm/vrmRig";

interface UseAvatarTrackingOptions {
  controls: TrackingControlsState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  overlayRef: React.RefObject<HTMLCanvasElement | null>;
  streamState: string;
}

const initialMetrics: TrackingMetrics = {
  renderFps: 0,
  trackingFps: 0,
  estimatedLatencyMs: 0,
  averageConfidence: 0,
  backend: "",
  model: "body",
};

const DISPLAY_SMOOTHING_ALPHA = 0.3;
const DISPLAY_HOLD_MS = 420;

const clonePoseFrame = (frame: PoseFrame): PoseFrame => ({
  ...frame,
  joints: Object.fromEntries(
    Object.entries(frame.joints).map(([jointName, joint]) => [
      jointName,
      joint
        ? {
            ...joint,
            position: joint.position.clone(),
          }
        : joint,
    ]),
  ) as PoseFrame["joints"],
});

const mirrorPoseFrameForDisplay = (frame: PoseFrame, enabled: boolean): PoseFrame => {
  if (!enabled) {
    return frame;
  }

  const mirrored = clonePoseFrame(frame);

  Object.values(mirrored.joints).forEach((joint) => {
    if (!joint) {
      return;
    }

    joint.position = new Vector3(-joint.position.x, joint.position.y, joint.position.z);
  });

  return mirrored;
};

const renderOverlay = (canvas: HTMLCanvasElement | null, frame: PoseFrame | null) => {
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!frame) {
    return;
  }

  context.fillStyle = "rgba(61, 215, 196, 0.92)";
  context.strokeStyle = "rgba(61, 215, 196, 0.92)";
  context.lineWidth = 2;
  context.font = '11px "IBM Plex Sans", sans-serif';

  const project = (jointName: TrackingJointName) => {
    const joint = frame.joints[jointName];
    if (!joint) {
      return null;
    }

    return {
      x: (joint.imagePosition?.x ?? 0.5) * canvas.width,
      y: (joint.imagePosition?.y ?? 0.5) * canvas.height,
      confidence: joint.confidence,
      name: joint.name,
    };
  };

  TRACKING_BONE_CONNECTIONS.forEach(([from, to]) => {
    const start = project(from);
    const end = project(to);
    if (!start || !end) {
      return;
    }

    context.globalAlpha = Math.min(start.confidence, end.confidence) * 0.9;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  });

  Object.values(frame.joints).forEach((joint) => {
    if (!joint) {
      return;
    }

    const x = (joint.imagePosition?.x ?? 0.5) * canvas.width;
    const y = (joint.imagePosition?.y ?? 0.5) * canvas.height;
    context.globalAlpha = Math.max(0.35, joint.confidence);
    context.beginPath();
    context.arc(x, y, 4.8, 0, Math.PI * 2);
    context.fill();
    if (joint.confidence > 0.45) {
      context.fillText(joint.name, x + 6, y - 6);
    }
  });

  context.globalAlpha = 1;
};

const stabilizePoseFrame = (
  frame: PoseFrame | null,
  previousFrame: PoseFrame | null,
  now: number,
): PoseFrame | null => {
  if (!frame && !previousFrame) {
    return null;
  }

  const nextFrame = frame ? clonePoseFrame(frame) : clonePoseFrame(previousFrame!);
  const previousJoints = previousFrame?.joints ?? {};

  const jointNames = new Set<TrackingJointName>([
    ...Object.keys(previousJoints),
    ...Object.keys(nextFrame.joints),
  ] as TrackingJointName[]);

  jointNames.forEach((jointName) => {
    const incoming = nextFrame.joints[jointName];
    const previous = previousJoints[jointName];

    if (incoming && previous) {
      incoming.position.lerp(previous.position, 1 - DISPLAY_SMOOTHING_ALPHA);
      incoming.confidence = Math.max(incoming.confidence, previous.confidence * 0.92);
      return;
    }

    if (!incoming && previous && now - previousFrame!.timestamp <= DISPLAY_HOLD_MS) {
      nextFrame.joints[jointName] = {
        ...previous,
        position: previous.position.clone(),
        confidence: previous.confidence * 0.94,
      };
    }
  });

  nextFrame.timestamp = now;
  nextFrame.averageConfidence =
    Object.values(nextFrame.joints).reduce((sum, joint) => sum + (joint?.confidence ?? 0), 0) /
    Math.max(1, Object.values(nextFrame.joints).filter(Boolean).length);

  return nextFrame;
};

export function useAvatarTracking({
  controls,
  videoRef,
  overlayRef,
  streamState,
}: UseAvatarTrackingOptions) {
  const rigRef = useRef<VRMRig | null>(null);
  const rawFrameRef = useRef<PoseFrame | null>(null);
  const displayFrameRef = useRef<PoseFrame | null>(null);
  const targetFrameRef = useRef<PoseFrame | null>(null);
  const latestResultRef = useRef<Result | null>(null);
  const humanLoopRef = useRef<HumanLoop | null>(null);
  const trackingFpsRef = useRef(new FpsCounter(APP_CONFIG.tracking.trackingFpsSmoothing));
  const boneSmoothingRef = useRef(new BoneSmoothingController());
  const hipsSmoothingRef = useRef(new VectorSmoothingController());
  const lastReliableAtRef = useRef(0);
  const controlsRef = useRef(controls);
  const [metrics, setMetrics] = useState<TrackingMetrics>(initialMetrics);
  const [logs, setLogs] = useState<TrackingLogEntry[]>([]);
  const [status, setStatus] = useState("idle");
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [avatarLoadVersion, setAvatarLoadVersion] = useState(0);

  controlsRef.current = controls;

  const pushLog = useCallback((entry: TrackingLogEntry) => {
    setLogs((current) => [entry, ...current].slice(0, 40));
  }, []);

  const loadAvatar = useCallback(async () => {
    setStatus("loading avatar");
    setLastError(null);
    setAvatarLoaded(false);
    setAvatarLoadVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    void loadAvatar();
  }, [loadAvatar]);

  const handleAvatarLoaded = useCallback(
    (rig: VRMRig) => {
      rigRef.current = rig;
      boneSmoothingRef.current.reset(rig.restPose);
      hipsSmoothingRef.current.reset();
      setAvatarLoaded(true);
      setStatus((current) => (current.includes("tracking") ? "tracking + avatar ready" : "avatar ready"));
      pushLog({
        id: `avatar-${Date.now()}`,
        level: "info",
        message: `Avatar cargado desde ${APP_CONFIG.avatar.path}.`,
        timestamp: Date.now(),
      });
    },
    [pushLog],
  );

  const handleAvatarError = useCallback(
    (error: unknown) => {
      const message = error instanceof Error ? error.message : "No se pudo cargar el avatar.";
      setLastError(message);
      setStatus("avatar error");
      setAvatarLoaded(false);
      pushLog({
        id: `avatar-error-${Date.now()}`,
        level: "error",
        message,
        timestamp: Date.now(),
      });
    },
    [pushLog],
  );

  const resetPose = useCallback(() => {
    const rig = rigRef.current;
    if (!rig) {
      return;
    }

    rig.vrm.humanoid.resetNormalizedPose();
    boneSmoothingRef.current.reset(rig.restPose);
    hipsSmoothingRef.current.reset();
    pushLog({
      id: `reset-${Date.now()}`,
      level: "info",
      message: "Pose reiniciada a rest pose.",
      timestamp: Date.now(),
    });
  }, [pushLog]);

  const handleRenderFps = useCallback((fps: number) => {
    setMetrics((current) => ({
      ...current,
      renderFps: fps,
    }));
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!overlay || !video) {
      return;
    }

    const resizeOverlay = () => {
      overlay.width = video.videoWidth || 960;
      overlay.height = video.videoHeight || 540;
    };

    resizeOverlay();
    video.addEventListener("loadedmetadata", resizeOverlay);
    return () => video.removeEventListener("loadedmetadata", resizeOverlay);
  }, [overlayRef, videoRef]);

  useEffect(() => {
    if (streamState !== "running" || !videoRef.current) {
      humanLoopRef.current?.stop();
      setStatus((current) => (current.includes("avatar ready") ? "avatar ready" : "idle"));
      return;
    }

    let cancelled = false;

    const boot = async () => {
      try {
        setStatus((current) => (current.includes("avatar ready") ? "warming human + avatar ready" : "warming human"));
        const human = await warmupHumanClient(controlsRef.current.resolutionPreset);
        if (cancelled) {
          return;
        }

        setMetrics((current) => ({
          ...current,
          backend: human.config.backend ?? "webgl",
          model: human.config.body?.modelPath ?? "body",
        }));

        const loop = new HumanLoop({
          video: videoRef.current!,
          getHuman: () => getHumanClient(controlsRef.current.resolutionPreset),
          getControls: () => controlsRef.current,
          onFrame: (frame, result) => {
            latestResultRef.current = result;
            rawFrameRef.current = frame;
            const mirroredDisplayFrame = frame
              ? mirrorPoseFrameForDisplay(frame, controlsRef.current.mirrorCamera)
              : null;
            displayFrameRef.current = stabilizePoseFrame(
              mirroredDisplayFrame,
              displayFrameRef.current,
              performance.now(),
            );
            const mirroredAvatarFrame = frame ? clonePoseFrame(frame) : null;
            targetFrameRef.current = stabilizePoseFrame(
              mirroredAvatarFrame,
              targetFrameRef.current,
              performance.now(),
            );
            trackingFpsRef.current.tick();
            setLastError(result.error ?? null);

            if (targetFrameRef.current && targetFrameRef.current.averageConfidence >= controlsRef.current.confidenceThreshold) {
              lastReliableAtRef.current = performance.now();
            }

            renderOverlay(overlayRef.current, controlsRef.current.showLandmarksOverlay ? rawFrameRef.current : null);

            setMetrics((current) => ({
              ...current,
              trackingFps: trackingFpsRef.current.value(),
              estimatedLatencyMs: rawFrameRef.current?.latencyMs ?? current.estimatedLatencyMs,
              averageConfidence: rawFrameRef.current?.averageConfidence ?? current.averageConfidence,
              backend: current.backend,
            }));
          },
          onError: (error) => {
            const message = error instanceof Error ? error.message : "Tracking detect failed.";
            setLastError(message);
          },
          onLog: pushLog,
        });

        humanLoopRef.current = loop;
        loop.start();
        setStatus((current) => (current.includes("avatar ready") ? "tracking + avatar ready" : "tracking"));
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo inicializar Human.";
        setLastError(message);
        setStatus("tracking error");
        pushLog({
          id: `human-init-${Date.now()}`,
          level: "error",
          message,
          timestamp: Date.now(),
        });
      }
    };

    void boot();

    return () => {
      cancelled = true;
      humanLoopRef.current?.stop();
      humanLoopRef.current = null;
    };
  }, [overlayRef, pushLog, streamState, videoRef]);

  useEffect(
    () => () => {
      humanLoopRef.current?.stop();
    },
    [],
  );

  const trackingSummary = useMemo(() => {
    const frame = rawFrameRef.current;
    return [
      `Confidence media: ${(frame?.averageConfidence ?? 0).toFixed(2)}`,
      `Torso estable: ${frame && frame.averageConfidence >= controls.confidenceThreshold ? "si" : "no"}`,
      `Suavizado: ${controls.smoothingEnabled ? "activo" : "desactivado"}`,
      `Threshold: ${controls.confidenceThreshold.toFixed(2)}`,
    ];
  }, [controls.confidenceThreshold, controls.smoothingEnabled, metrics.averageConfidence]);

  const debugLines = useMemo(() => {
    const frame = rawFrameRef.current;
    const activeJoints = Object.values(frame?.joints ?? {}).filter(Boolean).length;
    const rigBoneCount = rigRef.current?.bones.size ?? 0;
    const bodyCount = latestResultRef.current?.body?.length ?? 0;
    const firstBodyKeypoints = latestResultRef.current?.body?.[0]?.keypoints?.length ?? 0;
    const humanError = latestResultRef.current?.error ?? "none";
    const firstBodyParts = latestResultRef.current?.body?.[0]?.keypoints
      ?.slice(0, 8)
      .map((keypoint) => keypoint.part)
      .join(", ");
    const visibleTargets = rigRef.current
      ? Array.from(rigRef.current.bones.keys()).filter(
          (boneName) => !!rigRef.current && !!rigRef.current.bones.get(boneName),
        ).length
      : 0;
    return [
      `Avatar loaded: ${avatarLoaded ? "yes" : "no"}`,
      `Rig bones mapped: ${rigBoneCount}`,
      `Rig bones active: ${visibleTargets}`,
      `Detected bodies: ${bodyCount}`,
      `First body keypoints: ${firstBodyKeypoints}`,
      `Active joints this frame: ${activeJoints}`,
      `Debug skeleton visible: ${controls.showDebugSkeleton ? "yes" : "no"}`,
      `Landmarks overlay visible: ${controls.showLandmarksOverlay ? "yes" : "no"}`,
      `Average confidence: ${metrics.averageConfidence.toFixed(2)}`,
      `Backend: ${metrics.backend || "pending"}`,
      `Model: ${metrics.model || "pending"}`,
      `Human error: ${humanError}`,
      `Keypoint sample: ${firstBodyParts || "none"}`,
    ];
  }, [
    avatarLoaded,
    controls.showDebugSkeleton,
    controls.showLandmarksOverlay,
    metrics.averageConfidence,
    metrics.backend,
    metrics.model,
  ]);

  const avatarViewProps = useMemo(
    () => ({
      avatarPath: APP_CONFIG.avatar.path,
      loadVersion: avatarLoadVersion,
      avatarLoaded,
      status,
      showDebugSkeleton: controls.showDebugSkeleton,
      runtimeRefs: {
        rigRef,
        displayFrameRef,
        targetFrameRef,
        controlsRef,
        lastReliableAtRef,
        boneSmoothingRef,
        hipsSmoothingRef,
      },
      onAvatarLoaded: handleAvatarLoaded,
      onAvatarError: handleAvatarError,
      onRenderFps: handleRenderFps,
    }),
    [
      avatarLoadVersion,
      avatarLoaded,
      status,
      controls.showDebugSkeleton,
      handleAvatarLoaded,
      handleAvatarError,
      handleRenderFps,
    ],
  );

  return {
    metrics,
    status,
    logs,
    avatarLoaded,
    lastError,
    loadAvatar,
    resetPose,
    trackingSummary,
    debugLines,
    avatarViewProps,
  };
}

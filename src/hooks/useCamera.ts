"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG, type ResolutionPresetKey } from "@/lib/config/appConfig";

export function useCamera(resolutionPreset: ResolutionPresetKey) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streamState, setStreamState] = useState<"idle" | "starting" | "running" | "stopped" | "error">("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStreamState("stopped");
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setStreamState("starting");
      setLastError(null);
      const preset = APP_CONFIG.camera.presets[resolutionPreset];
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: APP_CONFIG.camera.facingMode,
          width: { ideal: preset.width },
          height: { ideal: preset.height },
          frameRate: APP_CONFIG.camera.frameRate,
        },
        audio: false,
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;

      if (!videoRef.current) {
        throw new Error("No se encontró el elemento de video para asociar la cámara.");
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStreamState("running");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar la cámara.";
      setLastError(message);
      setStreamState("error");
    }
  }, [resolutionPreset]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef,
    overlayRef,
    streamState,
    lastError,
    startCamera,
    stopCamera,
  };
}

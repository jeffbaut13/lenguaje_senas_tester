"use client";

import { useEffect, useRef } from "react";

export const useAnimationLoop = (callback: (deltaSeconds: number, now: number) => void, enabled: boolean) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let animationFrame = 0;
    let previous = performance.now();

    const loop = (now: number) => {
      const deltaSeconds = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      callbackRef.current(deltaSeconds, now);
      animationFrame = window.requestAnimationFrame(loop);
    };

    animationFrame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [enabled]);
};

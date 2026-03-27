export const APP_CONFIG = {
  avatar: {
    path: "/avatar/avatar.vrm",
    heightOffset: -1.02,
    initialDistance: 2.35,
  },
  camera: {
    width: 960,
    height: 540,
    facingMode: "user",
    frameRate: { ideal: 30, max: 60 },
    presets: {
      low: { width: 640, height: 360 },
      medium: { width: 960, height: 540 },
      high: { width: 1280, height: 720 },
    },
  },
  tracking: {
    targetFps: 24,
    renderFpsSmoothing: 0.18,
    trackingFpsSmoothing: 0.2,
    confidenceThreshold: 0.42,
    smoothing: 0.72,
    rotationDamping: 0.2,
    deadZoneRadians: 0.02,
    lostTrackingGraceMs: 650,
    restDecayPerSecond: 0.9,
    maxAngularVelocity: Math.PI * 1.6,
  },
  debug: {
    showLandmarkNames: false,
    showBoneHelpers: false,
  },
} as const;

export type ResolutionPresetKey = keyof typeof APP_CONFIG.camera.presets;

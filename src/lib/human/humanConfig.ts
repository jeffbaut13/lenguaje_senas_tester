import type { Config } from "@vladmandic/human";
import { APP_CONFIG, type ResolutionPresetKey } from "@/lib/config/appConfig";

export const createHumanConfig = (preset: ResolutionPresetKey): Partial<Config> => ({
  backend: "webgl",
  async: true,
  debug: false,
  cacheModels: true,
  warmup: "none",
  modelBasePath: "https://vladmandic.github.io/human-models/models/",
  filter: {
    enabled: true,
    equalization: false,
    flip: false,
    width: APP_CONFIG.camera.presets[preset].width,
    height: APP_CONFIG.camera.presets[preset].height,
  },
  gesture: { enabled: false },
  face: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  segmentation: { enabled: false },
  body: {
    enabled: true,
    modelPath: "movenet-lightning.json",
    maxDetected: 1,
    minConfidence: 0.2,
    skipFrames: 0,
    skipTime: 0,
  },
});

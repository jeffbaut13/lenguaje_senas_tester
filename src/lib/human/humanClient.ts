import type Human from "@vladmandic/human";
import type { Config } from "@vladmandic/human";
import { createHumanConfig } from "@/lib/human/humanConfig";
import type { ResolutionPresetKey } from "@/lib/config/appConfig";

let humanInstance: Human | null = null;

export const getHumanClient = async (preset: ResolutionPresetKey) => {
  const { default: HumanRuntime } = await import("@vladmandic/human");
  const config = createHumanConfig(preset) as Partial<Config>;

  if (!humanInstance) {
    humanInstance = new HumanRuntime(config);
    await humanInstance.init();
  } else {
    humanInstance.config = {
      ...humanInstance.config,
      ...config,
      body: {
        ...humanInstance.config.body,
        ...config.body,
      },
      filter: {
        ...humanInstance.config.filter,
        ...config.filter,
      },
    };
  }

  return humanInstance;
};

export const warmupHumanClient = async (preset: ResolutionPresetKey) => {
  const human = await getHumanClient(preset);
  await human.load();
  return human;
};

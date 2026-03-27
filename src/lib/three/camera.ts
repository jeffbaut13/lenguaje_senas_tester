import { PerspectiveCamera } from "three";
import { APP_CONFIG } from "@/lib/config/appConfig";

export const createSceneCamera = (aspect: number) => {
  const camera = new PerspectiveCamera(24, aspect, 0.1, 100);
  camera.position.set(0, 1.45, APP_CONFIG.avatar.initialDistance);
  camera.lookAt(0, 1.15, 0);
  return camera;
};

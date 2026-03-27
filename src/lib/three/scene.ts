import { AxesHelper, Color, GridHelper, Scene } from "three";
import { addDefaultLights } from "@/lib/three/lights";

export const createScene = () => {
  const scene = new Scene();
  scene.background = new Color(0x040b10);

  const grid = new GridHelper(6, 24, 0x1d5365, 0x0d2231);
  scene.add(grid);

  const axes = new AxesHelper(0.3);
  axes.position.set(0, 0.02, 0);
  scene.add(axes);

  addDefaultLights(scene);
  return scene;
};

import { AmbientLight, DirectionalLight, HemisphereLight, Scene } from "three";

export const addDefaultLights = (scene: Scene) => {
  const hemi = new HemisphereLight(0x9cd6ff, 0x08131d, 1.25);
  scene.add(hemi);

  const key = new DirectionalLight(0xffffff, 1.75);
  key.position.set(2.5, 4, 3);
  scene.add(key);

  const fill = new DirectionalLight(0x6fe8ff, 0.65);
  fill.position.set(-3, 2.2, 2);
  scene.add(fill);

  scene.add(new AmbientLight(0x2a4c66, 0.38));
};

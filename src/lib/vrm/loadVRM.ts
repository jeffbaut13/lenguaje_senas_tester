import { Box3, Group, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils, type VRM } from "@pixiv/three-vrm";

export const loadVRM = async (url: string) => {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const gltf = await loader.loadAsync(url);
  const vrm = gltf.userData.vrm as VRM | undefined;

  if (!vrm) {
    throw new Error("No se pudo obtener un avatar VRM válido desde el archivo indicado.");
  }

  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  VRMUtils.combineSkeletons(gltf.scene);

  const root = new Group();
  root.add(vrm.scene);

  const bounds = new Box3().setFromObject(vrm.scene);
  const center = bounds.getCenter(new Vector3());
  const size = bounds.getSize(new Vector3());
  const floorY = bounds.min.y;

  vrm.scene.position.x -= center.x;
  vrm.scene.position.z -= center.z;
  vrm.scene.position.y -= floorY;

  return {
    root,
    vrm,
    bounds: {
      center,
      size,
      floorY,
    },
  };
};

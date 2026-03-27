import { Color, SRGBColorSpace, WebGLRenderer } from "three";

export const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(new Color(0x000000), 0);
  renderer.outputColorSpace = SRGBColorSpace;
  return renderer;
};

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["three", "@pixiv/three-vrm"],
  },
};

export default nextConfig;

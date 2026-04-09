import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      "postcss.config.mjs",
      "src/components/AppShell.tsx",
      "src/components/AvatarCanvas.tsx",
      "src/components/CameraPanel.tsx",
      "src/components/ClientOnlyAppShell.tsx",
      "src/components/ControlPanel.tsx",
      "src/components/DebugOverlay.tsx",
      "src/components/LogPanel.tsx",
      "src/components/MetricsPanel.tsx",
      "src/hooks/**",
      "src/lib/human/**",
      "src/lib/tracking/**",
      "src/workers/**",
    ],
  },
];

export default config;

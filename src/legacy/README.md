# Legacy Tracking Lab

Este directorio documenta el flujo anterior del proyecto, centrado en webcam, Human, tracking de landmarks y retargeting experimental.

Codigo legacy que debe quedar fuera del runtime principal:

- `src/hooks/useCamera.ts`
- `src/hooks/useAvatarTracking.ts`
- `src/lib/human/*`
- `src/lib/tracking/*`
- `src/workers/human.worker.ts`
- `src/components/CameraPanel.tsx`
- `src/components/ControlPanel.tsx`
- `src/components/DebugOverlay.tsx`
- `src/components/MetricsPanel.tsx`
- `src/components/LogPanel.tsx`
- `src/components/AppShell.tsx`
- `src/components/ClientOnlyAppShell.tsx`

Piezas reutilizadas en la demo actual:

- `src/lib/vrm/loadVRM.ts`
- `src/lib/vrm/restPose.ts`
- `src/lib/vrm/vrmBones.ts`
- `src/lib/vrm/vrmRig.ts`

Pieza legacy que hoy sigue viva solo para authoring:

- `@vladmandic/human` a traves de `src/lib/authoring/mediapipeAdapter.ts`

La experiencia principal del producto sigue:

`DOM/texto -> semanticPlan -> signPlan -> playPlan -> avatar`

La captura desde video es un toolkit interno y no una dependencia del runtime productivo.

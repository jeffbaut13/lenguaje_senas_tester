# Legacy Tracking Lab

Este directorio documenta el flujo anterior del proyecto, centrado en webcam, Human, tracking de landmarks y retargeting experimental.

Código legacy a aislar del producto demo actual:

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

Piezas reutilizadas en la nueva demo:

- `src/lib/vrm/loadVRM.ts`
- `src/lib/vrm/restPose.ts`
- `src/lib/vrm/vrmBones.ts`
- `src/lib/vrm/vrmRig.ts`

La experiencia principal ya no usa permisos del navegador ni tracking humano. El foco es `DOM/texto -> semanticPlan -> signPlan -> playPlan -> avatar`.

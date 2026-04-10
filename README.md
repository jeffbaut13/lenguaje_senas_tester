# Contexto LSC Demo

Base de producto para accesibilidad digital con traduccion contextual en LSC usando avatar VRM. El proyecto ya no esta orientado a webcam ni tracking humano en vivo como experiencia principal.

## Vision

El producto principal sigue este flujo:

`DOM/texto -> semanticPlan -> signPlan -> playPlan -> avatar VRM`

La demo captura bloques semanticos del DOM, normaliza el texto, construye planes internos depurables y reproduce poses o micro-secuencias en un widget flotante.

En paralelo, el repo ahora incluye un segundo flujo interno de authoring:

`3 videos de referencia -> extraccion de landmarks -> keyframes -> candidate pose -> staging`

Ese flujo sirve para acelerar la creacion de nuevas poses sin volver el runtime del producto una app de camara.

## Que cambia respecto al laboratorio anterior

- El runtime principal no pide permisos de camara.
- El runtime principal no depende de webcam ni landmarks en vivo.
- Human y el tracking antiguo quedan aislados como toolkit de authoring interno.
- El avatar no recibe coordenadas crudas desde IA o tracking en el flujo principal.
- La reproduccion sigue usando assets internos controlados: poses, secuencias, transitions y fallback de fingerspelling.

## Arquitectura

### Runtime principal

1. DOM capture layer
   - `src/lib/dom/findSemanticContainer.ts`
   - `src/lib/dom/extractSemanticTextFromElement.ts`

2. Normalization y semantic layer
   - `src/lib/translation/normalizeText.ts`
   - `src/lib/translation/classifyIntent.ts`
   - `src/lib/translation/extractEntities.ts`
   - `src/lib/translation/translateTextToSemanticPlan.ts`

3. Sign engine
   - `src/lib/sign-engine/resolvePhrasePlan.ts`
   - `src/lib/sign-engine/resolveTokenPlan.ts`
   - `src/lib/sign-engine/resolveFingerSpellingPlan.ts`
   - `src/lib/sign-engine/buildSignPlanFromSemanticPlan.ts`
   - `src/lib/sign-engine/buildPlayPlan.ts`

4. Avatar playback
   - `src/lib/playback/AvatarPlaybackController.ts`
   - `src/lib/playback/poseResolver.ts`
   - `src/components/avatar/AvatarCanvas.tsx`
   - `src/components/avatar/AvatarWidget.tsx`

### Authoring offline / interno

- `src/app/dev/pose-capture/page.tsx`
- `src/components/dev/PoseCaptureStudio.tsx`
- `src/lib/authoring/mediapipeAdapter.ts`
- `src/lib/authoring/extractPoseFromVideo.ts`
- `src/lib/authoring/selectKeyPoseFrames.ts`
- `src/lib/authoring/buildCandidatePose.ts`
- `src/lib/authoring/saveCandidatePose.ts`
- `src/app/api/authoring/stage/route.ts`

## Paginas clave

- `/`
  Landing demo principal con cards editoriales y widget/avatar flotante.
- `/dev/pose-library`
  Inspeccion visual de poses, semanticPlan, signPlan y playPlan.
- `/dev/pose-capture`
  Flujo interno para subir tres videos, extraer keyframes y guardar candidate poses en staging.

## Como correr la demo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

### Que deberias ver

- Una landing clara y calida con acento naranja.
- Un widget/avatar flotante a la derecha.
- Textos, botones y tarjetas marcados para traduccion contextual.
- El avatar reaccionando a `hover`, `focus` o `click` segun el trigger seleccionado.
- Un panel debug opcional para inspeccionar `semanticPlan`, `signPlan`, `playPlan` y playback.

## Como usar la landing

1. Abre el widget si esta colapsado.
2. Cambia el trigger entre `hover`, `focus` o `click`.
3. Interactua con titulos, parrafos cortos, chips o CTAs.
4. El sistema detecta el bloque, construye los planes y reemplaza limpiamente la reproduccion actual.

## Pose library

Datos principales:

- `src/data/signs.json`
- `src/data/phrases.json`
- `src/data/alphabet.json`
- `src/data/transitions.json`
- `src/data/poseLibrary.ts`

### Tipos importantes

- `SemanticPlan`
- `SignEntry`
- `PhraseEntry`
- `AlphabetEntry`
- `PoseEntry`
- `CandidatePoseEntry`
- `TransitionEntry`
- `PlayStep`
- `PlaybackSession`
- `PoseCaptureInput`
- `PoseCaptureResult`
- `PoseKeyframeSnapshot`

## Agregar una pose manual

1. Ejecuta `npm run scaffold:pose -- NEW_POSE_ID`
2. Completa la entrada en `src/data/poseLibrary.ts`
3. Asigna tags, descripcion, duracion y bones
4. Pruebala en `/dev/pose-library`

## Agregar una sena o frase

1. Ejecuta `npm run scaffold:sign -- NEW_SIGN_ID`
2. Ajusta `src/data/signs.json`
3. Si necesitas phrase match exacto, agrega entrada en `src/data/phrases.json`
4. Verifica el fallback en `src/data/alphabet.json`
5. Prueba en la landing o en `/dev/pose-library`

## Capturar una pose desde 3 videos

La herramienta interna espera tres videos de la misma pose o micro-secuencia:

- `front`
- `threeQuarter`
- `side`

### Flujo

1. Ve a `/dev/pose-capture`
2. Sube los 3 videos
3. Ejecuta `Procesar videos`
4. Revisa keyframes `start`, `middle`, `end`
5. Inspecciona la `candidate pose`
6. Asigna `id`, tags y notas
7. Guarda en staging

El resultado se escribe en:

- `src/data/poseStaging/<POSE_ID>.json`

### Import script

Tambien puedes importar un candidate file ya generado:

```bash
npm run import:pose-from-video -- path/to/candidate-pose.json
```

## Promover una pose desde staging

Ruta sugerida hoy:

1. Captura o importa la pose a `src/data/poseStaging/`
2. Revisa `normalizedLandmarks` y `suggestedPoseDescriptor`
3. Ajusta manualmente el descriptor final para evitar aplicar landmarks crudos
4. Crea o actualiza la entrada estable en `src/data/poseLibrary.ts`
5. Conecta la pose a `signs.json`, `phrases.json` o reglas semanticas
6. Valida en `/dev/pose-library` y en la landing

## Legacy y frontera actual

El runtime principal ya no depende de:

- `src/hooks/useCamera.ts`
- `src/hooks/useAvatarTracking.ts`
- `src/lib/tracking/*`
- `src/components/CameraPanel.tsx`
- `src/components/ControlPanel.tsx`
- `src/components/DebugOverlay.tsx`
- `src/components/MetricsPanel.tsx`
- `src/components/LogPanel.tsx`
- `src/components/AppShell.tsx`
- `src/components/ClientOnlyAppShell.tsx`

El paquete `@vladmandic/human` se conserva solo para el flujo interno de authoring y no para el producto principal.

## Placeholders actuales

- Las poses y micro-secuencias siguen siendo placeholders funcionales de demo.
- El fallback de fingerspelling usa una libreria inicial procedural.
- La captura desde video no promete motion capture perfecto ni traduccion final validada de LSC.
- La pose candidata requiere revision antes de entrar a produccion.

## Fase siguiente sugerida

- Libreria validada de senas con revision experta de LSC
- Mayor cobertura de frases y dominios
- Clips reales o blend trees por sena
- Mejor normalizacion entre distintos avatares VRM
- Herramienta de promocion desde staging a pose library estable
- Non-manual markers y expresividad facial

## Scripts utiles

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run scaffold:sign -- NEW_SIGN_ID`
- `npm run scaffold:pose -- NEW_POSE_ID`
- `npm run import:pose-from-video -- path/to/candidate-pose.json`

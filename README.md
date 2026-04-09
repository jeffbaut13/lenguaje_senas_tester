# Contexto LSC Demo

Demo funcional de accesibilidad para sitios web con captura contextual del DOM, planificación semántica local y reproducción visual en un avatar VRM flotante.

## Qué cambió

Este repositorio ya no está orientado a webcam, pose tracking humano ni MediaPipe como flujo principal. La experiencia principal ahora sigue esta cadena:

`DOM/texto -> semanticPlan -> signPlan -> playPlan -> avatar`

La demo abre sin pedir permisos del navegador y responde a `hover`, `focus` o `click` sobre títulos, párrafos cortos, chips y CTAs relevantes.

## Arquitectura

### 1. DOM capture layer

- `src/lib/dom/findSemanticContainer.ts`
- `src/lib/dom/extractSemanticTextFromElement.ts`

Reconstruye texto aunque esté fragmentado en spans o nodos inline y sube al contenedor semántico más útil.

### 2. Normalization layer

- `src/lib/translation/normalizeText.ts`

Normaliza espacios, minúsculas y diacríticos para matching robusto sin tocar el texto visible.

### 3. Semantic layer

- `src/lib/translation/translateTextToSemanticPlan.ts`
- `src/lib/translation/classifyIntent.ts`
- `src/lib/translation/extractEntities.ts`

Produce `semanticPlan` con `sourceText`, `normalizedText`, `domain`, `intent`, `entities`, `confidence` y notas.

### 4. Sign planning layer

- `src/lib/sign-engine/resolvePhrasePlan.ts`
- `src/lib/sign-engine/resolveTokenPlan.ts`
- `src/lib/sign-engine/buildSignPlanFromSemanticPlan.ts`

Prioriza:

1. frase conocida
2. match por intención
3. tokens útiles
4. fallback de fingerspelling

### 5. Playback layer

- `src/lib/sign-engine/buildPlayPlan.ts`
- `src/lib/playback/AvatarPlaybackController.ts`

Convierte el `signPlan` a una cola con pasos `pose`, `transition`, `pause` y `fingerspell`, soportando reemplazo limpio de reproducción.

### 6. Avatar execution layer

- `src/components/avatar/AvatarCanvas.tsx`
- `src/lib/playback/poseResolver.ts`
- `src/lib/vrm/*`

Reutiliza la carga VRM y el rig del laboratorio anterior. La reproducción actual es procedural y placeholder, con `AnimationMixer` ya montado para futuras capas de clips reales.

## Landing y páginas

- `/`
  Landing demo original, desktop-first, inspirada en composición editorial premium con tonos gris claro, crema y acento naranja cálido.
- `/dev/pose-library`
  Página interna para revisar poses, probar texto libre y ver `semanticPlan`, `signPlan` y `playPlan`.

## Controles de la demo

El widget flotante permite:

- abrir/cerrar overlay
- `play`, `stop`, `reset`
- cambiar velocidad
- alternar trigger mode entre `hover`, `focus` y `click`
- abrir panel de debug

## Datos y crecimiento

Archivos base:

- `src/data/signs.json`
- `src/data/phrases.json`
- `src/data/alphabet.json`
- `src/data/transitions.json`
- `src/data/poseLibrary.ts`

Cada entrada puede declarar ids, tags, dominio, duración, pose base, transiciones y metadata.

### Agregar una pose

1. Ejecuta `npm run scaffold:pose -- NEW_POSE_ID`
2. Abre `src/data/poseLibrary.ts`
3. Completa el snippet generado con huesos, tags y descripción
4. Prueba la pose en `/dev/pose-library`

### Agregar una seña

1. Ejecuta `npm run scaffold:sign -- NEW_SIGN_ID`
2. Ajusta la nueva entrada en `src/data/signs.json`
3. Si requiere frase exacta, añade un match en `src/data/phrases.json`
4. Si necesita deletreo, verifica `src/data/alphabet.json`
5. Prueba el resultado en la landing o en `/dev/pose-library`

### Agregar una frase

1. Crea un nuevo objeto en `src/data/phrases.json`
2. Define `normalized`, `signIds`, `intent`, `domain` y `tags`
3. Verifica que los `signIds` existan en `src/data/signs.json`

## Qué es placeholder hoy

- Las poses y secuencias iniciales son placeholders funcionales de demo.
- El fallback de fingerspelling usa poses placeholder por letra.
- No se afirma que las señas actuales sean una traducción final validada por expertos LSC.

## Fase 2 sugerida

- biblioteca validada de señas LSC con revisión experta
- clips reales y/o blend trees por seña
- adaptador externo para LLM o motor semántico más rico
- sincronía facial y non-manual markers
- analítica persistida y authoring UI para curación de contenido

## Legacy

El flujo anterior de tracking humano quedó aislado conceptualmente en `src/legacy/README.md`. Lo reutilizable para la nueva demo fue el stack VRM/Three.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run scaffold:sign -- NEW_SIGN_ID`
- `npm run scaffold:pose -- NEW_POSE_ID`

# Decisiones Técnicas

## Cliente puro para visión por computador

Toda la inferencia ocurre en navegador. No se usan route handlers ni Node.js para tracking en vivo. La página principal monta un shell client-only para evitar errores de SSR con webcam, Three.js y Human.

## Render y detección desacoplados

- El render del avatar corre con `requestAnimationFrame`.
- La detección usa un loop separado en `src/lib/human/humanLoop.ts`.
- Esto mejora fluidez percibida y evita bloquear el canvas 3D cada vez que una inferencia tarda más.

## Estrategia anti-jitter

Se combinan:

- confidence gating
- dead zones
- smoothing temporal y slerp
- hold-last-stable-pose
- decay a rest pose
- clamps anatómicos razonables

La prioridad es mover menos huesos, pero moverlos con más estabilidad.

## Retargeting

No se copian coordenadas crudas al esqueleto. El pipeline transforma landmarks en vectores y bases estables, luego en quaternions locales relativos al rig normalizado del VRM. Euler se usa solo para clamping, no como representación principal.

## Worker preparado

La primera fase deja `src/workers/human.worker.ts` y la separación modular lista para migrar la inferencia a worker cuando ya esté validada la base de tracking y retargeting.

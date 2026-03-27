# VRM Human Tracking Lab

Aplicación en Next.js para capturar pose humana desde webcam en cliente, detectar cuerpo con `@vladmandic/human` y transferir torso, cabeza y brazos a un avatar `.vrm` usando `three` + `@pixiv/three-vrm`.

## Qué hace

- Pide permiso de cámara desde el navegador.
- Muestra preview de video con overlay de landmarks 2D.
- Carga un avatar VRM desde `public/avatar/avatar.vrm`.
- Ejecuta inferencia solo del lado cliente.
- Separa render loop y detection loop para sostener fluidez.
- Aplica smoothing, confidence gating, hold-last-stable-pose, dead zones y decay a rest pose.
- Prioriza estabilidad de torso, cabeza y brazos sobre cobertura total del cuerpo.

## Instalar

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Cómo poner el avatar

1. Copia tu archivo VRM en `public/avatar/avatar.vrm`.
2. Si quieres cambiar la ruta central, edita `src/lib/config/appConfig.ts`.

## Limitaciones actuales

- Fase 1 prioriza torso, cabeza, hombros y brazos.
- Dedos, expresiones, mirada y lip sync quedan preparados para una siguiente iteración.
- `Human` todavía corre en main thread, aunque el proyecto ya separa configuración, cliente y loop para moverlo a worker.
- La estabilidad depende mucho de iluminación, contraste y visibilidad clara de hombros, codos y muñecas.

## Próximos pasos sugeridos

- Migrar inferencia a worker con `ImageBitmap` u `OffscreenCanvas`.
- Añadir calibración inicial por usuario/avatar.
- Integrar manos y face tracking cuando el torso ya esté estabilizado en tu hardware.

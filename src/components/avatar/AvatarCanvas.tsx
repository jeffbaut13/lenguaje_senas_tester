"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import { AnimationMixer, Group, Quaternion } from "three";
import { DEMO_CONFIG } from "@/lib/config/demoConfig";
import { resolvePoseRotationsWithOverride } from "@/lib/playback/poseResolver";
import { collectVrmFingerDiagnostics } from "@/lib/vrm/diagnostics";
import { loadVRM } from "@/lib/vrm/loadVRM";
import { buildVRMRig, type VRMRig } from "@/lib/vrm/vrmRig";

function AvatarModel({
  poseId,
  poseOverride,
  onReady,
}: {
  poseId: string;
  poseOverride?: Record<string, [number, number, number]>;
  onReady?: (loaded: boolean) => void;
}) {
  const { scene } = useThree();
  const rootRef = useRef<Group | null>(null);
  const rigRef = useRef<VRMRig | null>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const targetRotations = useMemo(() => resolvePoseRotationsWithOverride(poseId, poseOverride), [poseId, poseOverride]);
  const neutralCache = useRef<Map<VRMHumanBoneName, Quaternion>>(new Map());
  const [status, setStatus] = useState("Cargando avatar");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const mount = async () => {
      try {
        setStatus("Cargando avatar");
        const { root, vrm } = await loadVRM(DEMO_CONFIG.avatar.path);
        if (cancelled) {
          return;
        }

        root.position.y = 0;
        scene.add(root);
        rootRef.current = root;
        rigRef.current = buildVRMRig(vrm);
        mixerRef.current = new AnimationMixer(vrm.scene);
        const fingerDiagnostics = collectVrmFingerDiagnostics(vrm);
        if (typeof window !== "undefined") {
          window.console.info("VRM finger diagnostics", fingerDiagnostics);
        }
        rigRef.current.restPose.forEach((rotation, boneName) => {
          neutralCache.current.set(boneName as VRMHumanBoneName, rotation.clone());
        });
        setStatus("Avatar listo");
        setLoaded(true);
        onReady?.(true);
      } catch {
        setStatus("No se pudo cargar el VRM");
        setLoaded(false);
        onReady?.(false);
      }
    };

    void mount();

    return () => {
      cancelled = true;
      if (rootRef.current) {
        scene.remove(rootRef.current);
      }
    };
  }, [onReady, scene]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

    const rig = rigRef.current;
    if (!rig) {
      return;
    }

    neutralCache.current.forEach((neutralRotation, boneName) => {
      const node = rig.vrm.humanoid.getNormalizedBoneNode(boneName);
      if (!node) {
        return;
      }

      const targetRotation = targetRotations.get(boneName) ?? neutralRotation;
      node.quaternion.slerp(targetRotation, Math.min(1, delta * 8));
    });

    rig.vrm.humanoid.update();
    rig.vrm.update(delta);
  });

  if (!loaded) {
    return (
      <Html center>
        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,249,240,0.96)] px-4 py-3 text-sm text-[var(--muted)]">{status}</div>
      </Html>
    );
  }

  return null;
}

export function AvatarCanvas({
  poseId,
  poseOverride,
  className = "",
  variant = "default",
}: {
  poseId: string;
  poseOverride?: Record<string, [number, number, number]>;
  className?: string;
  variant?: "default" | "compact";
}) {
  const [ready, setReady] = useState(false);
  const isCompact = variant === "compact";
  const cameraPosition: [number, number, number] = isCompact ? [0, 1.16, 2.24] : [0, 1.28, DEMO_CONFIG.avatar.initialDistance];
  const cameraTarget: [number, number, number] = isCompact ? [0, 0.96, 0] : [0, 1.12, 0];

  return (
    <div className={className}>
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <color attach="background" args={isCompact ? ["#fff7ef"] : ["#efe7df"]} />
        <fog attach="fog" args={isCompact ? ["#fff7ef", 2.8, 6.2] : ["#efe7df", 3.4, 7]} />
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={isCompact ? 24 : 28} position={cameraPosition} />
         {/*  {isCompact ? null : (
            <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.2} maxPolarAngle={1.8} target={cameraTarget} />
          )} */}
         
            <OrbitControls  minPolarAngle={1.2} maxPolarAngle={1.8} target={cameraTarget} />
         
          <ambientLight intensity={1.25} color="#fffaf3" />
          <hemisphereLight args={["#fff9f3", "#d8bfa0", 1.1]} />
          <directionalLight position={[2.6, 3.8, 3]} intensity={1.5} color="#fffefb" />
          <directionalLight position={[-2.8, 2.2, 2]} intensity={0.72} color="#f2d4bb" />
          {!isCompact ? (
            <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[1.4, 48]} />
              <meshStandardMaterial color="#eadfce" />
            </mesh>
          ) : null}
          <AvatarModel poseId={poseId} poseOverride={poseOverride} onReady={setReady} />
        </Suspense>
      </Canvas>
      {!ready || isCompact ? null : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          VRM playback procedural
        </div>
      )}
    </div>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { VRMHumanBoneName } from "@pixiv/three-vrm";
import { AnimationMixer, Group, Quaternion } from "three";
import { DEMO_CONFIG } from "@/lib/config/demoConfig";
import { resolvePoseRotations } from "@/lib/playback/poseResolver";
import { loadVRM } from "@/lib/vrm/loadVRM";
import { buildVRMRig, type VRMRig } from "@/lib/vrm/vrmRig";

function AvatarModel({
  poseId,
  onReady,
}: {
  poseId: string;
  onReady?: (loaded: boolean) => void;
}) {
  const { scene } = useThree();
  const rootRef = useRef<Group | null>(null);
  const rigRef = useRef<VRMRig | null>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const targetRotations = useMemo(() => resolvePoseRotations(poseId), [poseId]);
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
        <div className="rounded-2xl border border-[var(--border)] bg-[rgba(248,251,255,0.94)] px-4 py-3 text-sm text-[var(--muted)]">
          {status}
        </div>
      </Html>
    );
  }

  return null;
}

export function AvatarCanvas({
  poseId,
  className = "",
}: {
  poseId: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className={className}>
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <color attach="background" args={["#e9f2fb"]} />
        <fog attach="fog" args={["#e9f2fb", 3.4, 7]} />
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={28} position={[0, 1.28, DEMO_CONFIG.avatar.initialDistance]} />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.2} maxPolarAngle={1.8} target={[0, 1.12, 0]} />
          <ambientLight intensity={1.3} color="#f6fbff" />
          <hemisphereLight args={["#ffffff", "#7a9ac0", 1.2]} />
          <directionalLight position={[2.6, 3.8, 3]} intensity={1.7} color="#ffffff" />
          <directionalLight position={[-2.8, 2.2, 2]} intensity={0.9} color="#c9e0ff" />
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[1.4, 48]} />
            <meshStandardMaterial color="#dce8f5" />
          </mesh>
          <AvatarModel poseId={poseId} onReady={setReady} />
        </Suspense>
      </Canvas>
      {!ready ? null : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          VRM playback procedural
        </div>
      )}
    </div>
  );
}

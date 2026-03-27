"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  SkeletonHelper,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { APP_CONFIG } from "@/lib/config/appConfig";
import { loadVRM } from "@/lib/vrm/loadVRM";
import { buildVRMRig, type VRMRig } from "@/lib/vrm/vrmRig";
import { retargetPoseFrameToVRM } from "@/lib/vrm/retarget";
import { FpsCounter } from "@/lib/utils/fps";
import {
  TRACKING_BONE_CONNECTIONS,
  type PoseFrame,
  type TrackingControlsState,
  type TrackingJointName,
} from "@/lib/tracking/trackerTypes";

interface AvatarRuntimeRefs {
  rigRef: React.RefObject<VRMRig | null>;
  displayFrameRef: React.RefObject<PoseFrame | null>;
  targetFrameRef: React.RefObject<PoseFrame | null>;
  controlsRef: React.RefObject<TrackingControlsState>;
  lastReliableAtRef: React.RefObject<number>;
  boneSmoothingRef: React.RefObject<{
    update: (boneName: string, target: { quaternion: Quaternion; updatedAt: number; confidence: number; source: string }, deltaSeconds: number, strength: number, deadZoneRadians: number) => Quaternion;
    holdLastStable: (boneName: string) => Quaternion;
    decayToRest: (boneName: string, restQuaternion: Quaternion, amount: number) => Quaternion;
  }>;
  hipsSmoothingRef: React.RefObject<{
    update: (next: Vector3, alpha: number) => Vector3;
  }>;
}

interface AvatarCanvasProps {
  avatarPath: string;
  loadVersion: number;
  avatarLoaded: boolean;
  status: string;
  showDebugSkeleton: boolean;
  runtimeRefs: AvatarRuntimeRefs;
  onAvatarLoaded: (rig: VRMRig) => void;
  onAvatarError: (error: unknown) => void;
  onRenderFps: (fps: number) => void;
}

function RuntimeRetargeter({
  runtimeRefs,
  onRenderFps,
}: {
  runtimeRefs: AvatarRuntimeRefs;
  onRenderFps: (fps: number) => void;
}) {
  const fpsCounterRef = useRef(new FpsCounter(APP_CONFIG.tracking.renderFpsSmoothing));
  const lastDebugLogAtRef = useRef(0);

  useFrame((_, deltaSeconds) => {
    const fps = fpsCounterRef.current.tick();
    onRenderFps(fps);

    const rig = runtimeRefs.rigRef.current;
    const controls = runtimeRefs.controlsRef.current;
    if (!rig) {
      return;
    }

    if (controls.showDebugSkeleton && performance.now() - lastDebugLogAtRef.current > 1000) {
      lastDebugLogAtRef.current = performance.now();
      console.log("[debug-retarget]", {
        avatarVisible: rig.vrm.scene.visible,
        trackedFrame: !!runtimeRefs.targetFrameRef.current,
        confidenceThreshold: controls.confidenceThreshold,
      });
    }

    const retargetFrame = retargetPoseFrameToVRM(runtimeRefs.targetFrameRef.current, rig, controls.confidenceThreshold);
    const lostForMs = performance.now() - runtimeRefs.lastReliableAtRef.current;

    rig.bones.forEach((bone, boneName) => {
      const restQuaternion = rig.restPose.get(boneName) ?? bone.restLocalRotation;
      const target = retargetFrame.boneTargets[boneName];

      if (target && controls.smoothingEnabled) {
        bone.node.quaternion.copy(
          runtimeRefs.boneSmoothingRef.current.update(
            boneName,
            target,
            deltaSeconds,
            controls.smoothingGlobal * 10,
            APP_CONFIG.tracking.deadZoneRadians,
          ),
        );
      } else if (target) {
        bone.node.quaternion.copy(target.quaternion);
      } else if (lostForMs <= APP_CONFIG.tracking.lostTrackingGraceMs) {
        bone.node.quaternion.copy(runtimeRefs.boneSmoothingRef.current.holdLastStable(boneName));
      } else {
        const decay = Math.min(1, deltaSeconds * APP_CONFIG.tracking.restDecayPerSecond);
        bone.node.quaternion.copy(runtimeRefs.boneSmoothingRef.current.decayToRest(boneName, restQuaternion, decay));
      }
    });

    const hipsNode = rig.vrm.humanoid.getNormalizedBoneNode("hips");
    if (hipsNode) {
      const smoothedOffset = runtimeRefs.hipsSmoothingRef.current.update(
        retargetFrame.hipsPositionOffset,
        controls.smoothingEnabled ? controls.rotationDamping : 1,
      );
      hipsNode.position.x = smoothedOffset.x;
      hipsNode.position.y = smoothedOffset.y;
    }

    rig.vrm.humanoid.update();
    rig.vrm.update(deltaSeconds);
  });

  return null;
}

const TRACKED_DEBUG_JOINTS: TrackingJointName[] = [
  "nose",
  "leftEye",
  "rightEye",
  "leftEar",
  "rightEar",
  "leftShoulder",
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist",
  "leftHip",
  "rightHip",
];

function LandmarkDebugSkeleton({
  runtimeRefs,
  visible,
}: {
  runtimeRefs: AvatarRuntimeRefs;
  visible: boolean;
}) {
  const debugRootRef = useRef<Group | null>(null);
  const jointRefs = useRef<Record<string, Mesh | null>>({});
  const lineRefs = useRef<Record<string, Line | null>>({});
  const lastDebugLogAtRef = useRef(0);

  useFrame(() => {
    const frame = runtimeRefs.displayFrameRef.current;
    const controls = runtimeRefs.controlsRef.current;

    if (debugRootRef.current) {
      debugRootRef.current.visible = visible && controls.showDebugSkeleton;
    }

    if (!visible || !controls.showDebugSkeleton) {
      return;
    }

    let visibleJointCount = 0;

    TRACKED_DEBUG_JOINTS.forEach((jointName) => {
      const mesh = jointRefs.current[jointName];
      if (!mesh) {
        return;
      }

      const joint = frame?.joints[jointName];
      const shouldShow = !!joint && joint.confidence >= 0.18;
      mesh.visible = shouldShow;

      if (shouldShow && joint) {
        visibleJointCount += 1;
        mesh.position.set(joint.position.x, joint.position.y, joint.position.z);
      }
    });

    let visibleLineCount = 0;
    TRACKING_BONE_CONNECTIONS.forEach(([from, to]) => {
      const line = lineRefs.current[`${from}-${to}`];
      if (!line) {
        return;
      }

      const start = frame?.joints[from];
      const end = frame?.joints[to];
      const shouldShow = !!start && !!end && start.confidence >= 0.18 && end.confidence >= 0.18;
      line.visible = shouldShow;

      if (!shouldShow || !start || !end) {
        return;
      }

      visibleLineCount += 1;

      const positions = line.geometry.getAttribute("position");
      if (!(positions instanceof Float32BufferAttribute)) {
        return;
      }

      positions.setXYZ(0, start.position.x, start.position.y, start.position.z);
      positions.setXYZ(1, end.position.x, end.position.y, end.position.z);
      positions.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    });

    if (performance.now() - lastDebugLogAtRef.current > 1000) {
      lastDebugLogAtRef.current = performance.now();
      console.log("[debug-landmark-skeleton]", {
        framePresent: !!frame,
        rootVisible: debugRootRef.current?.visible ?? false,
        rootPosition: debugRootRef.current?.position.toArray() ?? null,
        rootScale: debugRootRef.current?.scale.toArray() ?? null,
        visibleJointCount,
        visibleLineCount,
        sampleNose: frame?.joints.nose
          ? {
              pos: frame.joints.nose.position.toArray(),
              confidence: frame.joints.nose.confidence,
            }
          : null,
        sampleLeftShoulder: frame?.joints.leftShoulder
          ? {
              pos: frame.joints.leftShoulder.position.toArray(),
              confidence: frame.joints.leftShoulder.confidence,
            }
          : null,
      });
    }
  });

  return (
    <group ref={debugRootRef} position={[1.2, 0.85, 0]} scale={[1.6, 1.6, 1.6]}>
      {TRACKED_DEBUG_JOINTS.map((jointName) => (
        <mesh
          key={jointName}
          visible={false}
          ref={(node) => {
            jointRefs.current[jointName] = node;
          }}
        >
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#ff5f5f" />
        </mesh>
      ))}
      {TRACKING_BONE_CONNECTIONS.map(([from, to]) => (
        <primitive
          key={`${from}-${to}`}
          object={
            new Line(
              new BufferGeometry().setAttribute("position", new Float32BufferAttribute(new Float32Array(6), 3)),
              new LineBasicMaterial({ color: "#ff5f5f", transparent: true, opacity: 0.95 }),
            )
          }
          ref={(node: Line | null) => {
            lineRefs.current[`${from}-${to}`] = node;
          }}
        />
      ))}
      <Html position={[0, 1.3, 0]} center>
        <div className="rounded-lg border border-red-300/40 bg-[#081722]/85 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-200">
          tracking skeleton
        </div>
      </Html>
    </group>
  );
}

function VRMAvatarScene({
  avatarPath,
  loadVersion,
  showDebugSkeleton,
  runtimeRefs,
  onAvatarLoaded,
  onAvatarError,
  onRenderFps,
  status,
}: AvatarCanvasProps) {
  const { scene } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const avatarRootRef = useRef<Group | null>(null);
  const helperRef = useRef<SkeletonHelper | null>(null);

  useEffect(() => {
    if (helperRef.current) {
      helperRef.current.visible = showDebugSkeleton;
    }
  }, [showDebugSkeleton]);

  useEffect(() => {
    if (loadVersion === 0) {
      return;
    }

    let cancelled = false;

    const mountAvatar = async () => {
      try {
        if (avatarRootRef.current) {
          scene.remove(avatarRootRef.current);
          avatarRootRef.current = null;
        }

        if (helperRef.current) {
          scene.remove(helperRef.current);
          helperRef.current = null;
        }

        const { root, vrm } = await loadVRM(avatarPath);
        if (cancelled) {
          return;
        }

        scene.add(root);
        avatarRootRef.current = root;

        const rig = buildVRMRig(vrm);
        runtimeRefs.rigRef.current = rig;

        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }

        const helper = new SkeletonHelper(root);
        helper.visible = showDebugSkeleton;
        scene.add(helper);
        helperRef.current = helper;

        onAvatarLoaded(rig);
      } catch (error) {
        onAvatarError(error);
      }
    };

    void mountAvatar();

    return () => {
      cancelled = true;
    };
  }, [avatarPath, loadVersion, onAvatarError, onAvatarLoaded, scene, showDebugSkeleton]);

  useEffect(
    () => () => {
      if (avatarRootRef.current) {
        scene.remove(avatarRootRef.current);
      }
      if (helperRef.current) {
        scene.remove(helperRef.current);
      }
    },
    [scene],
  );

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 1.45, APP_CONFIG.avatar.initialDistance]} />
      <OrbitControls
        ref={controlsRef}
        //enablePan={false}
        //minDistance={0.8}
        //maxDistance={4}
        target={[0, 0, 0]}
      />
      <ambientLight intensity={0.6} color="#34566f" />
      <hemisphereLight args={["#9cd6ff", "#08131d", 1.3]} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, 2.2, 2]} intensity={0.7} color="#6fe8ff" />
      <Grid
        position={[0, 0, 0]}
        args={[6, 6]}
        cellColor="#0d2231"
        sectionColor="#1d5365"
        fadeDistance={18}
        cellThickness={0.8}
        sectionThickness={1.2}
      />
      <LandmarkDebugSkeleton runtimeRefs={runtimeRefs} visible={showDebugSkeleton} />
      <RuntimeRetargeter runtimeRefs={runtimeRefs} onRenderFps={onRenderFps} />
      {!avatarRootRef.current ? (
        <Html center>
          <div className="rounded-2xl border border-white/10 bg-[#081722]/90 px-4 py-3 text-sm text-[var(--muted)]">
            {loadVersion === 0 ? "Pulsa Load avatar para montar el VRM." : `Estado: ${status}`}
          </div>
        </Html>
      ) : null}
    </>
  );
}

export function AvatarCanvas(props: AvatarCanvasProps) {
  return (
    <section className="panel overflow-hidden rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="panel-label">Avatar Output</p>
          <h2 className="panel-title">Escena VRM estabilizada</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
            {props.avatarLoaded ? "avatar ready" : "avatar pending"}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">{props.status}</span>
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black/50">
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#040b10"]} />
          <Suspense fallback={null}>
            <VRMAvatarScene {...props} />
          </Suspense>
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-[var(--muted)]">
          R3F + Drei para carga, framing y navegacion del avatar con una arquitectura mas estable.
        </div>
      </div>
    </section>
  );
}

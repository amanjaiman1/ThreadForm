"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useProgress } from "@react-three/drei";
import * as THREE from "three";
import {
  materials,
  views,
  type MaterialId,
  type ModelId,
} from "./garments";
import { buildGarmentGeometry } from "./garment-geometry";
import { useViewerStore } from "./viewer-store";

const MIN_DIST = 3.6;
const MAX_DIST = 11;

/* ------------------------------- Garment ---------------------------------- */

function GarmentMesh({
  model,
  material,
  color,
}: {
  model: ModelId;
  material: MaterialId;
  color: string;
}) {
  const { geom, frontZ, topY } = useMemo(
    () => buildGarmentGeometry(model),
    [model]
  );
  const matCfg = useMemo(
    () => materials.find((m) => m.id === material) ?? materials[0],
    [material]
  );

  useEffect(() => () => geom.dispose(), [geom]);

  return (
    <group>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={matCfg.roughness}
          metalness={matCfg.metalness}
          envMapIntensity={0.6 + matCfg.sheen}
          flatShading={false}
        />
      </mesh>

      {/* Hoodie extras: hood rim, hood bowl, kangaroo pocket, drawstrings */}
      {model === "hoodie" && (
        <group>
          <mesh position={[0, topY - 0.08, frontZ - 0.18]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
            <torusGeometry args={[0.62, 0.12, 14, 32, Math.PI * 1.3]} />
            <meshStandardMaterial color={color} roughness={matCfg.roughness} metalness={matCfg.metalness} />
          </mesh>
          <mesh position={[0, topY - 0.02, -0.22]} rotation={[-0.5, 0, 0]} castShadow>
            <sphereGeometry args={[0.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
            <meshStandardMaterial color={color} roughness={matCfg.roughness} metalness={matCfg.metalness} side={THREE.DoubleSide} />
          </mesh>
          {/* kangaroo pocket */}
          <mesh position={[0, -0.95, frontZ - 0.005]}>
            <boxGeometry args={[1.05, 0.62, 0.05]} />
            <meshStandardMaterial color={color} roughness={matCfg.roughness} metalness={matCfg.metalness} />
          </mesh>
          {/* drawstrings */}
          {[-0.18, 0.18].map((x) => (
            <mesh key={x} position={[x, topY - 0.55, frontZ - 0.02]}>
              <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
              <meshStandardMaterial color="#F2F2F4" roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

/* --------------------------- Camera controller ---------------------------- */

function CameraController() {
  const view = useViewerStore((s) => s.view);
  const resetNonce = useViewerStore((s) => s.resetNonce);
  const zoomNonce = useViewerStore((s) => s.zoomNonce);
  const zoomDir = useViewerStore((s) => s.zoomDir);

  const { camera, invalidate } = useThree();
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & { target: THREE.Vector3; enabled: boolean; update: () => void })
    | null;

  const targetPos = useRef(new THREE.Vector3(0, 0, 6.4));
  const animating = useRef(false);

  // animate to a view preset (on view change or reset)
  useEffect(() => {
    const preset = views.find((v) => v.id === view) ?? views[0];
    targetPos.current.set(...preset.position);
    animating.current = true;
    if (controls) controls.enabled = false;
    invalidate();
  }, [view, resetNonce, controls, invalidate]);

  // instant dolly on zoom command
  useEffect(() => {
    if (zoomNonce === 0) return;
    const target = controls?.target ?? new THREE.Vector3();
    const dir = camera.position.clone().sub(target);
    const dist = dir.length();
    const next = THREE.MathUtils.clamp(
      dist * (zoomDir === "in" ? 0.82 : 1.22),
      MIN_DIST,
      MAX_DIST
    );
    dir.setLength(next);
    camera.position.copy(target).add(dir);
    controls?.update();
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomNonce]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(targetPos.current, 0.14);
    camera.lookAt(0, 0, 0);
    if (controls) controls.target.set(0, 0, 0);
    if (camera.position.distanceTo(targetPos.current) < 0.03) {
      camera.position.copy(targetPos.current);
      animating.current = false;
      if (controls) {
        controls.enabled = true;
        controls.update();
      }
    } else {
      invalidate();
    }
  });

  return null;
}

/* --------------------------- Loading indicator ---------------------------- */

function ProgressOverlay() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <Html center>
      <div className="flex w-40 flex-col items-center gap-2">
        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-white/20">
          <div
            className="h-full rounded-pill bg-volt-500 transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-white/80">
          Loading garment… {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

function ReadySignal() {
  const setLoading = useViewerStore((s) => s.setLoading);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 120);
    return () => clearTimeout(t);
  }, [setLoading]);
  return null;
}

/* ------------------------------- Canvas ----------------------------------- */

export default function GarmentScene() {
  const model = useViewerStore((s) => s.model);
  const material = useViewerStore((s) => s.material);
  const color = useViewerStore((s) => s.color);

  return (
    <Canvas
      // demand rendering: only renders on interaction / invalidate → battery-friendly
      frameloop="demand"
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "none" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={1.45} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -4]} intensity={0.55} color="#6C3CE9" />
      <pointLight position={[0, -2, 4]} intensity={0.35} color="#A6F000" />

      {/* Suspense boundary is ready for compressed GLTF (Draco/meshopt) loads. */}
      <ProgressOverlay />
      <GarmentMesh model={model} material={material} color={color} />
      <ReadySignal />

      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.4}
        scale={9}
        blur={2.8}
        far={3.2}
        resolution={256}
        color="#2A1170"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        enableDamping={false}
        minDistance={MIN_DIST}
        maxDistance={MAX_DIST}
        minPolarAngle={Math.PI / 2 - 0.7}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
      <CameraController />
    </Canvas>
  );
}

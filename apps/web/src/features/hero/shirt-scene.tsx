"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { apparelDesigns } from "./designs";

/* Build a stylized t-shirt silhouette as an extruded 3D mesh. */
function useShirtGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    // start at left neck, go clockwise around the silhouette
    s.moveTo(-0.5, 1.5);
    s.lineTo(-1.0, 1.46);
    s.lineTo(-1.72, 0.96);
    s.lineTo(-1.46, 0.5);
    s.lineTo(-0.86, 0.82);
    s.lineTo(-0.96, -1.62);
    s.lineTo(0.96, -1.62);
    s.lineTo(0.86, 0.82);
    s.lineTo(1.46, 0.5);
    s.lineTo(1.72, 0.96);
    s.lineTo(1.0, 1.46);
    s.lineTo(0.5, 1.5);
    // neckline scoop
    s.quadraticCurveTo(0, 1.12, -0.5, 1.5);

    const geom = new THREE.ExtrudeGeometry(s, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 4,
      curveSegments: 36,
    });
    geom.center();
    geom.computeBoundingBox();
    const frontZ = geom.boundingBox!.max.z;
    return { geom, frontZ };
  }, []);
}

function DesignDecal({
  index,
  frontZ,
}: {
  index: number;
  frontZ: number;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const popRef = useRef(1);

  const { texture, canvas, ctx } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { texture, canvas, ctx };
  }, []);

  // redraw artwork whenever the active design changes + trigger pop animation
  useEffect(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    apparelDesigns[index % apparelDesigns.length].draw(
      ctx,
      canvas.width,
      canvas.height
    );
    texture.needsUpdate = true;
    popRef.current = 0; // restart pop
    if (matRef.current) matRef.current.opacity = 0;
  }, [index, ctx, canvas, texture]);

  useFrame((_, delta) => {
    popRef.current = Math.min(1, popRef.current + delta * 3.2);
    const p = popRef.current;
    const eased = 1 - Math.pow(1 - p, 3);
    if (groupRef.current) {
      const scale = 0.94 + eased * 0.06;
      groupRef.current.scale.set(scale, scale, 1);
    }
    if (matRef.current) matRef.current.opacity = eased;
  });

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group ref={groupRef} position={[0, 0.08, frontZ + 0.02]}>
      <mesh>
        <planeGeometry args={[1.42, 1.78]} />
        <meshBasicMaterial
          ref={matRef}
          map={texture}
          transparent
          toneMapped={false}
          depthWrite={false}
          opacity={0}
        />
      </mesh>
    </group>
  );
}

function Shirt({ index }: { index: number }) {
  const { geom, frontZ } = useShirtGeometry();
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const target = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const hex = apparelDesigns[index % apparelDesigns.length].garment;
    target.set(hex);
    if (matRef.current) matRef.current.color.lerp(target, 0.08);
  });

  return (
    <group rotation={[0, 0, 0]}>
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial
          ref={matRef}
          color="#1A1A1A"
          roughness={0.82}
          metalness={0.04}
        />
      </mesh>
      {/* stitched collar accent */}
      <mesh position={[0, 1.32, frontZ - 0.02]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.42, 0.04, 12, 40, Math.PI]} />
        <meshStandardMaterial color="#A6F000" roughness={0.5} />
      </mesh>
      <DesignDecal index={index} frontZ={frontZ} />
    </group>
  );
}

export default function ShirtScene({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % apparelDesigns.length),
      3400
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#6C3CE9" />
      <pointLight position={[0, -2, 4]} intensity={0.4} color="#A6F000" />

      <Float
        speed={reducedMotion ? 0 : 1.4}
        rotationIntensity={reducedMotion ? 0 : 0.35}
        floatIntensity={reducedMotion ? 0 : 0.6}
      >
        <Shirt index={index} />
      </Float>

      <ContactShadows
        position={[0, -1.95, 0]}
        opacity={0.35}
        scale={8}
        blur={2.6}
        far={3}
        resolution={256}
        color="#2A1170"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={1.4}
        enableDamping
        minPolarAngle={Math.PI / 2 - 0.32}
        maxPolarAngle={Math.PI / 2 + 0.28}
      />
    </Canvas>
  );
}

"use client";

/**
 * HeroCanvas — lightweight 3D fallback for the landing hero.
 *
 * Used when /images/hero-vehicle.png is missing or fails to load.
 * Renders the existing Supra GLB on a transparent canvas with a gentle
 * auto-rotate. No UI controls, no zoom, no pan — just a calm product shot.
 */

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";

function SupraScene() {
  const { scene } = useGLTF("/models/supra_veilside.glb");
  return <primitive object={scene} scale={1.15} position={[0, -0.6, 0]} />;
}
useGLTF.preload("/models/supra_veilside.glb");

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [4.2, 1.6, 5.4], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, -2]} intensity={0.4} />

      <Suspense fallback={null}>
        <SupraScene />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -0.95, 0]}
          opacity={0.45}
          scale={10}
          blur={2.4}
          far={2}
        />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

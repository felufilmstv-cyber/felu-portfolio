'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export type CoreState = 'idle' | 'processing' | 'splitting' | 'condensed';
export interface DataCore3DProps {
  /** Reserved: path to future .glb — when supplied, placeholder auto-hides */
  model?: string;
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  position?: [number, number, number];
  lighting?: { intensity?: number; color?: string };
  state?: CoreState;
  /** 0..1 scroll progress driving rotation / split / pulse */
  scrollProgress?: number;
}

// PLACEHOLDER CANVAS — replace with <primitive object={gltf.scene}> when model is ready.
// Keeps identical props (rotation/scale/position/lighting/state/scrollProgress) so no page rebuild is needed.
export default function DataCore3D({
  rotation = [0, 0, 0], scale = 1, position = [0, 0, 0],
  lighting = {}, state = 'idle', scrollProgress = 0
}: DataCore3DProps) {
  const core = useRef<THREE.Mesh>(null!);
  const wire = useRef<THREE.Mesh>(null!);
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const splitL = useRef<THREE.Group>(null!);
  const splitR = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const N = 600;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 2.4 + Math.random() * 3.2;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const p = scrollProgress;
    const speed = state === 'idle' ? 0.15 : state === 'processing' ? 1.6 : state === 'splitting' ? 0.9 : 0.3;
    const pulse = state === 'idle' ? 1 + Math.sin(t * 1.4) * 0.03 : 1 + Math.sin(t * 6) * 0.02;

    if (core.current) {
      core.current.rotation.y += dt * speed + p * 0.02;
      core.current.rotation.x = rotation[0] + p * 1.2;
      core.current.scale.setScalar(pulse * (state === 'condensed' ? 0.72 : 1));
    }
    if (wire.current) {
      wire.current.rotation.y -= dt * (speed * 0.6);
      wire.current.rotation.z += dt * 0.1;
    }
    if (ringA.current) ringA.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.15;
    if (ringB.current) ringB.current.rotation.y = t * 0.2;
    // split: dual pathways separate on X as progress/state demands
    const splitAmt = state === 'splitting' ? 1 : p > 0.45 ? (p - 0.45) * 2 : 0;
    if (splitL.current) splitL.current.position.x = -splitAmt * 1.4;
    if (splitR.current) splitR.current.position.x = splitAmt * 1.4;
  });

  const glow = lighting.color ?? '#2B4EFF';
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={lighting.intensity ?? 2.2} color={glow} />
      <pointLight position={[-5, -2, -3]} intensity={0.7} color="#ffffff" />
      <group ref={splitL}>
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh ref={core}>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial color="#0b0b10" metalness={0.9} roughness={0.22} flatShading emissive={glow} emissiveIntensity={0.14} />
          </mesh>
          <mesh ref={wire} scale={1.28}>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshBasicMaterial color={glow} wireframe transparent opacity={0.32} />
          </mesh>
        </Float>
      </group>
      <group ref={splitR}>
        <mesh ref={ringA}>
          <torusGeometry args={[2.05, 0.012, 12, 128]} />
          <meshBasicMaterial color="#F2F0EA" transparent opacity={0.5} />
        </mesh>
        <mesh ref={ringB}>
          <torusGeometry args={[2.5, 0.008, 12, 128]} />
          <meshBasicMaterial color={glow} transparent opacity={0.65} />
        </mesh>
      </group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color={glow} transparent opacity={0.7} sizeAttenuation />
      </points>
    </group>
  );
}

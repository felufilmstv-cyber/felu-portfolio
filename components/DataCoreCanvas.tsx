'use client';
import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import type { DataCore3DProps } from './DataCore3D';

const Core = lazy(() => import('./DataCore3D'));

// GPU-friendly defaults: low DPR, no antialias cost on mobile, lazy-mounted.
export default function DataCoreCanvas(props: DataCore3DProps & { style?: React.CSSProperties }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      style={{ background: 'transparent', ...(props.style ?? {}) }}
    >
      <Suspense fallback={null}>
        <Core {...props} />
      </Suspense>
    </Canvas>
  );
}

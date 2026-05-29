import { Canvas, useFrame } from '@react-three/fiber';
import { StarField } from './StarField';
import { SceneController } from './SceneController';
import { lenisInstance } from '../hooks/useLenis';

// Ticks Lenis inside the R3F animation loop so it stays perfectly in sync
// with the WebGL frame cadence (no double-rAF drift).
function LenisTicker() {
  useFrame(() => {
    if (lenisInstance) lenisInstance.raf(performance.now());
  });
  return null;
}

interface Props {
  scrollProgressRef: React.RefObject<number>;
  introCompleteRef: React.RefObject<boolean>;
  style?: React.CSSProperties;
  paused?: boolean;
}

export function GalaxyCanvas({ scrollProgressRef, introCompleteRef, style, paused = false }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
        ...style,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 65, near: 0.1, far: 120, position: [0, 2, 8] }}
        style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <ambientLight intensity={0.1} />
        <StarField paused={paused} />
        <SceneController scrollProgressRef={scrollProgressRef} introCompleteRef={introCompleteRef} paused={paused} />
        <LenisTicker />
      </Canvas>
    </div>
  );
}
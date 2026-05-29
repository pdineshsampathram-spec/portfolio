import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Camera path constants — matches the prompt spec
const CAM_START = new THREE.Vector3(0, 4.5, 12);
const CAM_END   = new THREE.Vector3(0, 0.8, 2.0);

interface Props {
  scrollProgressRef: React.RefObject<number>;
  introCompleteRef: React.RefObject<boolean>;
  paused?: boolean;
}

export function SceneController({ scrollProgressRef, introCompleteRef, paused = false }: Props) {
  const { camera, scene } = useThree();
  const camPos = useRef(CAM_START.clone());
  const rotY   = useRef(0);

  // eslint-disable-next-line react-hooks/immutability
  useFrame(() => {
    if (paused) return;
    if (!camera || !scene) return;

    // Read directly from the ref — zero overhead, no module coupling
    const p = scrollProgressRef.current ?? 0;

    // ── Camera position: lerp along path 0→1 ─────────────────────────────────
    const targetX = THREE.MathUtils.lerp(CAM_START.x, CAM_END.x, p);
    const targetY = THREE.MathUtils.lerp(CAM_START.y, CAM_END.y, p);

    // Starts close at 3 (tunnel perspective), pulls back to 8, and scales down to 2.5 with scroll progress
    const baseZ = introCompleteRef.current ? 8 - p * 5.5 : 3;

    // Frame-rate-independent smooth follow (≈ prompt spec values)
    camPos.current.x = THREE.MathUtils.lerp(camPos.current.x, targetX, 0.028);
    camPos.current.y = THREE.MathUtils.lerp(camPos.current.y, targetY, 0.028);
    camPos.current.z = THREE.MathUtils.lerp(camPos.current.z, baseZ, 0.025);

    camera.position.copy(camPos.current);
    camera.lookAt(0, 0, 0);

    // ── Scene Y rotation: 0 → π×1.5 over full scroll ─────────────────────────
    const targetRot = p * Math.PI * 1.5;
    rotY.current = THREE.MathUtils.lerp(rotY.current, targetRot, 0.02);
    // eslint-disable-next-line react-hooks/immutability
    scene.rotation.y = rotY.current;
  });

  return null;
}

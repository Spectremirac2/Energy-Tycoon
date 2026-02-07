import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");

  useMemo(() => {
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(20, 20);
  }, [grassTexture]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={grassTexture} color="#2d5a1e" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a3a10" />
      </mesh>
    </group>
  );
}

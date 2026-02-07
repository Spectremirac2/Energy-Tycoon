import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

function Tree({ position, scale = 1 }: TreeProps) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.6, 6]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[0.6, 1.5, 6]} />
        <meshStandardMaterial color="#1a5c1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.4, 1, 6]} />
        <meshStandardMaterial color="#1f6b1f" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <dodecahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#666" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Environment() {
  const treePositions = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number }[] = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    };
    const rand = rng(42);

    for (let i = 0; i < 60; i++) {
      const x = (rand() - 0.5) * 80;
      const z = (rand() - 0.5) * 80;
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 8 && dist < 40) {
        positions.push({
          pos: [x, 0, z],
          scale: 0.6 + rand() * 0.8,
        });
      }
    }
    return positions;
  }, []);

  const rockPositions = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number }[] = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    };
    const rand = rng(123);

    for (let i = 0; i < 25; i++) {
      const x = (rand() - 0.5) * 70;
      const z = (rand() - 0.5) * 70;
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 6 && dist < 35) {
        positions.push({
          pos: [x, 0, z],
          scale: 0.5 + rand() * 1.5,
        });
      }
    }
    return positions;
  }, []);

  return (
    <group>
      {treePositions.map((t, i) => (
        <Tree key={`tree_${i}`} position={t.pos} scale={t.scale} />
      ))}
      {rockPositions.map((r, i) => (
        <Rock key={`rock_${i}`} position={r.pos} scale={r.scale} />
      ))}
    </group>
  );
}

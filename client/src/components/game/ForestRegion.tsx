/**
 * Orman bölgesi - Yoğunlaştırılmış ağaçlar ve doğal ortam.
 * Ekstra ağaçlar, çalılıklar, mantarlar ve ışık efektleri.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { REGIONS } from "@/lib/gameConfig";

/** Deterministik PRNG */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Yoğun ağaçlar (InstancedMesh) */
function DenseForestTrees() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const leavesRef = useRef<THREE.InstancedMesh>(null);
  const forest = REGIONS.find((r) => r.id === "forest")!;
  const count = 80;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const trees = useMemo(() => {
    const rng = seededRandom(1234);
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = 3 + rng() * forest.radius * 0.85;
      return {
        x: forest.center[0] + Math.cos(angle) * dist,
        z: forest.center[2] + Math.sin(angle) * dist,
        height: 2 + rng() * 4,
        leafSize: 1 + rng() * 2,
        leafColor: ["#1a5a0a", "#2a6a1a", "#0a4a08", "#1a4a00"][Math.floor(rng() * 4)],
      };
    });
  }, []);

  // Gövdeleri ayarla
  useMemo(() => {
    if (!meshRef.current || !leavesRef.current) return;
    trees.forEach((t, i) => {
      // Gövde
      dummy.position.set(t.x, t.height / 2, t.z);
      dummy.scale.set(0.15, t.height / 2, 0.15);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      // Yapraklar
      dummy.position.set(t.x, t.height + t.leafSize * 0.3, t.z);
      dummy.scale.set(t.leafSize, t.leafSize, t.leafSize);
      dummy.updateMatrix();
      leavesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    leavesRef.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <cylinderGeometry args={[1, 1, 2, 6]} />
        <meshStandardMaterial color="#4a2a0a" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={leavesRef} args={[undefined, undefined, count]} castShadow>
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial color="#1a5a0a" roughness={0.85} />
      </instancedMesh>
    </>
  );
}

/** Çalılıklar */
function Bushes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const forest = REGIONS.find((r) => r.id === "forest")!;
  const count = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    if (!meshRef.current) return;
    const rng = seededRandom(5678);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = 5 + rng() * forest.radius * 0.8;
      const x = forest.center[0] + Math.cos(angle) * dist;
      const z = forest.center[2] + Math.sin(angle) * dist;
      const s = 0.3 + rng() * 0.5;
      dummy.position.set(x, s * 0.4, z);
      dummy.scale.set(s * 1.5, s, s * 1.5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[1, 5, 3]} />
      <meshStandardMaterial color="#2a6a1a" roughness={0.95} />
    </instancedMesh>
  );
}

/** Mantarlar */
function Mushrooms() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const capRef = useRef<THREE.InstancedMesh>(null);
  const forest = REGIONS.find((r) => r.id === "forest")!;
  const count = 20;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    if (!meshRef.current || !capRef.current) return;
    const rng = seededRandom(9012);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = 5 + rng() * forest.radius * 0.7;
      const x = forest.center[0] + Math.cos(angle) * dist;
      const z = forest.center[2] + Math.sin(angle) * dist;
      const s = 0.1 + rng() * 0.15;
      // Sap
      dummy.position.set(x, s * 1.5, z);
      dummy.scale.set(s, s * 3, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      // Şapka
      dummy.position.set(x, s * 3.5, z);
      dummy.scale.set(s * 2.5, s * 1.2, s * 2.5);
      dummy.updateMatrix();
      capRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    capRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#f5f0dc" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={capRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial color="#c44" roughness={0.8} />
      </instancedMesh>
    </>
  );
}

export function ForestRegion() {
  const forest = REGIONS.find((r) => r.id === "forest")!;
  const cx = forest.center[0];
  const cz = forest.center[2];

  return (
    <group>
      {/* Orman zemin - daha koyu yeşil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.01, cz]} receiveShadow>
        <circleGeometry args={[forest.radius, 32]} />
        <meshStandardMaterial color="#1a3a0a" roughness={0.98} />
      </mesh>

      <DenseForestTrees />
      <Bushes />
      <Mushrooms />

      {/* Bölge etiketi */}
      <Text
        position={[cx, 12, cz]}
        fontSize={1.5}
        color="#90EE90"
        anchorX="center"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        🌲 Yoğun Orman
      </Text>
    </group>
  );
}

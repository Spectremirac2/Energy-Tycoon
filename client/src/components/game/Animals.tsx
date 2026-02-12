/**
 * Hayvanlar ve canlılar bileşeni.
 * InstancedMesh ile düşük draw call.
 * Basit CPU animasyonu ile hareket.
 */
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { REGIONS } from "@/lib/gameConfig";

/** Deterministik PRNG */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface AnimalData {
  baseX: number;
  baseZ: number;
  phase: number;
  speed: number;
  scale: number;
}

/**
 * Koyunlar - Çiftlik bölgesinde otlayan beyaz koyunlar.
 */
function Sheep() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 20;
  const farm = REGIONS.find((r) => r.id === "farm")!;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const animals = useMemo<AnimalData[]>(() => {
    const rng = seededRandom(777);
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * farm.radius * 0.7;
      return {
        baseX: farm.center[0] + Math.cos(angle) * dist,
        baseZ: farm.center[2] + Math.sin(angle) * dist,
        phase: rng() * Math.PI * 2,
        speed: 0.3 + rng() * 0.4,
        scale: 0.4 + rng() * 0.3,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    animals.forEach((a, i) => {
      const x = a.baseX + Math.sin(t * a.speed + a.phase) * 3;
      const z = a.baseZ + Math.cos(t * a.speed * 0.7 + a.phase) * 3;
      dummy.position.set(x, a.scale * 0.4, z);
      dummy.scale.setScalar(a.scale);
      dummy.rotation.y = Math.atan2(
        Math.cos(t * a.speed + a.phase),
        -Math.sin(t * a.speed * 0.7 + a.phase)
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[0.8, 0.5, 1.2]} />
      <meshStandardMaterial color="#f0f0e8" roughness={0.9} />
    </instancedMesh>
  );
}

/**
 * İnekler - Çiftlik bölgesinde yavaş hareket eden kahverengi inekler.
 */
function Cows() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 10;
  const farm = REGIONS.find((r) => r.id === "farm")!;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const animals = useMemo<AnimalData[]>(() => {
    const rng = seededRandom(888);
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = 5 + rng() * farm.radius * 0.6;
      return {
        baseX: farm.center[0] + Math.cos(angle) * dist,
        baseZ: farm.center[2] + Math.sin(angle) * dist,
        phase: rng() * Math.PI * 2,
        speed: 0.15 + rng() * 0.15,
        scale: 0.7 + rng() * 0.4,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    animals.forEach((a, i) => {
      const x = a.baseX + Math.sin(t * a.speed + a.phase) * 2;
      const z = a.baseZ + Math.cos(t * a.speed * 0.5 + a.phase) * 2;
      dummy.position.set(x, a.scale * 0.35, z);
      dummy.scale.setScalar(a.scale);
      dummy.rotation.y = Math.atan2(
        Math.cos(t * a.speed + a.phase),
        -Math.sin(t * a.speed * 0.5 + a.phase)
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1.0, 0.7, 1.5]} />
      <meshStandardMaterial color="#8B4513" roughness={0.85} />
    </instancedMesh>
  );
}

/**
 * Tavuklar - Hızlı hareketli küçük beyaz tavuklar.
 */
function Chickens() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 15;
  const farm = REGIONS.find((r) => r.id === "farm")!;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const animals = useMemo<AnimalData[]>(() => {
    const rng = seededRandom(999);
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = 3 + rng() * farm.radius * 0.5;
      return {
        baseX: farm.center[0] + Math.cos(angle) * dist,
        baseZ: farm.center[2] + Math.sin(angle) * dist,
        phase: rng() * Math.PI * 2,
        speed: 0.8 + rng() * 1.2,
        scale: 0.2 + rng() * 0.15,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    animals.forEach((a, i) => {
      const x = a.baseX + Math.sin(t * a.speed + a.phase) * 4;
      const z = a.baseZ + Math.cos(t * a.speed * 1.3 + a.phase) * 4;
      dummy.position.set(x, a.scale * 0.5, z);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[0.5, 6, 4]} />
      <meshStandardMaterial color="#f5f0dc" roughness={0.9} />
    </instancedMesh>
  );
}

/**
 * Kuşlar - Havada sinüs dalga uçuşu yapan kuşlar.
 */
function Birds() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 25;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const birds = useMemo(() => {
    const rng = seededRandom(555);
    return Array.from({ length: count }, () => ({
      cx: (rng() - 0.5) * 300,
      cz: (rng() - 0.5) * 300,
      height: 15 + rng() * 25,
      orbitRadius: 10 + rng() * 30,
      speed: 0.3 + rng() * 0.5,
      phase: rng() * Math.PI * 2,
      scale: 0.15 + rng() * 0.1,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    birds.forEach((b, i) => {
      const x = b.cx + Math.cos(t * b.speed + b.phase) * b.orbitRadius;
      const z = b.cz + Math.sin(t * b.speed + b.phase) * b.orbitRadius;
      const y = b.height + Math.sin(t * 2 + b.phase) * 2;
      dummy.position.set(x, y, z);
      dummy.scale.set(b.scale * 3, b.scale, b.scale * 2);
      dummy.rotation.y = t * b.speed + b.phase + Math.PI / 2;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.3, 0.8, 3]} />
      <meshStandardMaterial color="#333" roughness={0.7} />
    </instancedMesh>
  );
}

/**
 * Kelebekler - Çiçekli alanlarda rastgele uçuş.
 */
function Butterflies() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 30;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bugs = useMemo(() => {
    const rng = seededRandom(333);
    return Array.from({ length: count }, () => ({
      cx: (rng() - 0.5) * 250,
      cz: (rng() - 0.5) * 250,
      height: 1 + rng() * 3,
      speed: 1 + rng() * 2,
      phase: rng() * Math.PI * 2,
      scale: 0.08 + rng() * 0.06,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    bugs.forEach((b, i) => {
      const x = b.cx + Math.sin(t * b.speed + b.phase) * 5;
      const z = b.cz + Math.cos(t * b.speed * 0.8 + b.phase) * 5;
      const y = b.height + Math.sin(t * 4 + b.phase) * 0.5;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 0.6]} />
      <meshStandardMaterial color="#ff6b9d" side={THREE.DoubleSide} roughness={0.5} />
    </instancedMesh>
  );
}

/**
 * Geyikler - Orman bölgesinde zarif hareket.
 */
function Deer() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 8;
  const forest = REGIONS.find((r) => r.id === "forest")!;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const animals = useMemo<AnimalData[]>(() => {
    const rng = seededRandom(444);
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = 5 + rng() * forest.radius * 0.6;
      return {
        baseX: forest.center[0] + Math.cos(angle) * dist,
        baseZ: forest.center[2] + Math.sin(angle) * dist,
        phase: rng() * Math.PI * 2,
        speed: 0.2 + rng() * 0.3,
        scale: 0.6 + rng() * 0.4,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    animals.forEach((a, i) => {
      const x = a.baseX + Math.sin(t * a.speed + a.phase) * 6;
      const z = a.baseZ + Math.cos(t * a.speed * 0.6 + a.phase) * 6;
      dummy.position.set(x, a.scale * 0.6, z);
      dummy.scale.set(a.scale * 0.5, a.scale, a.scale * 1.2);
      dummy.rotation.y = Math.atan2(
        Math.cos(t * a.speed + a.phase),
        -Math.sin(t * a.speed * 0.6 + a.phase)
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[0.5, 1.0, 1.2]} />
      <meshStandardMaterial color="#8B6914" roughness={0.85} />
    </instancedMesh>
  );
}

/**
 * Ana hayvanlar bileşeni - tüm canlıları içerir.
 */
export function Animals() {
  return (
    <group>
      <Sheep />
      <Cows />
      <Chickens />
      <Birds />
      <Butterflies />
      <Deer />
    </group>
  );
}

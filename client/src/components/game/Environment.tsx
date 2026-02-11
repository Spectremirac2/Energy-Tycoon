import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MAP_CONFIG } from "@/lib/gameConfig";

/**
 * Instanced rendering ile çevre elemanları (ağaç, kaya).
 * Büyük haritada yüzlerce obje tek draw call ile çizilir.
 */

/** Deterministic PRNG */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Ağaç pozisyonlarını oluştur */
function generateTreeData(count: number, radius: number, seed: number) {
  try {
    const rand = createRng(seed);
    const data: { position: THREE.Vector3; scale: number; rotation: number }[] = [];

    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * radius * 2;
      const z = (rand() - 0.5) * radius * 2;
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 12 && dist < radius) {
        data.push({
          position: new THREE.Vector3(x, 0, z),
          scale: 0.5 + rand() * 1.0,
          rotation: rand() * Math.PI * 2,
        });
      }
    }
    return data;
  } catch (e) {
    console.error("[Environment] Ağaç verisi oluşturma hatası:", e);
    return [];
  }
}

/** Kaya pozisyonlarını oluştur */
function generateRockData(count: number, radius: number, seed: number) {
  try {
    const rand = createRng(seed);
    const data: { position: THREE.Vector3; scale: number; rotation: number }[] = [];

    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * radius * 2;
      const z = (rand() - 0.5) * radius * 2;
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 8 && dist < radius) {
        data.push({
          position: new THREE.Vector3(x, 0, z),
          scale: 0.4 + rand() * 1.8,
          rotation: rand() * Math.PI * 2,
        });
      }
    }
    return data;
  } catch (e) {
    console.error("[Environment] Kaya verisi oluşturma hatası:", e);
    return [];
  }
}

/** InstancedMesh ile ağaçlar */
function InstancedTrees() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const leavesRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(
    () => generateTreeData(MAP_CONFIG.TREE_COUNT, MAP_CONFIG.TREE_RADIUS, 42),
    []
  );

  useMemo(() => {
    try {
      if (!trunkRef.current || !leavesRef.current) return;
      const dummy = new THREE.Object3D();

      for (let i = 0; i < data.length; i++) {
        const { position, scale, rotation } = data[i];

        // Gövde
        dummy.position.set(position.x, 0.8 * scale, position.z);
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.set(0, rotation, 0);
        dummy.updateMatrix();
        trunkRef.current.setMatrixAt(i, dummy.matrix);

        // Yaprak
        dummy.position.set(position.x, 2.2 * scale, position.z);
        dummy.updateMatrix();
        leavesRef.current.setMatrixAt(i, dummy.matrix);
      }

      trunkRef.current.instanceMatrix.needsUpdate = true;
      leavesRef.current.instanceMatrix.needsUpdate = true;
    } catch (e) {
      console.error("[InstancedTrees] Matrix güncelleme hatası:", e);
    }
  }, [data]);

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, data.length]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.6, 5]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.9} />
      </instancedMesh>

      <instancedMesh ref={leavesRef} args={[undefined, undefined, data.length]} castShadow>
        <coneGeometry args={[0.6, 2.0, 5]} />
        <meshStandardMaterial color="#1a5c1a" roughness={0.8} />
      </instancedMesh>
    </>
  );
}

/** InstancedMesh ile kayalar */
function InstancedRocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(
    () => generateRockData(MAP_CONFIG.ROCK_COUNT, MAP_CONFIG.ROCK_RADIUS, 123),
    []
  );

  useMemo(() => {
    try {
      if (!meshRef.current) return;
      const dummy = new THREE.Object3D();

      for (let i = 0; i < data.length; i++) {
        const { position, scale, rotation } = data[i];
        dummy.position.set(position.x, 0.2 * scale, position.z);
        dummy.scale.set(scale, scale * 0.7, scale);
        dummy.rotation.set(0, rotation, rotation * 0.3);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
    } catch (e) {
      console.error("[InstancedRocks] Matrix güncelleme hatası:", e);
    }
  }, [data]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, data.length]} castShadow>
      <dodecahedronGeometry args={[0.4]} />
      <meshStandardMaterial color="#666" roughness={0.9} />
    </instancedMesh>
  );
}

/**
 * Çim kümeleri (dekoratif, instanced).
 * Küçük koni geometrisi ile doğal çim görünümü.
 * Saydam düzlem yerine opak koni → "cam panel" artefaktını önler.
 */
function InstancedGrass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 300;

  const data = useMemo(() => {
    try {
      const rand = createRng(999);
      const items: { x: number; z: number; scale: number; rot: number }[] = [];
      for (let i = 0; i < count; i++) {
        const x = (rand() - 0.5) * MAP_CONFIG.SIZE * 0.8;
        const z = (rand() - 0.5) * MAP_CONFIG.SIZE * 0.8;
        items.push({ x, z, scale: 0.15 + rand() * 0.25, rot: rand() * Math.PI });
      }
      return items;
    } catch (e) {
      console.error("[InstancedGrass] Veri oluşturma hatası:", e);
      return [];
    }
  }, []);

  useMemo(() => {
    try {
      if (!meshRef.current) return;
      const dummy = new THREE.Object3D();

      for (let i = 0; i < data.length; i++) {
        const { x, z, scale, rot } = data[i];
        dummy.position.set(x, scale * 0.3, z);
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.set(0, rot, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    } catch (e) {
      console.error("[InstancedGrass] Matrix güncelleme hatası:", e);
    }
  }, [data]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, data.length]}>
      <coneGeometry args={[0.25, 0.5, 4]} />
      <meshStandardMaterial color="#2d7a1e" roughness={0.9} />
    </instancedMesh>
  );
}

export function Environment() {
  return (
    <group>
      <InstancedTrees />
      <InstancedRocks />
      <InstancedGrass />
    </group>
  );
}

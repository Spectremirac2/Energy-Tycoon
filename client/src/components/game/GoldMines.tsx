import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGameState } from "@/lib/stores/useGameState";

interface MineData {
  id: string;
  position: [number, number, number];
  name: string;
  difficulty: number;
}

const MINES: MineData[] = [
  { id: "mine_1", position: [15, 0, -10], name: "Altın Dağı", difficulty: 1 },
  { id: "mine_2", position: [-18, 0, 8], name: "Gizli Maden", difficulty: 2 },
  { id: "mine_3", position: [20, 0, 15], name: "Kadim Ocak", difficulty: 3 },
  { id: "mine_4", position: [-12, 0, -18], name: "Ejder Madeni", difficulty: 4 },
];

function NativeGuard({ offset, seed }: { offset: [number, number, number]; seed: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + seed) * 0.05;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + seed) * 0.3;
    }
  });

  return (
    <group ref={ref} position={offset}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color="#cd8c52" />
      </mesh>
      <mesh position={[0.35, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
    </group>
  );
}

function MineMesh({ mine }: { mine: MineData }) {
  const glowRef = useRef<THREE.PointLight>(null);
  const { unlockedMines, startBattle, phase } = useGameState();
  const isUnlocked = unlockedMines.includes(mine.id);

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2 + mine.difficulty) * 0.5;
    }
  });

  const handleClick = () => {
    if (!isUnlocked && phase === "playing") {
      startBattle(mine.id);
    }
  };

  return (
    <group position={mine.position} onClick={handleClick}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[1.5, 2.5, 6]} />
        <meshStandardMaterial
          color={isUnlocked ? "#2ECC71" : "#8B4513"}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.4, 8]} />
        <meshStandardMaterial color={isUnlocked ? "#1a6b3a" : "#654321"} roughness={0.9} />
      </mesh>

      {!isUnlocked && (
        <>
          <NativeGuard offset={[2.5, 0, 1.5]} seed={mine.difficulty} />
          <NativeGuard offset={[-2, 0, 2]} seed={mine.difficulty + 10} />
          {mine.difficulty >= 3 && <NativeGuard offset={[1, 0, -2.5]} seed={mine.difficulty + 20} />}
        </>
      )}

      {isUnlocked && (
        <>
          <mesh position={[0.5, 0.5, 0.5]}>
            <dodecahedronGeometry args={[0.25]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFB800" emissiveIntensity={1} metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[-0.4, 0.4, 0.7]}>
            <dodecahedronGeometry args={[0.18]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFB800" emissiveIntensity={0.8} metalness={1} roughness={0.1} />
          </mesh>
        </>
      )}

      <pointLight ref={glowRef} position={[0, 2.5, 0]} color={isUnlocked ? "#FFD700" : "#E67E22"} intensity={1} distance={6} />

      <Text position={[0, 3, 0]} fontSize={0.4} color={isUnlocked ? "#2ECC71" : "#E67E22"} anchorX="center" outlineWidth={0.02} outlineColor="#000">
        {mine.name}
      </Text>
      {!isUnlocked && (
        <Text position={[0, 2.5, 0]} fontSize={0.25} color="#FFB800" anchorX="center" outlineWidth={0.02} outlineColor="#000">
          ⚔ Zorluk: {"★".repeat(mine.difficulty)}
        </Text>
      )}
      {isUnlocked && (
        <Text position={[0, 2.5, 0]} fontSize={0.25} color="#2ECC71" anchorX="center" outlineWidth={0.02} outlineColor="#000">
          ✓ Fethedildi
        </Text>
      )}
    </group>
  );
}

export function GoldMines() {
  return (
    <group>
      {MINES.map((mine) => (
        <MineMesh key={mine.id} mine={mine} />
      ))}
    </group>
  );
}


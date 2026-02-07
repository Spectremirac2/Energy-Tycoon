import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Building, BuildingType } from "@/lib/stores/useGameState";

interface BuildingMeshProps {
  building: Building;
  onClick?: () => void;
}

function SolarPanel({ building, onClick }: BuildingMeshProps) {
  const ref = useRef<THREE.Group>(null);

  return (
    <group ref={ref} position={building.position} onClick={onClick}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#1a3c6e" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 1.2]} />
        <meshStandardMaterial color="#1A5F7A" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#666" metalness={0.5} />
      </mesh>
      {building.level > 1 && (
        <Text position={[0, 1.2, 0]} fontSize={0.3} color="#FFB800" anchorX="center">
          Lv.{building.level}
        </Text>
      )}
    </group>
  );
}

function WindTurbine({ building, onClick }: BuildingMeshProps) {
  const bladeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group position={building.position} onClick={onClick}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 4, 8]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[0, 3.8, 0.15]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#ccc" />
      </mesh>
      <group position={[0, 3.8, 0.3]} ref={bladeRef}>
        {[0, 120, 240].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.12, 1.8, 0.03]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        ))}
      </group>
      {building.level > 1 && (
        <Text position={[0, 5, 0]} fontSize={0.3} color="#FFB800" anchorX="center">
          Lv.{building.level}
        </Text>
      )}
    </group>
  );
}

function PowerStation({ building, onClick }: BuildingMeshProps) {
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <group position={building.position} onClick={onClick}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.5, 2]} />
        <meshStandardMaterial color="#34495E" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0.6, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 1.6, 0.5]}>
        <boxGeometry args={[0.8, 0.4, 0.05]} />
        <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.5} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 2.5, 0]} color="#FFB800" intensity={1} distance={5} />
      {building.level > 1 && (
        <Text position={[0, 3, 0]} fontSize={0.3} color="#FFB800" anchorX="center">
          Lv.{building.level}
        </Text>
      )}
    </group>
  );
}

function GoldMineMesh({ building, onClick }: BuildingMeshProps) {
  const sparkleRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (sparkleRef.current) {
      sparkleRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
    }
  });

  return (
    <group position={building.position} onClick={onClick}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.6, 2]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[1.2, 1, 4]} />
        <meshStandardMaterial color="#6B4E0A" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, 0.2, 0.8]}>
        <dodecahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFB800" emissiveIntensity={0.8} metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[-0.5, 0.15, 0.6]}>
        <dodecahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFB800" emissiveIntensity={0.6} metalness={1} roughness={0.1} />
      </mesh>
      <pointLight ref={sparkleRef} position={[0, 1.5, 0]} color="#FFD700" intensity={0.5} distance={4} />
      {building.level > 1 && (
        <Text position={[0, 2.2, 0]} fontSize={0.3} color="#FFB800" anchorX="center">
          Lv.{building.level}
        </Text>
      )}
    </group>
  );
}

function GamingOffice({ building, onClick }: BuildingMeshProps) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const t = state.clock.elapsedTime;
      screenRef.current.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.3;
    }
  });

  return (
    <group position={building.position} onClick={onClick}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 2.5]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[3.2, 0.2, 2.7]} />
        <meshStandardMaterial color="#1a2530" />
      </mesh>
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 1.26]}>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial
            ref={i === 1 ? screenRef : undefined}
            color="#1A5F7A"
            emissive="#1A5F7A"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      <mesh position={[1.2, 0.5, 1.26]}>
        <boxGeometry args={[0.4, 0.8, 0.05]} />
        <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.3} />
      </mesh>
      {building.level > 1 && (
        <Text position={[0, 3, 0]} fontSize={0.3} color="#FFB800" anchorX="center">
          Lv.{building.level}
        </Text>
      )}
    </group>
  );
}

const BUILDING_COMPONENTS: Record<BuildingType, React.FC<BuildingMeshProps>> = {
  solar_panel: SolarPanel,
  wind_turbine: WindTurbine,
  power_station: PowerStation,
  gold_mine: GoldMineMesh,
  gaming_office: GamingOffice,
};

export function BuildingMesh({ building, onClick }: BuildingMeshProps) {
  const Component = BUILDING_COMPONENTS[building.type];
  return <Component building={building} onClick={onClick} />;
}

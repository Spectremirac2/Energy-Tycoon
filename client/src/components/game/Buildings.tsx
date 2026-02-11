import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Building, BuildingType } from "@/lib/stores/useGameState";

interface BuildingMeshProps {
  building: Building;
  onClick?: () => void;
}

/* ────────────── Yardımcı: Seviye Etiketi ────────────── */
function LevelTag({ level, y }: { level: number; y: number }) {
  if (level <= 1) return null;
  return (
    <Text position={[0, y, 0]} fontSize={0.3} color="#FFB800" anchorX="center">
      Lv.{level}
    </Text>
  );
}

/* ════════════════════════════════════════════════════════
   MEVCUT BİNA MODELLERİ
   ════════════════════════════════════════════════════════ */

function SolarPanel({ building, onClick }: BuildingMeshProps) {
  return (
    <group position={building.position} onClick={onClick}>
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
      <LevelTag level={building.level} y={1.2} />
    </group>
  );
}

function WindTurbine({ building, onClick }: BuildingMeshProps) {
  const bladeRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (bladeRef.current) bladeRef.current.rotation.z += delta * 2;
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
          <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]} castShadow>
            <boxGeometry args={[0.12, 1.8, 0.03]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        ))}
      </group>
      <LevelTag level={building.level} y={5} />
    </group>
  );
}

function PowerStation({ building, onClick }: BuildingMeshProps) {
  const glowRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (glowRef.current) glowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
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
      <LevelTag level={building.level} y={3} />
    </group>
  );
}

function GoldMineMesh({ building, onClick }: BuildingMeshProps) {
  const sparkleRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (sparkleRef.current) sparkleRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
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
      <pointLight ref={sparkleRef} position={[0, 1.5, 0]} color="#FFD700" intensity={0.5} distance={4} />
      <LevelTag level={building.level} y={2.2} />
    </group>
  );
}

function GamingOffice({ building, onClick }: BuildingMeshProps) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (screenRef.current) screenRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
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
      <LevelTag level={building.level} y={3} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   YENİ BİNA MODELLERİ
   ════════════════════════════════════════════════════════ */

/** Nükleer Santral - büyük kubbe + soğutma kulesi */
function NuclearPlant({ building, onClick }: BuildingMeshProps) {
  const glowRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (glowRef.current) glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.8;
  });

  return (
    <group position={building.position} onClick={onClick}>
      {/* Ana bina */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.5, 3]} />
        <meshStandardMaterial color="#4a4a5a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Kubbe (reaktör) */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5a5a6a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Soğutma kulesi */}
      <mesh position={[2, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.8, 3, 12]} />
        <meshStandardMaterial color="#7a7a8a" roughness={0.8} />
      </mesh>
      {/* Radyoaktif ışıma */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.6} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 3, 0]} color="#00ff88" intensity={1.5} distance={8} />
      <LevelTag level={building.level} y={3.5} />
    </group>
  );
}

/** Güneş Çiftliği - geniş panel dizisi */
function SolarFarm({ building, onClick }: BuildingMeshProps) {
  return (
    <group position={building.position} onClick={onClick}>
      {/* 3x3 panel ızgarası */}
      {[-1.2, 0, 1.2].map((x, xi) =>
        [-0.8, 0.8].map((z, zi) => (
          <group key={`${xi}-${zi}`} position={[x, 0, z]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.6, 6]} />
              <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[0, 0.55, 0]} rotation={[-0.4, 0, 0]} castShadow>
              <boxGeometry args={[1, 0.04, 0.8]} />
              <meshStandardMaterial color="#1a3c6e" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))
      )}
      {/* Taban platform */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4, 0.04, 2.5]} />
        <meshStandardMaterial color="#555" roughness={0.9} />
      </mesh>
      <LevelTag level={building.level} y={1.2} />
    </group>
  );
}

/** Enerji Tüccarı - pazar binası */
function EnergyTrader({ building, onClick }: BuildingMeshProps) {
  const signRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (signRef.current) signRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.4;
  });

  return (
    <group position={building.position} onClick={onClick}>
      {/* Bina gövdesi */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.6, 2]} />
        <meshStandardMaterial color="#2c5530" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Çatı */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[2.8, 0.15, 2.3]} />
        <meshStandardMaterial color="#1a3320" />
      </mesh>
      {/* Neon tabela */}
      <mesh position={[0, 1.4, 1.01]}>
        <boxGeometry args={[1.5, 0.3, 0.05]} />
        <meshStandardMaterial ref={signRef} color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} />
      </mesh>
      {/* Para sembolleri */}
      <Text position={[0, 1.4, 1.05]} fontSize={0.2} color="#1a3320" anchorX="center">
        $ TRADE $
      </Text>
      <LevelTag level={building.level} y={2.5} />
    </group>
  );
}

/** Eğitim Merkezi - modern okul binası */
function TrainingCenter({ building, onClick }: BuildingMeshProps) {
  return (
    <group position={building.position} onClick={onClick}>
      {/* Ana bina */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 2.5]} />
        <meshStandardMaterial color="#34495e" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Cam cephe */}
      <mesh position={[0, 1.2, 1.26]}>
        <boxGeometry args={[2.2, 1.2, 0.05]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Çatı */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[3.2, 0.15, 2.7]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Kitap simgesi */}
      <mesh position={[1.2, 2.5, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.4]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <LevelTag level={building.level} y={3.2} />
    </group>
  );
}

/** Hidroelektrik Santrali - baraj */
function Hydroelectric({ building, onClick }: BuildingMeshProps) {
  const waterRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (waterRef.current) waterRef.current.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <group position={building.position} onClick={onClick}>
      {/* Baraj duvarı */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 1.2, 1]} />
        <meshStandardMaterial color="#78909c" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Su */}
      <mesh position={[0, 0.3, -1]} receiveShadow>
        <boxGeometry args={[3.5, 0.4, 1.5]} />
        <meshStandardMaterial ref={waterRef} color="#1565c0" emissive="#1565c0" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Türbin odası */}
      <mesh position={[0, 0.3, 0.8]} castShadow>
        <boxGeometry args={[1.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#455a64" metalness={0.5} />
      </mesh>
      {/* Boru hattı */}
      <mesh position={[0, 0.5, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#37474f" metalness={0.6} />
      </mesh>
      <LevelTag level={building.level} y={2} />
    </group>
  );
}

/** Jeotermal Santral - buhar bacası + kuyular */
function Geothermal({ building, onClick }: BuildingMeshProps) {
  const steamRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (steamRef.current) steamRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.6;
  });

  return (
    <group position={building.position} onClick={onClick}>
      {/* Ana bina */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.2, 2]} />
        <meshStandardMaterial color="#795548" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Buhar bacası */}
      <mesh position={[-0.5, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.8, 8]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.7} />
      </mesh>
      {/* Buhar efekti */}
      <mesh position={[-0.5, 2.6, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      {/* Kuyu boruları */}
      {[0.6, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 0.6]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#d84315" metalness={0.5} />
        </mesh>
      ))}
      {/* Yerden gelen ısı ışığı */}
      <pointLight ref={steamRef} position={[0, 0.1, 0]} color="#ff6e40" intensity={1} distance={4} />
      <LevelTag level={building.level} y={3.2} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   BİNA BİLEŞEN HARİTASI
   ════════════════════════════════════════════════════════ */

const BUILDING_COMPONENTS: Record<BuildingType, React.FC<BuildingMeshProps>> = {
  solar_panel: SolarPanel,
  wind_turbine: WindTurbine,
  power_station: PowerStation,
  gold_mine: GoldMineMesh,
  gaming_office: GamingOffice,
  battery_storage: PowerStation,  // Geçici olarak PowerStation modeli
  research_lab: GamingOffice,     // Geçici olarak GamingOffice modeli
  nuclear_plant: NuclearPlant,
  solar_farm: SolarFarm,
  energy_trader: EnergyTrader,
  training_center: TrainingCenter,
  hydroelectric: Hydroelectric,
  geothermal: Geothermal,
};

/** Mesafe bazlı culling ile performans optimizasyonu */
const MAX_RENDER_DISTANCE = 120;

export function BuildingMesh({ building, onClick }: BuildingMeshProps) {
  const Component = BUILDING_COMPONENTS[building.type];
  const { camera } = useThree();
  const [visible, setVisible] = useState(true);
  const frameSkip = useRef(0);

  useFrame(() => {
    try {
      frameSkip.current += 1;
      if (frameSkip.current % 15 !== 0) return; // Her 15 frame'de bir kontrol
      const dx = camera.position.x - building.position[0];
      const dz = camera.position.z - building.position[2];
      const distSq = dx * dx + dz * dz;
      setVisible(distSq < MAX_RENDER_DISTANCE * MAX_RENDER_DISTANCE);
    } catch {
      /* culling hatası sessizce geç */
    }
  });

  if (!Component || !visible) return null;
  return <Component building={building} onClick={onClick} />;
}

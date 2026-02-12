/**
 * Çiftlik Kasaba bölgesi 3D bileşeni.
 * Tarlalar, ahır, değirmen, pazaryeri.
 */
import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { REGIONS } from "@/lib/gameConfig";

/** Tarla - yeşil dikdörtgen, sıralı ekin çizgileri */
function Field({ position, size, cropColor }: {
  position: [number, number, number];
  size: [number, number];
  cropColor: string;
}) {
  const rows = useMemo(() => {
    const r: { x: number; z: number }[] = [];
    for (let i = -size[0] / 2 + 0.5; i < size[0] / 2; i += 1) {
      for (let j = -size[1] / 2 + 0.5; j < size[1] / 2; j += 1.2) {
        r.push({ x: i, z: j });
      }
    }
    return r;
  }, [size]);

  return (
    <group position={position}>
      {/* Tarla zemini */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#5a4a2a" roughness={1} />
      </mesh>
      {/* Ekin sıraları */}
      {rows.map((r, i) => (
        <mesh key={i} position={[r.x, 0.2, r.z]}>
          <coneGeometry args={[0.12, 0.4, 4]} />
          <meshStandardMaterial color={cropColor} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Ahır binası */
function Barn({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Gövde */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 6]} />
        <meshStandardMaterial color="#8B0000" roughness={0.8} />
      </mesh>
      {/* Çatı */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Kapı */}
      <mesh position={[0, 0.8, 3.01]}>
        <planeGeometry args={[1.5, 1.6]} />
        <meshStandardMaterial color="#3a2010" />
      </mesh>
      <Text
        position={[0, 5, 0]}
        fontSize={0.6}
        color="#FFD700"
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        🐄 Ahır
      </Text>
    </group>
  );
}

/** Değirmen */
function Windmill({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Gövde */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.2, 4, 8]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.8} />
      </mesh>
      {/* Çatı */}
      <mesh position={[0, 4.3, 0]} castShadow>
        <coneGeometry args={[1.3, 1.5, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      {/* Kanatlar (statik) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, i) => (
        <mesh key={i} position={[Math.sin(rot) * 1.5, 3.5, Math.cos(rot) * 0.1]} rotation={[0, 0, rot]}>
          <boxGeometry args={[0.15, 2.5, 0.05]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
      ))}
      <Text
        position={[0, 6, 0]}
        fontSize={0.6}
        color="#FFD700"
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        🌾 Değirmen
      </Text>
    </group>
  );
}

/** Pazaryeri - tezgahlar */
function Marketplace({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tezgahlar */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Masa */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.1, 1]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          {/* Bacaklar */}
          {[[-0.6, 0, -0.4], [0.6, 0, -0.4], [-0.6, 0, 0.4], [0.6, 0, 0.4]].map((leg, j) => (
            <mesh key={j} position={[leg[0], 0.25, leg[2]]}>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 4]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          ))}
          {/* Tente */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[1.8, 0.05, 1.3]} />
            <meshStandardMaterial color={["#c44", "#4a4", "#44c"][i]} />
          </mesh>
        </group>
      ))}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.6}
        color="#FFD700"
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        🛒 Pazaryeri
      </Text>
    </group>
  );
}

export function FarmRegion() {
  const farm = REGIONS.find((r) => r.id === "farm")!;
  const cx = farm.center[0];
  const cz = farm.center[2];

  return (
    <group>
      {/* Çiftlik zemin alanı */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.01, cz]} receiveShadow>
        <circleGeometry args={[farm.radius, 32]} />
        <meshStandardMaterial color="#6a7a3a" roughness={0.95} />
      </mesh>

      {/* Tarlalar */}
      <Field position={[cx - 10, 0, cz - 8]} size={[8, 6]} cropColor="#2d7a1e" />
      <Field position={[cx + 8, 0, cz - 10]} size={[6, 8]} cropColor="#d4a017" />
      <Field position={[cx - 8, 0, cz + 12]} size={[10, 5]} cropColor="#228B22" />

      {/* Binalar */}
      <Barn position={[cx + 12, 0, cz + 5]} />
      <Windmill position={[cx - 15, 0, cz]} />
      <Marketplace position={[cx, 0, cz + 15]} />

      {/* Çit - çiftlik çevresi */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x = cx + Math.cos(angle) * (farm.radius - 1);
        const z = cz + Math.sin(angle) * (farm.radius - 1);
        return (
          <mesh key={i} position={[x, 0.3, z]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[0.1, 0.6, 1.5]} />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Bölge etiketi */}
      <Text
        position={[cx, 10, cz]}
        fontSize={1.5}
        color="#FFD700"
        anchorX="center"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        🌾 Çiftlik Kasaba
      </Text>
    </group>
  );
}

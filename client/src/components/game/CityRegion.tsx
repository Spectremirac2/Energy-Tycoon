/**
 * Ticaret Şehri bölgesi 3D bileşeni.
 * Belediye binası, banka, market, depolar ve konut blokları.
 * Oyuncu yaklaştığında etkileşim sağlar.
 */
import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { REGIONS } from "@/lib/gameConfig";

/** Basit şehir binası */
function CityBuilding({
  position,
  size,
  color,
  label,
  icon,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  icon: string;
}) {
  return (
    <group position={position}>
      {/* Ana bina gövdesi */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Çatı */}
      <mesh position={[0, size[1] + 0.3, 0]} castShadow>
        <boxGeometry args={[size[0] + 0.3, 0.3, size[2] + 0.3]} />
        <meshStandardMaterial color="#555" roughness={0.8} />
      </mesh>
      {/* Etiket */}
      <Text
        position={[0, size[1] + 1.2, 0]}
        fontSize={0.6}
        color="#FFD700"
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        {icon} {label}
      </Text>
    </group>
  );
}

/** Konut bloğu */
function ResidentialBlock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Ana bina */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial color="#b0a090" roughness={0.7} />
      </mesh>
      {/* Pencereler (ön yüz) */}
      {[0.5, 1.5, 2.5].map((y, i) => (
        <mesh key={i} position={[0, y, 1.01]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Yol - şehir içi */
function CityRoad({ from, to }: { from: [number, number]; to: [number, number] }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[1] + to[1]) / 2;

  return (
    <mesh rotation={[-Math.PI / 2, 0, angle]} position={[cx, 0.02, cz]}>
      <planeGeometry args={[1.5, length]} />
      <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
    </mesh>
  );
}

export function CityRegion() {
  const city = REGIONS.find((r) => r.id === "city")!;
  const cx = city.center[0];
  const cz = city.center[2];

  const buildings = useMemo(
    () => [
      { pos: [cx, 0, cz] as [number, number, number], size: [4, 6, 4] as [number, number, number], color: "#c9b896", label: "Belediye", icon: "🏛️" },
      { pos: [cx + 12, 0, cz - 5] as [number, number, number], size: [3, 4, 3] as [number, number, number], color: "#8B7355", label: "Banka", icon: "🏦" },
      { pos: [cx - 10, 0, cz + 8] as [number, number, number], size: [5, 3, 4] as [number, number, number], color: "#CD853F", label: "Market", icon: "🏪" },
      { pos: [cx + 8, 0, cz + 10] as [number, number, number], size: [6, 3, 5] as [number, number, number], color: "#8B8682", label: "Depo", icon: "📦" },
      { pos: [cx - 12, 0, cz - 8] as [number, number, number], size: [3, 5, 3] as [number, number, number], color: "#A0522D", label: "Otel", icon: "🏨" },
    ],
    [cx, cz]
  );

  const residentials = useMemo(() => {
    const res: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = city.radius * 0.6;
      res.push([cx + Math.cos(angle) * dist, 0, cz + Math.sin(angle) * dist]);
    }
    return res;
  }, [cx, cz]);

  return (
    <group>
      {/* Şehir zemin alanı - hafif beton rengi */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.01, cz]} receiveShadow>
        <circleGeometry args={[city.radius, 32]} />
        <meshStandardMaterial color="#9a9080" roughness={0.95} />
      </mesh>

      {/* Ana binalar */}
      {buildings.map((b, i) => (
        <CityBuilding key={i} position={b.pos} size={b.size} color={b.color} label={b.label} icon={b.icon} />
      ))}

      {/* Konut blokları */}
      {residentials.map((pos, i) => (
        <ResidentialBlock key={`res_${i}`} position={pos} />
      ))}

      {/* Yollar */}
      <CityRoad from={[cx, cz]} to={[cx + 12, cz - 5]} />
      <CityRoad from={[cx, cz]} to={[cx - 10, cz + 8]} />
      <CityRoad from={[cx, cz]} to={[cx + 8, cz + 10]} />
      <CityRoad from={[cx, cz]} to={[cx - 12, cz - 8]} />

      {/* Bölge etiketi */}
      <Text
        position={[cx, 12, cz]}
        fontSize={1.5}
        color="#FFD700"
        anchorX="center"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        🏙️ Ticaret Şehri
      </Text>
    </group>
  );
}

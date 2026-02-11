import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import { MAP_CONFIG, BIOMES } from "@/lib/gameConfig";

/**
 * Genişletilmiş arazi bileşeni.
 * MAP_CONFIG sabitlerinden boyut alır. Merkez bölge doku kullanır,
 * arka plan düz renk ile geniş alan kaplar.
 * Biome renklerini kenar bölgelerinde gösterir.
 */
export function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");

  useMemo(() => {
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(MAP_CONFIG.TEXTURE_REPEAT, MAP_CONFIG.TEXTURE_REPEAT);
  }, [grassTexture]);

  /** Biome bölgeleri - haritanın kenarlarında farklı renkler */
  const biomePatches = useMemo(() => {
    try {
      const patches: { pos: [number, number, number]; size: number; color: string; rotation: number }[] = [];
      const rng = (seed: number) => {
        let s = seed;
        return () => {
          s = (s * 9301 + 49297) % 233280;
          return s / 233280;
        };
      };
      const rand = rng(777);
      const half = MAP_CONFIG.SIZE / 2;

      for (let i = 0; i < 12; i++) {
        const biome = BIOMES[Math.floor(rand() * BIOMES.length)];
        const angle = rand() * Math.PI * 2;
        const dist = 30 + rand() * (half - 40);
        patches.push({
          pos: [Math.cos(angle) * dist, -0.005, Math.sin(angle) * dist],
          size: 15 + rand() * 25,
          color: biome.color,
          rotation: rand() * Math.PI,
        });
      }
      return patches;
    } catch (e) {
      console.error("[Terrain] Biome patch oluşturma hatası:", e);
      return [];
    }
  }, []);

  return (
    <group>
      {/* Ana oynanabilir alan */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[MAP_CONFIG.SIZE, MAP_CONFIG.SIZE]} />
        <meshStandardMaterial map={grassTexture} color="#2d5a1e" />
      </mesh>

      {/* Arka plan geniş düzlem */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[MAP_CONFIG.BG_SIZE, MAP_CONFIG.BG_SIZE]} />
        <meshStandardMaterial color="#1a3a10" />
      </mesh>

      {/* Biome bölgeleri */}
      {biomePatches.map((patch, i) => (
        <mesh
          key={`biome_${i}`}
          rotation={[-Math.PI / 2, patch.rotation, 0]}
          position={patch.pos}
        >
          <circleGeometry args={[patch.size, 8]} />
          <meshStandardMaterial color={patch.color} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Yol çizgileri - merkeze doğru */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={`road_${i}`}
          rotation={[-Math.PI / 2, angle, 0]}
          position={[0, -0.005, 0]}
        >
          <planeGeometry args={[2, MAP_CONFIG.SIZE * 0.7]} />
          <meshStandardMaterial color="#4a3a2e" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import { MAP_CONFIG } from "@/lib/gameConfig";

/**
 * Temiz arazi bileşeni.
 * Tek parça zemin + çim dokusu. Kenar geçişi sis (fog) ile sağlanır.
 * Büyük renkli yamalar, yapay yol çizgileri ve kare katmanlar kaldırıldı.
 */
export function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");

  useMemo(() => {
    try {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(MAP_CONFIG.TEXTURE_REPEAT, MAP_CONFIG.TEXTURE_REPEAT);
      grassTexture.colorSpace = THREE.SRGBColorSpace;
    } catch (e) {
      console.error("[Terrain] Texture ayar hatası:", e);
    }
  }, [grassTexture]);

  const mainSize = MAP_CONFIG.SIZE; // 400
  const bgSize = MAP_CONFIG.BG_SIZE + 200; // 1000 – kenar asla görünmesin

  /**
   * Küçük, ince dekoratif yamalar – zemine hafif doğal renk varyasyonu verir.
   * Büyük biome yamaları yerine 20+ küçük (3-8 birim) çok düşük kontrastlı lekeler.
   */
  const subtlePatches = useMemo(() => {
    try {
      const patches: {
        pos: [number, number, number];
        size: number;
        color: string;
        rotation: number;
      }[] = [];

      const rng = (seed: number) => {
        let s = seed;
        return () => {
          s = (s * 9301 + 49297) % 233280;
          return s / 233280;
        };
      };
      const rand = rng(42);
      const half = mainSize / 2;

      // Hafif renk varyasyonları – hepsi yeşil tonlarında
      const colors = [
        "#2a6320", // biraz koyu yeşil
        "#3d7a2e", // biraz açık yeşil
        "#2e5825", // zeytin yeşili
        "#357030", // orman yeşili
        "#3a6e28", // temel yeşil (neredeyse görünmez)
      ];

      for (let i = 0; i < 60; i++) {
        const angle = rand() * Math.PI * 2;
        const dist = 10 + rand() * (half - 15);
        patches.push({
          pos: [Math.cos(angle) * dist, 0.002, Math.sin(angle) * dist],
          size: 3 + rand() * 6, // 3-9 birim (küçük)
          color: colors[Math.floor(rand() * colors.length)],
          rotation: rand() * Math.PI * 2,
        });
      }
      return patches;
    } catch (e) {
      console.error("[Terrain] Subtle patch hatası:", e);
      return [];
    }
  }, [mainSize]);

  /**
   * İnce toprak patikalar – harita merkezinden hafifçe dışarı uzanan yollar.
   * Çok ince ve kısa, yarı saydam değil.
   */
  const paths = useMemo(() => {
    try {
      const rng = (seed: number) => {
        let s = seed;
        return () => {
          s = (s * 9301 + 49297) % 233280;
          return s / 233280;
        };
      };
      const rand = rng(123);

      return Array.from({ length: 3 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 3 + (rand() - 0.5) * 0.3;
        const length = 20 + rand() * 30;
        return { angle, length };
      });
    } catch (e) {
      console.error("[Terrain] Path oluşturma hatası:", e);
      return [];
    }
  }, []);

  return (
    <group>
      {/* Alt zemin – sis rengiyle aynı tonda, çok büyük, kenar asla görünmez */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[bgSize, bgSize]} />
        <meshStandardMaterial color="#2a5520" />
      </mesh>

      {/* Ana oynanabilir alan – çim dokusu ile */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[mainSize, mainSize]} />
        <meshStandardMaterial map={grassTexture} color="#4a8a38" />
      </mesh>

      {/* Küçük dekoratif yamalar – hafif renk varyasyonu */}
      {subtlePatches.map((patch, i) => (
        <mesh
          key={`sp_${i}`}
          rotation={[-Math.PI / 2, patch.rotation, 0]}
          position={patch.pos}
        >
          <circleGeometry args={[patch.size, 16]} />
          <meshStandardMaterial
            color={patch.color}
            opacity={0.35}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* İnce toprak patikalar – doğal yollar */}
      {paths.map((p, i) => (
        <mesh
          key={`path_${i}`}
          rotation={[-Math.PI / 2, p.angle, 0]}
          position={[0, 0.001, 0]}
        >
          <planeGeometry args={[0.6, p.length]} />
          <meshStandardMaterial color="#5a5040" />
        </mesh>
      ))}
    </group>
  );
}

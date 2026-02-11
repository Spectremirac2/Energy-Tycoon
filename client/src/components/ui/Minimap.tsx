/**
 * Minimap bileşeni – oyun dünyasının kuşbakışı 2D görünümü.
 * Binaları, madenleri ve oyuncu konumunu gösterir.
 */

import { useMemo } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { MAP_CONFIG, MINE_LOCATIONS } from "@/lib/gameConfig";

/** Bina tipi → renk haritası */
const TYPE_COLORS: Record<string, string> = {
  solar_panel: "#f1c40f",
  wind_turbine: "#3498db",
  power_station: "#e74c3c",
  gold_mine: "#FFD700",
  gaming_office: "#9b59b6",
  battery_storage: "#1abc9c",
  research_lab: "#e67e22",
  nuclear_plant: "#00ff88",
  solar_farm: "#f39c12",
  energy_trader: "#2ecc71",
  training_center: "#4fc3f7",
  hydroelectric: "#1565c0",
  geothermal: "#ff6e40",
};

/** Dünya koordinatını minimap piksel konumuna çevir */
function worldToMinimap(
  worldX: number,
  worldZ: number,
  mapSize: number,
  minimapSize: number
): { x: number; y: number } {
  const half = mapSize / 2;
  const x = ((worldX + half) / mapSize) * minimapSize;
  const y = ((worldZ + half) / mapSize) * minimapSize;
  return { x, y };
}

export function Minimap() {
  const { buildings, playerPosition, phase } = useGameState();
  const MINIMAP_SIZE = 160;
  const DOT_SIZE = 5;
  const PLAYER_SIZE = 7;
  const MINE_SIZE = 6;

  /** Bina noktaları */
  const buildingDots = useMemo(() => {
    try {
      return buildings.map((b) => {
        const pos = worldToMinimap(b.position[0], b.position[2], MAP_CONFIG.SIZE, MINIMAP_SIZE);
        return {
          id: b.id,
          x: pos.x,
          y: pos.y,
          color: TYPE_COLORS[b.type] ?? "#ffffff",
        };
      });
    } catch {
      return [];
    }
  }, [buildings]);

  /** Maden noktaları */
  const mineDots = useMemo(() => {
    try {
      return MINE_LOCATIONS.map((m) => {
        const pos = worldToMinimap(m.position[0], m.position[2], MAP_CONFIG.SIZE, MINIMAP_SIZE);
        return { id: m.id, x: pos.x, y: pos.y };
      });
    } catch {
      return [];
    }
  }, []);

  /** Oyuncu konumu */
  const playerDot = useMemo(() => {
    try {
      const px = playerPosition?.[0] ?? 0;
      const pz = playerPosition?.[2] ?? 0;
      return worldToMinimap(px, pz, MAP_CONFIG.SIZE, MINIMAP_SIZE);
    } catch {
      return { x: MINIMAP_SIZE / 2, y: MINIMAP_SIZE / 2 };
    }
  }, [playerPosition]);

  if (phase !== "playing") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        width: `${MINIMAP_SIZE}px`,
        height: `${MINIMAP_SIZE}px`,
        background: "rgba(10, 21, 32, 0.85)",
        border: "1px solid rgba(255, 184, 0, 0.4)",
        borderRadius: "8px",
        overflow: "hidden",
        zIndex: 15,
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        pointerEvents: "none",
      }}
    >
      {/* Başlık */}
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "9px",
          fontWeight: 700,
          color: "rgba(255, 184, 0, 0.7)",
          letterSpacing: "1px",
          fontFamily: "'Rajdhani', sans-serif",
          zIndex: 2,
        }}
      >
        MİNİ HARİTA
      </div>

      {/* Izgara çizgileri */}
      <svg
        width={MINIMAP_SIZE}
        height={MINIMAP_SIZE}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <g key={f}>
            <line
              x1={f * MINIMAP_SIZE}
              y1={0}
              x2={f * MINIMAP_SIZE}
              y2={MINIMAP_SIZE}
              stroke="#FFB800"
              strokeWidth={0.5}
            />
            <line
              x1={0}
              y1={f * MINIMAP_SIZE}
              x2={MINIMAP_SIZE}
              y2={f * MINIMAP_SIZE}
              stroke="#FFB800"
              strokeWidth={0.5}
            />
          </g>
        ))}
      </svg>

      {/* Maden noktaları */}
      {mineDots.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            left: `${m.x - MINE_SIZE / 2}px`,
            top: `${m.y - MINE_SIZE / 2}px`,
            width: `${MINE_SIZE}px`,
            height: `${MINE_SIZE}px`,
            background: "#FFD700",
            borderRadius: "1px",
            transform: "rotate(45deg)",
            opacity: 0.7,
          }}
        />
      ))}

      {/* Bina noktaları */}
      {buildingDots.map((b) => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            left: `${b.x - DOT_SIZE / 2}px`,
            top: `${b.y - DOT_SIZE / 2}px`,
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            background: b.color,
            borderRadius: "50%",
            boxShadow: `0 0 3px ${b.color}`,
          }}
        />
      ))}

      {/* Oyuncu */}
      <div
        style={{
          position: "absolute",
          left: `${playerDot.x - PLAYER_SIZE / 2}px`,
          top: `${playerDot.y - PLAYER_SIZE / 2}px`,
          width: `${PLAYER_SIZE}px`,
          height: `${PLAYER_SIZE}px`,
          background: "#fff",
          border: "1px solid #FFB800",
          borderRadius: "50%",
          boxShadow: "0 0 6px rgba(255, 184, 0, 0.8)",
          zIndex: 1,
        }}
      />
    </div>
  );
}

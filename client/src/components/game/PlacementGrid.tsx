import { useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { useGameState, BuildingType } from "@/lib/stores/useGameState";
import { MAP_CONFIG } from "@/lib/gameConfig";
import { Quadtree, createGameQuadtree } from "@/lib/Quadtree";

const BUILDING_COLORS: Record<BuildingType, string> = {
  solar_panel: "#1A5F7A",
  wind_turbine: "#e0e0e0",
  power_station: "#34495E",
  gold_mine: "#8B6914",
  gaming_office: "#2c3e50",
};

export function PlacementGrid() {
  const { placementMode, selectedBuildingType, placeBuilding, buildings } = useGameState();
  const [hoverPos, setHoverPos] = useState<[number, number, number] | null>(null);
  const [isValid, setIsValid] = useState(true);
  const planeRef = useRef<THREE.Mesh>(null);
  const qtRef = useRef<Quadtree>(createGameQuadtree(MAP_CONFIG.SIZE));

  /** Quadtree'yi binalar değiştiğinde yeniden oluştur */
  useEffect(() => {
    try {
      const qt = createGameQuadtree(MAP_CONFIG.SIZE);
      buildings.forEach((b) => qt.insert({ id: b.id, x: b.position[0], z: b.position[2] }));
      qtRef.current = qt;
    } catch (e) {
      console.error("[PlacementGrid] Quadtree güncelleme hatası:", e);
    }
  }, [buildings]);

  const handlePointerMove = useCallback((e: any) => {
    if (!placementMode) return;
    e.stopPropagation();

    const point = e.point;
    const snap = MAP_CONFIG.GRID_SNAP;
    const snappedX = Math.round(point.x / snap) * snap;
    const snappedZ = Math.round(point.z / snap) * snap;

    // Quadtree O(log n) çarpışma kontrolü
    try {
      const nearby = qtRef.current.queryRadius(snappedX, snappedZ, MAP_CONFIG.MIN_SPACING);
      setIsValid(nearby.length === 0);
    } catch {
      // Quadtree hatası olursa fallback: O(n) kontrol
      const tooClose = buildings.some((b) => {
        const dx = b.position[0] - snappedX;
        const dz = b.position[2] - snappedZ;
        return Math.sqrt(dx * dx + dz * dz) < MAP_CONFIG.MIN_SPACING;
      });
      setIsValid(!tooClose);
    }

    setHoverPos([snappedX, 0, snappedZ]);
  }, [placementMode, buildings]);

  const handleClick = useCallback((e: any) => {
    if (!placementMode || !selectedBuildingType || !hoverPos || !isValid) return;
    e.stopPropagation();
    console.log("[PlacementGrid] Placing building:", selectedBuildingType, "at", hoverPos);
    placeBuilding(selectedBuildingType, hoverPos);
  }, [placementMode, selectedBuildingType, hoverPos, isValid, placeBuilding]);

  if (!placementMode || !selectedBuildingType) return null;

  return (
    <group>
      <mesh
        ref={planeRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        <planeGeometry args={[MAP_CONFIG.SIZE, MAP_CONFIG.SIZE]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {hoverPos && (
        <>
          <mesh
            position={[hoverPos[0], 0.02, hoverPos[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[3, 3]} />
            <meshBasicMaterial
              color={isValid ? "#2ECC71" : "#e74c3c"}
              transparent
              opacity={0.3}
            />
          </mesh>

          <mesh position={[hoverPos[0], 0.5, hoverPos[2]]}>
            <boxGeometry args={[1.5, 1, 1.5]} />
            <meshStandardMaterial
              color={BUILDING_COLORS[selectedBuildingType]}
              transparent
              opacity={0.5}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

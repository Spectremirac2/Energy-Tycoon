/**
 * Ana 3D sahne bileşeni.
 * Post-processing efektleri: Bloom, Vignette, ToneMapping.
 * PerformanceMonitor ile adaptif DPR.
 */
import { Suspense, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Stars, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Terrain } from "./Terrain";
import { Environment } from "./Environment";
import { GoldMines } from "./GoldMines";
import { PlacementGrid } from "./PlacementGrid";
import { BuildingMesh } from "./Buildings";
import { Player } from "./Player";
import { useGameState } from "@/lib/stores/useGameState";
import { MAP_CONFIG } from "@/lib/gameConfig";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
];

function Lights() {
  const shadowSize = MAP_CONFIG.SHADOW_SIZE;
  return (
    <>
      <ambientLight intensity={0.4} color="#b0c4de" />
      <directionalLight
        position={[30, 45, 15]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={shadowSize * 2}
        shadow-camera-left={-shadowSize}
        shadow-camera-right={shadowSize}
        shadow-camera-top={shadowSize}
        shadow-camera-bottom={-shadowSize}
        color="#fff5e0"
      />
      <directionalLight position={[-15, 20, -15]} intensity={0.3} color="#4a90d9" />
      <hemisphereLight args={["#87ceeb", "#2d5a1e", 0.3]} />
    </>
  );
}

/**
 * @description Post-processing efektleri.
 *   Bloom: Enerji binaları ve altın madenler için parıltı.
 *   Vignette: Sinematik atmosfer.
 *   ToneMapping: Renk grading (ACES Filmic).
 */
function PostEffects() {
  try {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.6} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  } catch (e) {
    console.error("[PostEffects] Render hatası:", e);
    return null;
  }
}

function GameScene() {
  const { buildings, tick, phase } = useGameState();

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      try {
        tick();
      } catch (e) {
        console.error("[GameScene] tick hatası:", e);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [phase, tick]);

  return (
    <>
      <Lights />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={["#0F2027", MAP_CONFIG.FOG_NEAR, MAP_CONFIG.FOG_FAR]} />

      <Suspense fallback={null}>
        <Terrain />
        <Environment />
        <GoldMines />
        <PlacementGrid />
        <Player />

        {buildings.map((building) => (
          <BuildingMesh key={building.id} building={building} />
        ))}
      </Suspense>

      {/* Post-processing */}
      <PostEffects />
    </>
  );
}

export function GameWorld() {
  const [dpr, setDpr] = useState(1.5);

  /** Performans düşerse DPR'yi azalt, yükselirse artır */
  const handleIncline = useCallback(() => {
    setDpr((prev) => Math.min(2, prev + 0.1));
  }, []);
  const handleDecline = useCallback(() => {
    setDpr((prev) => Math.max(0.8, prev - 0.1));
  }, []);

  return (
    <KeyboardControls map={keyMap}>
      <Canvas
        shadows
        dpr={dpr}
        camera={{
          position: [20, 25, 20],
          fov: 50,
          near: 0.1,
          far: MAP_CONFIG.CAMERA_FAR,
        }}
        gl={{
          antialias: true,
          powerPreference: "default",
          toneMapping: 3,
          toneMappingExposure: 1.2,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#0a1520"]} />
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
          flipflops={3}
          onFallback={() => setDpr(0.8)}
        />
        <GameScene />
      </Canvas>
    </KeyboardControls>
  );
}

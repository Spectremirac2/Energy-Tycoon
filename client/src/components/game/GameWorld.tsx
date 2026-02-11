/**
 * Ana 3D sahne bileşeni.
 * Post-processing efektleri: Bloom, Vignette, ToneMapping.
 * PerformanceMonitor ile adaptif DPR.
 * Mobil pinch-zoom desteği.
 */
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
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
import { useJoystickStore } from "@/lib/stores/useJoystickStore";

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

/**
 * @description Pinch-zoom overlay - Canvas üzerine dokunmatik zoom kontrolü.
 * İki parmak sıkıştırma/açma ile kamera mesafesini ayarlar.
 * Masaüstünde fare tekerleği ile de çalışır.
 */
function PinchZoomOverlay() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastDistRef = useRef<number | null>(null);
  const { cameraZoom, setZoom } = useJoystickStore();

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    /** İki parmak arası mesafe */
    const getTouchDist = (e: TouchEvent): number => {
      try {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dx = t0.clientX - t1.clientX;
        const dy = t0.clientY - t1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      } catch {
        return 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastDistRef.current = getTouchDist(e);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || lastDistRef.current === null) return;
      try {
        const newDist = getTouchDist(e);
        const delta = (lastDistRef.current - newDist) * 0.005;
        setZoom(cameraZoom + delta);
        lastDistRef.current = newDist;
      } catch {
        /* sessizce geç */
      }
    };

    const onTouchEnd = () => {
      lastDistRef.current = null;
    };

    /** Masaüstü fare tekerleği ile zoom */
    const onWheel = (e: WheelEvent) => {
      try {
        e.preventDefault();
        const delta = e.deltaY * 0.001;
        setZoom(cameraZoom + delta);
      } catch {
        /* sessizce geç */
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [cameraZoom, setZoom]);

  return (
    <div
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        touchAction: "none",
        pointerEvents: "auto",
      }}
    />
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
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
        {/* Pinch-zoom overlay: Canvas üzerinde dokunmatik/tekerlek zoom */}
        <PinchZoomOverlay />
      </div>
    </KeyboardControls>
  );
}

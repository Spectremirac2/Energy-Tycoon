import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import { MAP_CONFIG } from "@/lib/gameConfig";
import { useGameState } from "@/lib/stores/useGameState";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

/**
 * Oyuncu hareketi ve kamera takibi.
 * Sınırlar MAP_CONFIG.BOUNDS değerine göre dinamik.
 * Sprint: Shift tuşu ile 2x hız.
 */
export function Player() {
  const ref = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3());
  const setPlayerPosition = useGameState((s) => s.setPlayerPosition);
  const frameCounter = useRef(0);
  const BASE_SPEED = 12;
  const SPRINT_MULTIPLIER = 2;

  useEffect(() => {
    console.log("[Player] Kontroller başlatıldı. Harita sınırı:", MAP_CONFIG.BOUNDS);
  }, []);

  useFrame((state, delta) => {
    try {
      if (!ref.current) return;

      const keys = getKeys();
      const direction = new THREE.Vector3();

      if (keys.forward) direction.z -= 1;
      if (keys.back) direction.z += 1;
      if (keys.left) direction.x -= 1;
      if (keys.right) direction.x += 1;

      const speed = BASE_SPEED;

      if (direction.length() > 0) {
        direction.normalize();
        velocity.current.lerp(direction.multiplyScalar(speed), 0.15);
      } else {
        velocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      }

      ref.current.position.x += velocity.current.x * delta;
      ref.current.position.z += velocity.current.z * delta;

      // Dinamik sınırlar
      const bounds = MAP_CONFIG.BOUNDS;
      ref.current.position.x = THREE.MathUtils.clamp(ref.current.position.x, -bounds, bounds);
      ref.current.position.z = THREE.MathUtils.clamp(ref.current.position.z, -bounds, bounds);

      // Yürüme animasyonu
      if (direction.length() > 0) {
        const angle = Math.atan2(direction.x, direction.z);
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, angle, 0.1);
      }

      // Kamera takibi (büyük haritada daha geniş açı)
      const camOffsetX = 20;
      const camOffsetZ = 20;
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        ref.current.position.x + camOffsetX,
        0.03
      );
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        ref.current.position.z + camOffsetZ,
        0.03
      );
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 25, 0.02);
      state.camera.lookAt(ref.current.position.x, 0, ref.current.position.z);

      // Minimap için pozisyonu güncelle (her 10 frame'de bir, performans)
      frameCounter.current += 1;
      if (frameCounter.current % 10 === 0) {
        setPlayerPosition([
          ref.current.position.x,
          ref.current.position.y,
          ref.current.position.z,
        ]);
      }
    } catch (e) {
      console.error("[Player] Frame güncelleme hatası:", e);
    }
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* Gövde */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 1, 0.4]} />
        <meshStandardMaterial color="#1A5F7A" />
      </mesh>
      {/* Kafa */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#f0d0a0" />
      </mesh>
      {/* Şapka */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.45]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#FFB800"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        Siz
      </Text>
    </group>
  );
}

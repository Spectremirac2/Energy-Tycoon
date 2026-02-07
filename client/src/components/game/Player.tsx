import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

export function Player() {
  const ref = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3());
  const SPEED = 10;

  useEffect(() => {
    console.log("[Player] Keyboard controls initialized");
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const keys = getKeys();
    const direction = new THREE.Vector3();

    if (keys.forward) direction.z -= 1;
    if (keys.back) direction.z += 1;
    if (keys.left) direction.x -= 1;
    if (keys.right) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      velocity.current.lerp(direction.multiplyScalar(SPEED), 0.15);
    } else {
      velocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
    }

    ref.current.position.x += velocity.current.x * delta;
    ref.current.position.z += velocity.current.z * delta;

    ref.current.position.x = THREE.MathUtils.clamp(ref.current.position.x, -45, 45);
    ref.current.position.z = THREE.MathUtils.clamp(ref.current.position.z, -45, 45);

    if (direction.length() > 0) {
      const angle = Math.atan2(direction.x, direction.z);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, angle, 0.1);
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, ref.current.position.x + 15, 0.03);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, ref.current.position.z + 15, 0.03);
    state.camera.lookAt(ref.current.position.x, 0, ref.current.position.z);
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 1, 0.4]} />
        <meshStandardMaterial color="#1A5F7A" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#f0d0a0" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.45]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <Text position={[0, 2, 0]} fontSize={0.3} color="#FFB800" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        Siz
      </Text>
    </group>
  );
}

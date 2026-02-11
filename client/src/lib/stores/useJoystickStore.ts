/**
 * Sanal joystick & pinch-zoom durumu.
 * Player bileşeni yön + zoom bilgisini okur.
 */
import { create } from "zustand";

interface JoystickState {
  /** Joystick X yönü: -1 (sol) ~ 1 (sağ) */
  moveX: number;
  /** Joystick Y yönü: -1 (yukarı) ~ 1 (aşağı) */
  moveY: number;
  /** Kamera zoom çarpanı: 0.5 (yakın) ~ 2.0 (uzak). Varsayılan 1.0 */
  cameraZoom: number;
  /** Joystick yön bilgisini güncelle */
  setMove: (x: number, y: number) => void;
  /** Joystick serbest bırakıldığında sıfırla */
  resetMove: () => void;
  /** Pinch-zoom ile kamera mesafesini ayarla */
  setZoom: (z: number) => void;
}

export const useJoystickStore = create<JoystickState>((set) => ({
  moveX: 0,
  moveY: 0,
  cameraZoom: 1.0,
  setMove: (x, y) => set({ moveX: x, moveY: y }),
  resetMove: () => set({ moveX: 0, moveY: 0 }),
  setZoom: (z) => set({ cameraZoom: Math.max(0.5, Math.min(2.0, z)) }),
}));

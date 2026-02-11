/**
 * Sanal joystick durumu - nipplejs ile entegre.
 * Player bileşeni bu store'dan yön bilgisini okur.
 */
import { create } from "zustand";

interface JoystickState {
  /** Joystick X yönü: -1 (sol) ~ 1 (sağ) */
  moveX: number;
  /** Joystick Y yönü: -1 (yukarı) ~ 1 (aşağı) */
  moveY: number;
  /** Joystick yön bilgisini güncelle */
  setMove: (x: number, y: number) => void;
  /** Joystick serbest bırakıldığında sıfırla */
  resetMove: () => void;
}

export const useJoystickStore = create<JoystickState>((set) => ({
  moveX: 0,
  moveY: 0,
  setMove: (x, y) => set({ moveX: x, moveY: y }),
  resetMove: () => set({ moveX: 0, moveY: 0 }),
}));

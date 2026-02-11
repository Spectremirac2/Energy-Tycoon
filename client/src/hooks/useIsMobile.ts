/**
 * Mobil cihaz tespit hook'u.
 * Ekran genişliği 768px altındaysa veya dokunmatik cihazsa true döner.
 */
import { useState, useEffect } from "react";

/**
 * @returns {boolean} Cihaz mobilse true
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const checkMobile = () => {
        const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        const smallScreen = window.innerWidth < 768;
        setIsMobile(touchCapable && smallScreen);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    } catch (e) {
      console.error("[useIsMobile] Hata:", e);
      setIsMobile(false);
    }
  }, []);

  return isMobile;
}

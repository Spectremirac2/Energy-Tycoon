/**
 * Sanal Joystick bileşeni - Mobil cihazlar için nipplejs entegrasyonu.
 * Sol alt köşede görünür, sürükleme ile yön kontrolü sağlar.
 */
import { useEffect, useRef } from "react";
import { useJoystickStore } from "@/lib/stores/useJoystickStore";

/**
 * @description nipplejs'i dinamik olarak yükler ve joystick oluşturur.
 */
export function VirtualJoystick() {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<any>(null);
  const { setMove, resetMove } = useJoystickStore();

  useEffect(() => {
    let manager: any = null;

    const init = async () => {
      try {
        if (!containerRef.current) return;

        // nipplejs'i dinamik import et
        const nipplejs = await import("nipplejs");

        manager = nipplejs.create({
          zone: containerRef.current,
          mode: "static",
          position: { left: "60px", bottom: "60px" },
          size: 100,
          color: "rgba(255, 184, 0, 0.5)",
          fadeTime: 200,
          restOpacity: 0.6,
        });

        joystickRef.current = manager;

        manager.on("move", (_: any, data: any) => {
          try {
            if (!data?.vector) return;
            setMove(data.vector.x, -data.vector.y); // Y ekseni ters
          } catch {
            /* sessiz */
          }
        });

        manager.on("end", () => {
          resetMove();
        });
      } catch (e) {
        console.error("[VirtualJoystick] Başlatma hatası:", e);
      }
    };

    init();

    return () => {
      try {
        if (manager) manager.destroy();
      } catch {
        /* sessiz */
      }
    };
  }, [setMove, resetMove]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "160px",
        height: "160px",
        zIndex: 20,
        pointerEvents: "auto",
        touchAction: "none",
      }}
    />
  );
}

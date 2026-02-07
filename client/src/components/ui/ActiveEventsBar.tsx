/**
 * Aktif olaylar çubuğu.
 * Ekranın üst kısmında aktif olayları ve kalan sürelerini gösterir.
 */
import { useGameState } from "@/lib/stores/useGameState";
import { useEffect, useState } from "react";

/** @description Aktif olaylar gösterge bileşeni */
export function ActiveEventsBar() {
  const { activeEvents } = useGameState();
  const [now, setNow] = useState(Date.now());

  // Her saniye güncelle
  useEffect(() => {
    if (activeEvents.length === 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeEvents.length]);

  if (activeEvents.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5000,
        display: "flex",
        gap: "8px",
        pointerEvents: "none",
      }}
    >
      {activeEvents.map((event) => {
        const remaining = Math.max(0, Math.ceil((event.endsAt - now) / 1000));
        const totalDuration = event.endsAt - (event.endsAt - remaining * 1000);

        return (
          <div
            key={event.id}
            style={{
              background: "rgba(10, 15, 25, 0.9)",
              border: "1px solid #9b59b640",
              borderRadius: "20px",
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backdropFilter: "blur(10px)",
              animation: remaining <= 5 ? "pulse 0.5s infinite alternate" : "none",
            }}
          >
            <span style={{ fontSize: "16px" }}>{event.icon}</span>
            <span style={{ fontSize: "11px", color: "#e0e8f0", fontWeight: 600 }}>
              {event.title}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: remaining <= 5 ? "#e74c3c" : "#f39c12",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {remaining}s
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes pulse {
          from { opacity: 1; }
          to { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

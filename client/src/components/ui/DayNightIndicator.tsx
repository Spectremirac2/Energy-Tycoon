/**
 * Gündüz/Gece göstergesi.
 * HUD'da gün döngüsünü küçük bir ikonla gösterir.
 */
import { useGameState } from "@/lib/stores/useGameState";

/** @description Gün döngüsü göstergesi */
export function DayNightIndicator() {
  const { dayTime } = useGameState();

  try {
    const isNight = dayTime < 0.2 || dayTime > 0.8;
    const isDawn = dayTime >= 0.2 && dayTime < 0.3;
    const isDusk = dayTime >= 0.7 && dayTime <= 0.8;

    let icon = "☀️";
    let label = "Gündüz";
    let color = "#f39c12";

    if (isNight) {
      icon = "🌙";
      label = "Gece";
      color = "#3498db";
    } else if (isDawn) {
      icon = "🌅";
      label = "Şafak";
      color = "#e67e22";
    } else if (isDusk) {
      icon = "🌇";
      label = "Akşam";
      color = "#e74c3c";
    }

    /** Saati hesapla (dayTime=0.5 → 12:00) */
    const hours = Math.floor(dayTime * 24);
    const minutes = Math.floor((dayTime * 24 - hours) * 60);
    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(10, 15, 25, 0.7)",
          borderRadius: "12px",
          padding: "4px 10px",
          fontSize: "11px",
          color,
          fontWeight: 600,
        }}
      >
        <span>{icon}</span>
        <span>{timeStr}</span>
        <span style={{ fontSize: "9px", color: "#888" }}>({label})</span>
      </div>
    );
  } catch {
    return null;
  }
}

/**
 * Başarımlar paneli.
 * Kilit açılmış ve kilitli başarımları gösterir.
 */
import { useGameState } from "@/lib/stores/useGameState";
import { ACHIEVEMENTS } from "@/lib/gameConfig";

/** @description Başarımlar paneli bileşeni */
export function AchievementsPanel() {
  const { unlockedAchievements } = useGameState();

  const total = ACHIEVEMENTS.length;
  const unlocked = unlockedAchievements.length;

  return (
    <div style={{ padding: "12px 0" }}>
      {/* Başlık ve ilerleme */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#ccc", fontWeight: 600 }}>
          🏆 Başarımlar
        </span>
        <span style={{ fontSize: "11px", color: "#888" }}>
          {unlocked}/{total}
        </span>
      </div>

      {/* İlerleme çubuğu */}
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "#1a2040",
          borderRadius: "2px",
          marginBottom: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(unlocked / total) * 100}%`,
            background: "linear-gradient(90deg, #f39c12, #e74c3c)",
            borderRadius: "2px",
            transition: "width 0.3s",
          }}
        />
      </div>

      {/* Başarım listesi */}
      <div style={{ display: "grid", gap: "6px" }}>
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlockedAchievements.includes(a.id);
          return (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                borderRadius: "6px",
                background: isUnlocked ? "rgba(46, 204, 113, 0.1)" : "rgba(30, 40, 60, 0.5)",
                border: `1px solid ${isUnlocked ? "#2ECC7140" : "#1a204060"}`,
                opacity: isUnlocked ? 1 : 0.6,
              }}
            >
              <span style={{ fontSize: "20px", filter: isUnlocked ? "none" : "grayscale(1)" }}>
                {a.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: isUnlocked ? "#e0e8f0" : "#666" }}>
                  {a.title}
                </div>
                <div style={{ fontSize: "9px", color: isUnlocked ? "#aaa" : "#555" }}>
                  {a.description}
                </div>
              </div>
              {isUnlocked && (
                <span style={{ fontSize: "14px", color: "#2ECC71" }}>✅</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

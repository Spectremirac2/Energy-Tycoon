/**
 * Teknoloji Ağacı paneli.
 * Araştırma başlatma, ilerleme takibi ve kilidi açılmış teknolojileri gösterir.
 */
import { useGameState } from "@/lib/stores/useGameState";
import { TECH_TREE, type TechNode } from "@/lib/gameConfig";

/** @description Tek bir teknoloji kartı */
function TechCard({ tech }: { tech: TechNode }) {
  const { gold, unlockedTechs, currentResearch, researchProgress, startResearch } = useGameState();

  try {
    const isUnlocked = unlockedTechs.includes(tech.id);
    const isResearching = currentResearch === tech.id;
    const canResearch = !currentResearch && !isUnlocked &&
      tech.requires.every((r) => unlockedTechs.includes(r)) &&
      gold >= tech.cost;
    const requiresMet = tech.requires.every((r) => unlockedTechs.includes(r));
    const isLocked = !requiresMet && !isUnlocked;

    let bgColor = "rgba(30, 40, 60, 0.8)";
    let borderColor = "#334";
    let opacity = 1;

    if (isUnlocked) {
      bgColor = "rgba(46, 204, 113, 0.15)";
      borderColor = "#2ECC71";
    } else if (isResearching) {
      bgColor = "rgba(52, 152, 219, 0.15)";
      borderColor = "#3498db";
    } else if (isLocked) {
      opacity = 0.5;
      borderColor = "#333";
    }

    return (
      <div
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          padding: "10px",
          opacity,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Araştırma ilerleme çubuğu */}
        {isResearching && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              background: "rgba(52, 152, 219, 0.1)",
              width: `${researchProgress * 100}%`,
              transition: "width 0.5s",
            }}
          />
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Başlık */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "18px" }}>{tech.icon}</span>
            <span style={{ fontWeight: 700, fontSize: "12px", color: "#e0e8f0" }}>
              {tech.name}
            </span>
            {isUnlocked && <span style={{ fontSize: "12px" }}>✅</span>}
          </div>

          {/* Açıklama */}
          <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "6px", lineHeight: 1.3 }}>
            {tech.description}
          </div>

          {/* Gereksinimler */}
          {tech.requires.length > 0 && !isUnlocked && (
            <div style={{ fontSize: "9px", color: "#888", marginBottom: "4px" }}>
              Gerekli: {tech.requires.map((r) => {
                const reqTech = TECH_TREE.find((t) => t.id === r);
                const met = unlockedTechs.includes(r);
                return (
                  <span key={r} style={{ color: met ? "#2ECC71" : "#e74c3c", marginRight: "6px" }}>
                    {met ? "✅" : "❌"} {reqTech?.name ?? r}
                  </span>
                );
              })}
            </div>
          )}

          {/* Maliyet ve süre */}
          {!isUnlocked && (
            <div style={{ display: "flex", gap: "12px", fontSize: "10px", color: "#ccc", marginBottom: "6px" }}>
              <span>💰 {tech.cost}</span>
              <span>⏱️ {tech.researchTime}s</span>
            </div>
          )}

          {/* Araştırma durumu */}
          {isResearching && (
            <div style={{ fontSize: "11px", color: "#3498db", fontWeight: 600 }}>
              🔬 Araştırılıyor... {Math.floor(researchProgress * 100)}%
            </div>
          )}

          {/* Araştırma butonu */}
          {!isUnlocked && !isResearching && (
            <button
              onClick={() => startResearch(tech.id)}
              disabled={!canResearch}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "4px",
                border: "none",
                background: canResearch ? "#3498db" : "#333",
                color: canResearch ? "#fff" : "#666",
                fontSize: "11px",
                fontWeight: 600,
                cursor: canResearch ? "pointer" : "not-allowed",
                marginTop: "4px",
              }}
            >
              {isLocked ? "🔒 Kilitli" : canResearch ? "🔬 Araştır" : "💰 Yetersiz"}
            </button>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("[TechCard] render error:", err);
    return null;
  }
}

/** @description Teknoloji ağacı paneli */
export function TechPanel() {
  const { showTechPanel, toggleTechPanel, currentResearch, cancelResearch, unlockedTechs } = useGameState();

  if (!showTechPanel) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "340px",
        height: "100vh",
        background: "rgba(8, 12, 24, 0.95)",
        borderLeft: "1px solid #1a2040",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Başlık */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
        <h3 style={{ margin: 0, color: "#e0e8f0", fontSize: "16px" }}>
          🔬 TEKNOLOJİ AĞACI
        </h3>
        <button
          onClick={toggleTechPanel}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "14px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Durum bilgisi */}
      <div style={{ padding: "0 16px 12px", borderBottom: "1px solid #1a2040" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#aaa" }}>
          <span>Araştırılan: {unlockedTechs.length}/{TECH_TREE.length}</span>
          <span>{currentResearch ? "🔬 Aktif araştırma" : "⏸️ Beklemede"}</span>
        </div>
        {currentResearch && (
          <button
            onClick={cancelResearch}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #e74c3c40",
              background: "rgba(231, 76, 60, 0.1)",
              color: "#e74c3c",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            ❌ Araştırmayı İptal Et (%50 geri ödeme)
          </button>
        )}
      </div>

      {/* Teknoloji listesi */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <div style={{ display: "grid", gap: "8px" }}>
          {TECH_TREE.map((tech) => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}

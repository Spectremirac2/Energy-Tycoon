import { useGameState, BuildingType } from "@/lib/stores/useGameState";
import { NEW_BUILDING_COSTS, NEW_BUILDING_META, NEW_BUILDING_PRODUCTION } from "@/lib/gameConfig";

interface BuildingInfo {
  type: BuildingType;
  name: string;
  cost: number;
  description: string;
  icon: string;
  prodText: string;
  category: "energy" | "economy" | "special";
  requiresTech?: string;
}

const BASE_BUILDINGS: BuildingInfo[] = [
  { type: "solar_panel", name: "Güneş Paneli", cost: 50, description: "Temiz enerji üretir", icon: "☀️", prodText: "+5 Enerji/s", category: "energy" },
  { type: "wind_turbine", name: "Rüzgar Türbini", cost: 100, description: "Güçlü enerji kaynağı", icon: "🌬️", prodText: "+10 Enerji/s", category: "energy" },
  { type: "power_station", name: "Enerji Santrali", cost: 300, description: "Yüksek enerji + kapasite", icon: "🏭", prodText: "+25 Enerji/s", category: "energy" },
  { type: "gold_mine", name: "Altın Madeni", cost: 500, description: "Altın üretir, enerji harcar", icon: "⛏️", prodText: "+10 Altın/s, -5 Enerji/s", category: "economy" },
  { type: "gaming_office", name: "Oyun Ofisi", cost: 1000, description: "Oyun şirketi geliri", icon: "🎮", prodText: "+15 Altın/s, -10 Enerji/s", category: "economy" },
];

/** gameConfig'teki yeni bina tiplerini dinamik olarak ekle */
const NEW_BUILDINGS: BuildingInfo[] = Object.entries(NEW_BUILDING_META).map(([key, meta]) => ({
  type: key as BuildingType,
  name: meta.name,
  cost: NEW_BUILDING_COSTS[key] ?? 0,
  description: meta.description,
  icon: meta.icon,
  prodText: meta.prodText,
  category: meta.category,
  requiresTech: meta.requiresTech,
}));

const ALL_BUILDINGS: BuildingInfo[] = [...BASE_BUILDINGS, ...NEW_BUILDINGS];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  energy: { label: "⚡ ENERJİ", color: "#4fc3f7" },
  economy: { label: "💰 EKONOMİ", color: "#FFD700" },
  special: { label: "🌟 ÖZEL", color: "#9b59b6" },
};

export function BuildPanel() {
  const {
    showBuildPanel, toggleBuildPanel, gold,
    setSelectedBuildingType, setPlacementMode,
    placementMode, selectedBuildingType, unlockedTechs,
    getEffectiveCost,
  } = useGameState();

  if (!showBuildPanel) return null;

  /** Kategoriye göre grupla */
  const grouped: Record<string, BuildingInfo[]> = {};
  for (const b of ALL_BUILDINGS) {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  }

  return (
    <div style={{
      position: "fixed",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 20,
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(15,32,39,0.95), rgba(26,95,122,0.9))",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,184,0,0.3)",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(26,95,122,0.2)",
        minWidth: "600px",
        maxWidth: "95vw",
        maxHeight: "60vh",
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, color: "#FFB800", fontSize: "16px", fontWeight: 700, letterSpacing: "2px" }}>
            🔨 İNŞA MENÜSÜ
          </h3>
          <button onClick={toggleBuildPanel} style={{
            background: "rgba(231,76,60,0.3)",
            border: "1px solid rgba(231,76,60,0.5)",
            borderRadius: "4px",
            color: "#e74c3c",
            cursor: "pointer",
            padding: "4px 10px",
            fontSize: "14px",
            fontWeight: 600,
          }}>
            ✕
          </button>
        </div>

        {placementMode && (
          <div style={{
            background: "rgba(46,204,113,0.15)",
            border: "1px solid rgba(46,204,113,0.4)",
            borderRadius: "6px",
            padding: "8px 12px",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#2ECC71",
            textAlign: "center",
          }}>
            📍 Haritada yerleştirmek istediğiniz yere tıklayın
          </div>
        )}

        {(["energy", "economy", "special"] as const).map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          const catInfo = CATEGORY_LABELS[cat];

          return (
            <div key={cat} style={{ marginBottom: "14px" }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                color: catInfo.color,
                letterSpacing: "2px",
                marginBottom: "8px",
                borderBottom: `1px solid ${catInfo.color}33`,
                paddingBottom: "4px",
              }}>
                {catInfo.label}
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {items.map((b) => {
                  const effectiveCost = getEffectiveCost(b.type);
                  const canAfford = gold >= effectiveCost;
                  const isLocked = b.requiresTech ? !unlockedTechs.includes(b.requiresTech) : false;
                  const isSelected = placementMode && selectedBuildingType === b.type;
                  const isDisabled = !canAfford || isLocked;

                  return (
                    <button
                      key={b.type}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedBuildingType(b.type);
                          setPlacementMode(true);
                        }
                      }}
                      disabled={isDisabled}
                      title={isLocked ? `Gerekli teknoloji: ${b.requiresTech}` : b.description}
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(46,204,113,0.3), rgba(46,204,113,0.15))"
                          : !isDisabled
                            ? "linear-gradient(135deg, rgba(52,73,94,0.6), rgba(26,95,122,0.3))"
                            : "rgba(30,30,30,0.5)",
                        border: isSelected
                          ? "1px solid #2ECC71"
                          : !isDisabled
                            ? "1px solid rgba(255,184,0,0.3)"
                            : "1px solid rgba(100,100,100,0.3)",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        cursor: !isDisabled ? "pointer" : "not-allowed",
                        textAlign: "center",
                        minWidth: "95px",
                        opacity: !isDisabled ? 1 : 0.45,
                        transition: "all 0.2s ease",
                        position: "relative",
                      }}
                    >
                      {isLocked && (
                        <div style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          fontSize: "12px",
                        }}>
                          🔒
                        </div>
                      )}
                      <div style={{ fontSize: "28px", marginBottom: "4px" }}>{b.icon}</div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#e0e8f0", marginBottom: "2px" }}>{b.name}</div>
                      <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "4px" }}>{b.description}</div>
                      <div style={{ fontSize: "10px", color: "#2ECC71", marginBottom: "2px" }}>{b.prodText}</div>
                      <div style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: canAfford && !isLocked ? "#FFD700" : "#e74c3c",
                      }}>
                        💰 {effectiveCost}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

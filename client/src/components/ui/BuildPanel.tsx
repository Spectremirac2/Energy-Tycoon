import { useGameState, BuildingType } from "@/lib/stores/useGameState";

const BUILDINGS: { type: BuildingType; name: string; cost: number; description: string; icon: string; prodText: string }[] = [
  { type: "solar_panel", name: "Güneş Paneli", cost: 50, description: "Temiz enerji üretir", icon: "☀️", prodText: "+5 Enerji/s" },
  { type: "wind_turbine", name: "Rüzgar Türbini", cost: 100, description: "Güçlü enerji kaynağı", icon: "🌬️", prodText: "+10 Enerji/s" },
  { type: "power_station", name: "Enerji Santrali", cost: 300, description: "Yüksek enerji + kapasite", icon: "🏭", prodText: "+25 Enerji/s" },
  { type: "gold_mine", name: "Altın Madeni", cost: 500, description: "Altın üretir, enerji harcar", icon: "⛏️", prodText: "+10 Altın/s, -5 Enerji/s" },
  { type: "gaming_office", name: "Oyun Ofisi", cost: 1000, description: "Oyun şirketi geliri", icon: "🎮", prodText: "+15 Altın/s, -10 Enerji/s" },
];

export function BuildPanel() {
  const { showBuildPanel, toggleBuildPanel, gold, setSelectedBuildingType, setPlacementMode, placementMode, selectedBuildingType } = useGameState();

  if (!showBuildPanel) return null;

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
        minWidth: "500px",
        maxWidth: "90vw",
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

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {BUILDINGS.map((b) => {
            const canAfford = gold >= b.cost;
            const isSelected = placementMode && selectedBuildingType === b.type;
            return (
              <button
                key={b.type}
                onClick={() => {
                  if (canAfford) {
                    setSelectedBuildingType(b.type);
                    setPlacementMode(true);
                  }
                }}
                disabled={!canAfford}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(46,204,113,0.3), rgba(46,204,113,0.15))"
                    : canAfford
                      ? "linear-gradient(135deg, rgba(52,73,94,0.6), rgba(26,95,122,0.3))"
                      : "rgba(30,30,30,0.5)",
                  border: isSelected
                    ? "1px solid #2ECC71"
                    : canAfford
                      ? "1px solid rgba(255,184,0,0.3)"
                      : "1px solid rgba(100,100,100,0.3)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  cursor: canAfford ? "pointer" : "not-allowed",
                  textAlign: "center",
                  minWidth: "90px",
                  opacity: canAfford ? 1 : 0.5,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "4px" }}>{b.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#e0e8f0", marginBottom: "2px" }}>{b.name}</div>
                <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "4px" }}>{b.description}</div>
                <div style={{ fontSize: "10px", color: "#2ECC71", marginBottom: "2px" }}>{b.prodText}</div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: canAfford ? "#FFD700" : "#e74c3c",
                }}>
                  💰 {b.cost}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

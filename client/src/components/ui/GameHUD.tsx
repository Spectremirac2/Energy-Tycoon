import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";

const panelStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,32,39,0.92), rgba(26,95,122,0.85))",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,184,0,0.2)",
  borderRadius: "8px",
  padding: "12px 16px",
  color: "#e0e8f0",
  fontFamily: "'Rajdhani', sans-serif",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
};

export function GameHUD() {
  const {
    gold, energy, energyCapacity, goldPerSecond, energyPerSecond,
    buildings, employees, gamingCompanyLevel, gamingCompanyRevenue,
    toggleBuildPanel, toggleCompanyPanel, toggleEconomicPanel,
    unlockedMines,
  } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, fontFamily: "'Rajdhani', sans-serif" }}>
      <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", pointerEvents: "auto" }}>
          <div style={{ ...panelStyle, display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>💰</span>
            <div>
              <div style={{ fontSize: "11px", color: "#FFB800", letterSpacing: "1px", textTransform: "uppercase" }}>Altın</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#FFD700" }}>{Math.floor(gold)}</div>
              <div style={{ fontSize: "11px", color: goldPerSecond >= 0 ? "#2ECC71" : "#e74c3c" }}>
                {goldPerSecond >= 0 ? "+" : ""}{goldPerSecond.toFixed(1)}/s
              </div>
            </div>
          </div>

          <div style={{ ...panelStyle, display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>⚡</span>
            <div>
              <div style={{ fontSize: "11px", color: "#1A5F7A", letterSpacing: "1px", textTransform: "uppercase" }}>Enerji</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#4fc3f7" }}>
                {Math.floor(energy)}/{energyCapacity}
              </div>
              <div style={{ fontSize: "11px", color: energyPerSecond >= 0 ? "#2ECC71" : "#e74c3c" }}>
                {energyPerSecond >= 0 ? "+" : ""}{energyPerSecond.toFixed(1)}/s
              </div>
            </div>
          </div>

          <div style={{ ...panelStyle, display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🏢</span>
            <div>
              <div style={{ fontSize: "11px", color: "#E67E22", letterSpacing: "1px", textTransform: "uppercase" }}>Binalar</div>
              <div style={{ fontSize: "20px", fontWeight: 700 }}>{buildings.length}</div>
            </div>
          </div>

          <div style={{ ...panelStyle, display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>⛏️</span>
            <div>
              <div style={{ fontSize: "11px", color: "#E67E22", letterSpacing: "1px", textTransform: "uppercase" }}>Madenler</div>
              <div style={{ fontSize: "20px", fontWeight: 700 }}>{unlockedMines.length}/4</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", pointerEvents: "auto" }}>
          <div style={{ ...panelStyle, textAlign: "center", minWidth: "80px" }}>
            <div style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px" }}>SEVIYE</div>
            <div style={{ fontSize: "11px", color: "#FFB800" }}>Şirket Lv.{gamingCompanyLevel}</div>
            <div style={{ fontSize: "10px", color: "#2ECC71" }}>
              👥 {employees.length} Çalışan
            </div>
          </div>
          <button
            onClick={toggleMute}
            style={{
              ...panelStyle,
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              padding: 0,
            }}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", pointerEvents: "auto" }}>
        <ActionButton icon="🔨" label="İnşa Et" onClick={toggleBuildPanel} color="#1A5F7A" />
        <ActionButton icon="🎮" label="Şirket" onClick={toggleCompanyPanel} color="#2ECC71" />
        <ActionButton icon="📊" label="Ekonomi" onClick={toggleEconomicPanel} color="#E67E22" />
      </div>

      <div style={{ position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
        <div style={{
          ...panelStyle,
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(15,32,39,0.95), rgba(26,95,122,0.9))",
          borderColor: "rgba(255,184,0,0.3)",
        }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFB800", letterSpacing: "2px" }}>
            ÇUHADAR ENERJİ SİMULATOR
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, color }: { icon: string; label: string; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, rgba(15,32,39,0.92), ${color}44)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${color}66`,
        borderRadius: "8px",
        padding: "10px 20px",
        color: "#e0e8f0",
        cursor: "pointer",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        boxShadow: `0 4px 15px rgba(0,0,0,0.3), 0 0 15px ${color}22`,
        transition: "all 0.2s ease",
        minWidth: "80px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.4), 0 0 25px ${color}44`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 15px rgba(0,0,0,0.3), 0 0 15px ${color}22`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <span style={{ fontSize: "22px" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

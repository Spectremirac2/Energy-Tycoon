import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { DayNightIndicator } from "./DayNightIndicator";
import { useIsMobile } from "@/hooks/useIsMobile";

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

/** Mobil için küçültülmüş panel stili */
const panelStyleMobile: React.CSSProperties = {
  ...panelStyle,
  padding: "6px 10px",
  borderRadius: "6px",
};

export function GameHUD() {
  const {
    gold, energy, energyCapacity, goldPerSecond, energyPerSecond,
    buildings, employees, gamingCompanyLevel, gamingCompanyRevenue,
    toggleBuildPanel, toggleCompanyPanel, toggleEconomicPanel,
    toggleTechPanel, toggleSettingsPanel, toggleRivalsPanel, toggleStatsPanel,
    unlockedMines,
  } = useGameState();
  const { isMuted, toggleMute } = useAudio();
  const isMobile = useIsMobile();

  /** Platform'a göre panel stili */
  const ps = isMobile ? panelStyleMobile : panelStyle;
  const iconSize = isMobile ? "16px" : "22px";
  const labelSize = isMobile ? "9px" : "11px";
  const valueSize = isMobile ? "15px" : "20px";
  const gap = isMobile ? "4px" : "8px";
  const edge = isMobile ? "6px" : "12px";

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10, fontFamily: "'Rajdhani', sans-serif" }}>
      <div style={{ position: "absolute", top: edge, left: edge, right: edge, display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none" }}>
        <div style={{ display: "flex", gap, flexWrap: "wrap", pointerEvents: "auto", maxWidth: isMobile ? "65%" : "auto" }}>
          <div style={{ ...ps, display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px" }}>
            <span style={{ fontSize: iconSize }}>💰</span>
            <div>
              <div style={{ fontSize: labelSize, color: "#FFB800", letterSpacing: "1px", textTransform: "uppercase" }}>Altın</div>
              <div style={{ fontSize: valueSize, fontWeight: 700, color: "#FFD700" }}>{Math.floor(gold)}</div>
              {!isMobile && (
                <div style={{ fontSize: "11px", color: goldPerSecond >= 0 ? "#2ECC71" : "#e74c3c" }}>
                  {goldPerSecond >= 0 ? "+" : ""}{goldPerSecond.toFixed(1)}/s
                </div>
              )}
            </div>
          </div>

          <div style={{ ...ps, display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px" }}>
            <span style={{ fontSize: iconSize }}>⚡</span>
            <div>
              <div style={{ fontSize: labelSize, color: "#1A5F7A", letterSpacing: "1px", textTransform: "uppercase" }}>Enerji</div>
              <div style={{ fontSize: valueSize, fontWeight: 700, color: "#4fc3f7" }}>
                {Math.floor(energy)}/{energyCapacity}
              </div>
              {!isMobile && (
                <div style={{ fontSize: "11px", color: energyPerSecond >= 0 ? "#2ECC71" : "#e74c3c" }}>
                  {energyPerSecond >= 0 ? "+" : ""}{energyPerSecond.toFixed(1)}/s
                </div>
              )}
            </div>
          </div>

          {/* Mobilde Bina/Maden panellerini gizle (yer kazanmak için) */}
          {!isMobile && (
            <>
              <div style={{ ...ps, display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: iconSize }}>🏢</span>
                <div>
                  <div style={{ fontSize: labelSize, color: "#E67E22", letterSpacing: "1px", textTransform: "uppercase" }}>Binalar</div>
                  <div style={{ fontSize: valueSize, fontWeight: 700 }}>{buildings.length}</div>
                </div>
              </div>

              <div style={{ ...ps, display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: iconSize }}>⛏️</span>
                <div>
                  <div style={{ fontSize: labelSize, color: "#E67E22", letterSpacing: "1px", textTransform: "uppercase" }}>Madenler</div>
                  <div style={{ fontSize: valueSize, fontWeight: 700 }}>{unlockedMines.length}/4</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap, alignItems: "flex-start", pointerEvents: "auto" }}>
          {!isMobile && <DayNightIndicator />}
          {!isMobile && (
            <div style={{ ...ps, textAlign: "center", minWidth: "80px" }}>
              <div style={{ fontSize: "10px", color: "#aaa", letterSpacing: "1px" }}>SEVIYE</div>
              <div style={{ fontSize: "11px", color: "#FFB800" }}>Şirket Lv.{gamingCompanyLevel}</div>
              <div style={{ fontSize: "10px", color: "#2ECC71" }}>
                👥 {employees.length} Çalışan
              </div>
            </div>
          )}
          <button
            onClick={toggleSettingsPanel}
            style={{
              ...ps,
              cursor: "pointer",
              fontSize: isMobile ? "16px" : "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "36px" : "44px",
              height: isMobile ? "36px" : "44px",
              padding: 0,
            }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Alt aksiyon butonları - mobilde daha kompakt ve kaydırılabilir */}
      <div style={{
        position: "absolute",
        bottom: isMobile ? "70px" : "12px",
        left: isMobile ? "8px" : "50%",
        right: isMobile ? "8px" : "auto",
        transform: isMobile ? "none" : "translateX(-50%)",
        display: "flex",
        gap: isMobile ? "4px" : "8px",
        pointerEvents: "auto",
        overflowX: isMobile ? "auto" : "visible",
        WebkitOverflowScrolling: "touch",
        justifyContent: isMobile ? "flex-start" : "center",
      }}>
        <ActionButton icon="🔨" label="İnşa" onClick={toggleBuildPanel} color="#1A5F7A" compact={isMobile} />
        <ActionButton icon="🎮" label="Şirket" onClick={toggleCompanyPanel} color="#2ECC71" compact={isMobile} />
        <ActionButton icon="📊" label="Ekonomi" onClick={toggleEconomicPanel} color="#E67E22" compact={isMobile} />
        <ActionButton icon="🔬" label="Tekno" onClick={toggleTechPanel} color="#9b59b6" compact={isMobile} />
        <ActionButton icon="🏢" label="Rakip" onClick={toggleRivalsPanel} color="#e74c3c" compact={isMobile} />
        <ActionButton icon="📈" label="İstat" onClick={toggleStatsPanel} color="#3498db" compact={isMobile} />
      </div>

      {/* Başlık - mobilde gizle */}
      {!isMobile && (
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
      )}
    </div>
  );
}

function ActionButton({ icon, label, onClick, color, compact }: { icon: string; label: string; onClick: () => void; color: string; compact?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, rgba(15,32,39,0.92), ${color}44)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${color}66`,
        borderRadius: compact ? "6px" : "8px",
        padding: compact ? "6px 10px" : "10px 20px",
        color: "#e0e8f0",
        cursor: "pointer",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: compact ? "11px" : "14px",
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        boxShadow: `0 4px 15px rgba(0,0,0,0.3), 0 0 15px ${color}22`,
        transition: "all 0.2s ease",
        minWidth: compact ? "48px" : "80px",
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

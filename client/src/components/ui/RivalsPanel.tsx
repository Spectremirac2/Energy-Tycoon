/**
 * AI Rakip Paneli - Rakip şirketlerin durumlarını gösterir.
 * Pazar payları, fiyatlar, teknoloji seviyeleri ve son eylemleri.
 */
import { useGameState } from "@/lib/stores/useGameState";

/** Rakip bilgi kartı */
function RivalCard({ rival }: { rival: { id: string; name: string; color: string; gold: number; energy: number; buildingCount: number; techLevel: number; marketShare: number; energyPrice: number; reputation: number; lastAction: string } }) {
  try {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${rival.color}40`,
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "8px",
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: rival.color, boxShadow: `0 0 6px ${rival.color}` }} />
          <span style={{ fontWeight: 700, fontSize: "13px", color: rival.color }}>{rival.name}</span>
        </div>

        {/* İstatistikler */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "11px", color: "#a0b4c8" }}>
          <span>💰 Altın: {Math.floor(rival.gold)}</span>
          <span>⚡ Enerji: {Math.floor(rival.energy)}</span>
          <span>🏗️ Bina: {rival.buildingCount}</span>
          <span>🔬 Teknoloji: Lv.{rival.techLevel}</span>
          <span>📊 Pazar: %{(rival.marketShare * 100).toFixed(0)}</span>
          <span>💲 Fiyat: ${rival.energyPrice.toFixed(1)}</span>
        </div>

        {/* İtibar barı */}
        <div style={{ marginTop: "6px" }}>
          <div style={{ fontSize: "10px", color: "#8899aa", marginBottom: "2px" }}>İtibar: {rival.reputation}/100</div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${rival.reputation}%`, background: rival.color, borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Son eylem */}
        <div style={{ marginTop: "6px", fontSize: "10px", color: "#88aacc", fontStyle: "italic" }}>
          📋 {rival.lastAction}
        </div>
      </div>
    );
  } catch (e) {
    console.error("[RivalCard] Render hatası:", e);
    return null;
  }
}

export function RivalsPanel() {
  const { rivals, showRivalsPanel, toggleRivalsPanel } = useGameState();

  if (!showRivalsPanel) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "380px",
        maxHeight: "80vh",
        background: "linear-gradient(135deg, #0a1628 0%, #12233d 100%)",
        border: "1px solid rgba(255, 184, 0, 0.3)",
        borderRadius: "12px",
        zIndex: 40,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Başlık */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255, 184, 0, 0.15)",
          background: "rgba(255, 184, 0, 0.05)",
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFB800", letterSpacing: "1px" }}>
          🏢 RAKİP ŞİRKETLER
        </span>
        <button
          onClick={toggleRivalsPanel}
          style={{
            background: "rgba(255,60,60,0.2)",
            border: "1px solid rgba(255,60,60,0.3)",
            borderRadius: "6px",
            color: "#ff6666",
            cursor: "pointer",
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          ✕
        </button>
      </div>

      {/* Rakip listesi */}
      <div style={{ padding: "12px 16px", overflowY: "auto", maxHeight: "60vh" }}>
        {rivals && rivals.length > 0 ? (
          rivals.map((r) => <RivalCard key={r.id} rival={r} />)
        ) : (
          <div style={{ color: "#556677", textAlign: "center", padding: "20px", fontSize: "13px" }}>
            Henüz rakip yok
          </div>
        )}

        {/* Pazar payı özeti */}
        {rivals && rivals.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "rgba(255, 184, 0, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 184, 0, 0.15)",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#FFB800", marginBottom: "6px" }}>
              📊 PAZAR PAYI DAĞILIMI
            </div>
            <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", gap: "1px" }}>
              {/* Oyuncunun payı */}
              <div
                style={{
                  flex: Math.max(0.1, 1 - rivals.reduce((sum, r) => sum + r.marketShare, 0)),
                  background: "#3498db",
                  borderRadius: "2px",
                }}
                title="Siz"
              />
              {rivals.map((r) => (
                <div
                  key={r.id}
                  style={{
                    flex: r.marketShare,
                    background: r.color,
                    borderRadius: "2px",
                  }}
                  title={r.name}
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "9px", color: "#8899aa" }}>
              <span style={{ color: "#3498db" }}>● Siz</span>
              {rivals.map((r) => (
                <span key={r.id} style={{ color: r.color }}>● {r.name.split(" ")[0]}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

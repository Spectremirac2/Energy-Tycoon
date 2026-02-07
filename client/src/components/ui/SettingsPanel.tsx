/**
 * Ayarlar paneli.
 * Ses, kayıt/yükleme ve başarımları gösterir.
 */
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { AchievementsPanel } from "./AchievementsPanel";

/** @description Ayarlar paneli bileşeni */
export function SettingsPanel() {
  const {
    showSettingsPanel,
    toggleSettingsPanel,
    saveGame,
    loadGame,
    deleteSave,
    hasSave,
    totalPlayTime,
  } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  if (!showSettingsPanel) return null;

  /** Oyun süresini formatla */
  const formatTime = (seconds: number): string => {
    try {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      if (h > 0) return `${h}s ${m}dk`;
      if (m > 0) return `${m}dk ${s}sn`;
      return `${s}sn`;
    } catch {
      return "0sn";
    }
  };

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          borderBottom: "1px solid #1a2040",
        }}
      >
        <h3 style={{ margin: 0, color: "#e0e8f0", fontSize: "16px" }}>⚙️ AYARLAR</h3>
        <button
          onClick={toggleSettingsPanel}
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

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* Oyun süresi */}
        <div
          style={{
            background: "rgba(30, 40, 60, 0.5)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "10px", color: "#888", marginBottom: "4px" }}>TOPLAM OYUN SÜRESİ</div>
          <div style={{ fontSize: "18px", color: "#e0e8f0", fontWeight: 700 }}>
            ⏱️ {formatTime(totalPlayTime)}
          </div>
        </div>

        {/* Ses ayarları */}
        <Section title="🔊 Ses">
          <button
            onClick={toggleMute}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${isMuted ? "#e74c3c40" : "#2ECC7140"}`,
              background: isMuted ? "rgba(231, 76, 60, 0.1)" : "rgba(46, 204, 113, 0.1)",
              color: isMuted ? "#e74c3c" : "#2ECC71",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isMuted ? "🔇 Ses Kapalı — Aç" : "🔊 Ses Açık — Kapat"}
          </button>
        </Section>

        {/* Kaydetme / Yükleme */}
        <Section title="💾 Kayıt Yönetimi">
          <div style={{ display: "grid", gap: "8px" }}>
            <button onClick={saveGame} style={btnStyle("#3498db")}>
              💾 Oyunu Kaydet
            </button>
            <button
              onClick={() => {
                if (hasSave()) loadGame();
              }}
              disabled={!hasSave()}
              style={btnStyle(hasSave() ? "#2ECC71" : "#333")}
            >
              📂 Kayıttan Yükle
            </button>
            <button
              onClick={() => {
                if (hasSave() && confirm("Kayıt silinecek. Emin misiniz?")) {
                  deleteSave();
                }
              }}
              disabled={!hasSave()}
              style={btnStyle(hasSave() ? "#e74c3c" : "#333")}
            >
              🗑️ Kaydı Sil
            </button>
          </div>
          <div style={{ fontSize: "9px", color: "#666", marginTop: "6px", textAlign: "center" }}>
            Otomatik kaydetme: her 60 saniyede bir
          </div>
        </Section>

        {/* Başarımlar */}
        <Section title="🏆 Başarımlar">
          <AchievementsPanel />
        </Section>
      </div>
    </div>
  );
}

/** @description Bölüm wrapper bileşeni */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          fontSize: "12px",
          color: "#ccc",
          fontWeight: 700,
          marginBottom: "8px",
          paddingBottom: "4px",
          borderBottom: "1px solid #1a2040",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/** @description Buton stili yardımcı fonksiyonu */
function btnStyle(color: string): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: `1px solid ${color}40`,
    background: `${color}15`,
    color: color === "#333" ? "#555" : color,
    fontSize: "12px",
    fontWeight: 600,
    cursor: color === "#333" ? "not-allowed" : "pointer",
  };
}

import { useGameState } from "@/lib/stores/useGameState";

export function EconomicPanel() {
  const {
    showEconomicPanel, toggleEconomicPanel, gold, energy, energyCapacity,
    goldPerSecond, energyPerSecond, buildings, employees,
    gamingCompanyLevel, gamingCompanyRevenue, unlockedMines,
  } = useGameState();

  if (!showEconomicPanel) return null;

  const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);
  const buildingsByType = buildings.reduce((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeNames: Record<string, string> = {
    solar_panel: "Güneş Paneli",
    wind_turbine: "Rüzgar Türbini",
    power_station: "Enerji Santrali",
    gold_mine: "Altın Madeni",
    gaming_office: "Oyun Ofisi",
  };

  const typeIcons: Record<string, string> = {
    solar_panel: "☀️",
    wind_turbine: "🌬️",
    power_station: "🏭",
    gold_mine: "⛏️",
    gaming_office: "🎮",
  };

  return (
    <div style={{
      position: "fixed",
      left: "12px",
      top: "80px",
      bottom: "80px",
      zIndex: 20,
      fontFamily: "'Rajdhani', sans-serif",
      overflowY: "auto",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(15,32,39,0.95), rgba(230,126,34,0.15))",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(230,126,34,0.3)",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        width: "300px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, color: "#E67E22", fontSize: "16px", fontWeight: 700, letterSpacing: "2px" }}>
            📊 EKONOMİ
          </h3>
          <button onClick={toggleEconomicPanel} style={{
            background: "rgba(231,76,60,0.3)",
            border: "1px solid rgba(231,76,60,0.5)",
            borderRadius: "4px",
            color: "#e74c3c",
            cursor: "pointer",
            padding: "4px 10px",
            fontSize: "14px",
          }}>✕</button>
        </div>

        <Section title="💰 Kaynaklar">
          <StatRow label="Altın" value={`${Math.floor(gold)}`} color="#FFD700" />
          <StatRow label="Altın Geliri" value={`${goldPerSecond >= 0 ? "+" : ""}${goldPerSecond.toFixed(1)}/s`} color={goldPerSecond >= 0 ? "#2ECC71" : "#e74c3c"} />
          <StatRow label="Enerji" value={`${Math.floor(energy)}/${energyCapacity}`} color="#4fc3f7" />
          <StatRow label="Enerji Üretimi" value={`${energyPerSecond >= 0 ? "+" : ""}${energyPerSecond.toFixed(1)}/s`} color={energyPerSecond >= 0 ? "#2ECC71" : "#e74c3c"} />
        </Section>

        <Section title="🏢 Binalar">
          {Object.entries(buildingsByType).map(([type, count]) => (
            <StatRow key={type} label={`${typeIcons[type]} ${typeNames[type]}`} value={`${count}`} color="#e0e8f0" />
          ))}
          {buildings.length === 0 && (
            <div style={{ fontSize: "11px", color: "#666", fontStyle: "italic" }}>Henüz bina yok</div>
          )}
        </Section>

        <Section title="⛏️ Madenler">
          <StatRow label="Fethedilen" value={`${unlockedMines.length}/4`} color="#FFB800" />
          <StatRow label="Maden Geliri" value={`+${unlockedMines.length * 5}/s`} color="#2ECC71" />
        </Section>

        <Section title="🎮 Oyun Şirketi">
          <StatRow label="Seviye" value={`${gamingCompanyLevel}`} color="#FFB800" />
          <StatRow label="Gelir" value={`${gamingCompanyRevenue.toFixed(1)}/s`} color="#2ECC71" />
          <StatRow label="Çalışanlar" value={`${employees.length}`} color="#e0e8f0" />
          <StatRow label="Maaşlar" value={`-${totalSalaries}/s`} color="#e74c3c" />
          <StatRow label="Net Kar" value={`${(gamingCompanyRevenue - totalSalaries).toFixed(1)}/s`} color={gamingCompanyRevenue - totalSalaries >= 0 ? "#2ECC71" : "#e74c3c"} />
        </Section>

        <Section title="📈 Toplam">
          <StatRow label="Net Gelir" value={`${goldPerSecond >= 0 ? "+" : ""}${goldPerSecond.toFixed(1)} 💰/s`} color={goldPerSecond >= 0 ? "#2ECC71" : "#e74c3c"} />
          <StatRow label="Toplam Bina" value={`${buildings.length}`} color="#e0e8f0" />
          <StatRow label="Toplam Değer" value={`${Math.floor(gold + buildings.length * 100)}`} color="#FFD700" />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{
        fontSize: "12px",
        fontWeight: 600,
        color: "#FFB800",
        letterSpacing: "1px",
        marginBottom: "6px",
        borderBottom: "1px solid rgba(255,184,0,0.2)",
        paddingBottom: "4px",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12px",
      padding: "2px 0",
    }}>
      <span style={{ color: "#aaa" }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

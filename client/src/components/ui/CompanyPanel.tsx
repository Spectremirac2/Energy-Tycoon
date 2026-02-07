import { useGameState, Employee } from "@/lib/stores/useGameState";

const ROLES: { role: Employee["role"]; name: string; icon: string; salary: number; hireCost: number }[] = [
  { role: "developer", name: "Yazılımcı", icon: "💻", salary: 20, hireCost: 100 },
  { role: "designer", name: "Tasarımcı", icon: "🎨", salary: 15, hireCost: 75 },
  { role: "manager", name: "Yönetici", icon: "📋", salary: 25, hireCost: 125 },
  { role: "marketer", name: "Pazarlamacı", icon: "📢", salary: 18, hireCost: 90 },
];

export function CompanyPanel() {
  const {
    showCompanyPanel, toggleCompanyPanel, gold, employees,
    gamingCompanyLevel, gamingCompanyRevenue, hireEmployee,
    fireEmployee, upgradeGamingCompany,
  } = useGameState();

  if (!showCompanyPanel) return null;

  const upgradeCost = (gamingCompanyLevel + 1) * 500;
  const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <div style={{
      position: "fixed",
      right: "12px",
      top: "80px",
      bottom: "80px",
      zIndex: 20,
      fontFamily: "'Rajdhani', sans-serif",
      overflowY: "auto",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(15,32,39,0.95), rgba(46,204,113,0.15))",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(46,204,113,0.3)",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        width: "320px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, color: "#2ECC71", fontSize: "16px", fontWeight: 700, letterSpacing: "2px" }}>
            🎮 OYUN ŞİRKETİ
          </h3>
          <button onClick={toggleCompanyPanel} style={{
            background: "rgba(231,76,60,0.3)",
            border: "1px solid rgba(231,76,60,0.5)",
            borderRadius: "4px",
            color: "#e74c3c",
            cursor: "pointer",
            padding: "4px 10px",
            fontSize: "14px",
          }}>✕</button>
        </div>

        <div style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "12px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#aaa", fontSize: "12px" }}>Şirket Seviyesi</span>
            <span style={{ color: "#FFB800", fontWeight: 700 }}>Lv. {gamingCompanyLevel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#aaa", fontSize: "12px" }}>Gelir</span>
            <span style={{ color: "#2ECC71", fontWeight: 700 }}>{gamingCompanyRevenue.toFixed(1)} 💰/s</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#aaa", fontSize: "12px" }}>Maaşlar</span>
            <span style={{ color: "#e74c3c", fontWeight: 700 }}>-{totalSalaries} 💰/s</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#aaa", fontSize: "12px" }}>Net Kar</span>
            <span style={{ color: gamingCompanyRevenue - totalSalaries >= 0 ? "#2ECC71" : "#e74c3c", fontWeight: 700 }}>
              {(gamingCompanyRevenue - totalSalaries).toFixed(1)} 💰/s
            </span>
          </div>
        </div>

        <button
          onClick={upgradeGamingCompany}
          disabled={gold < upgradeCost}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            fontWeight: 700,
            color: gold >= upgradeCost ? "#0F2027" : "#666",
            background: gold >= upgradeCost ? "linear-gradient(135deg, #2ECC71, #27ae60)" : "rgba(50,50,50,0.5)",
            border: "none",
            borderRadius: "6px",
            cursor: gold >= upgradeCost ? "pointer" : "not-allowed",
            marginBottom: "16px",
            transition: "all 0.2s ease",
          }}
        >
          ⬆️ Şirketi Yükselt (💰 {upgradeCost})
        </button>

        <h4 style={{ color: "#FFB800", fontSize: "13px", marginBottom: "8px", letterSpacing: "1px" }}>
          İŞE AL
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "16px" }}>
          {ROLES.map((r) => (
            <button
              key={r.role}
              onClick={() => hireEmployee(r.role)}
              disabled={gold < r.hireCost}
              style={{
                background: gold >= r.hireCost ? "rgba(52,73,94,0.5)" : "rgba(30,30,30,0.5)",
                border: "1px solid rgba(255,184,0,0.2)",
                borderRadius: "6px",
                padding: "8px",
                cursor: gold >= r.hireCost ? "pointer" : "not-allowed",
                opacity: gold >= r.hireCost ? 1 : 0.5,
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "20px" }}>{r.icon}</div>
              <div style={{ fontSize: "11px", color: "#e0e8f0", fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: "10px", color: "#FFD700" }}>💰 {r.hireCost}</div>
              <div style={{ fontSize: "9px", color: "#aaa" }}>Maaş: {r.salary}/s</div>
            </button>
          ))}
        </div>

        {employees.length > 0 && (
          <>
            <h4 style={{ color: "#FFB800", fontSize: "13px", marginBottom: "8px", letterSpacing: "1px" }}>
              ÇALIŞANLAR ({employees.length})
            </h4>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {employees.map((emp) => (
                <div key={emp.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  marginBottom: "4px",
                  fontSize: "12px",
                }}>
                  <div>
                    <span style={{ color: "#e0e8f0", fontWeight: 600 }}>{emp.name}</span>
                    <span style={{ color: "#aaa", marginLeft: "8px" }}>
                      {emp.role === "developer" ? "💻" : emp.role === "designer" ? "🎨" : emp.role === "manager" ? "📋" : "📢"}
                    </span>
                    <div style={{ fontSize: "10px", color: "#aaa" }}>
                      Verimlilik: {(emp.productivity * 100).toFixed(0)}% | Maaş: {emp.salary}/s
                    </div>
                  </div>
                  <button
                    onClick={() => fireEmployee(emp.id)}
                    style={{
                      background: "rgba(231,76,60,0.3)",
                      border: "1px solid rgba(231,76,60,0.4)",
                      borderRadius: "4px",
                      color: "#e74c3c",
                      cursor: "pointer",
                      padding: "2px 8px",
                      fontSize: "11px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

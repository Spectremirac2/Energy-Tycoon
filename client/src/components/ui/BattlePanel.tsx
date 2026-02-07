import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { useState, useEffect } from "react";

export function BattlePanel() {
  const { phase, battleState, attackInBattle, endBattle } = useGameState();
  const { playHit, playSuccess } = useAudio();
  const [attackCooldown, setAttackCooldown] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeEnemy, setShakeEnemy] = useState(false);

  if (phase !== "battle" || !battleState.active) return null;

  const playerHealthPct = Math.max(0, (battleState.playerHealth / (100 + 50)) * 100);
  const enemyHealthPct = Math.max(0, (battleState.enemyHealth / (80 + 60)) * 100);

  const handleAttack = () => {
    if (attackCooldown) return;
    setAttackCooldown(true);
    setShakeEnemy(true);

    const prevEnemyHealth = battleState.enemyHealth;
    const prevPlayerHealth = battleState.playerHealth;
    attackInBattle();
    playHit();

    const dmgDealt = Math.floor(prevEnemyHealth - useGameState.getState().battleState.enemyHealth);
    const dmgTaken = Math.floor(prevPlayerHealth - useGameState.getState().battleState.playerHealth);

    setLastAction(`⚔️ ${dmgDealt} hasar verdin | 🛡️ ${dmgTaken} hasar aldın`);

    setTimeout(() => {
      setShakeEnemy(false);
      setShakePlayer(true);
      setTimeout(() => setShakePlayer(false), 200);
    }, 200);

    setTimeout(() => setAttackCooldown(false), 800);
  };

  const handleFlee = () => {
    endBattle(false);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.85)",
      zIndex: 50,
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(15,32,39,0.98), rgba(26,95,122,0.95))",
        border: "2px solid rgba(255,184,0,0.4)",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "600px",
        width: "90vw",
        boxShadow: "0 0 60px rgba(230,126,34,0.3), 0 8px 32px rgba(0,0,0,0.5)",
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#E67E22",
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "3px",
          margin: "0 0 24px",
          textShadow: "0 0 20px rgba(230,126,34,0.5)",
        }}>
          ⚔️ SAVAŞ ⚔️
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
          <div style={{
            flex: 1,
            textAlign: "center",
            transform: shakePlayer ? "translateX(-5px)" : "none",
            transition: "transform 0.1s",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🏰</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#4fc3f7", marginBottom: "4px" }}>SEN</div>
            <div style={{
              background: "rgba(0,0,0,0.4)",
              borderRadius: "6px",
              overflow: "hidden",
              height: "20px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{
                height: "100%",
                width: `${playerHealthPct}%`,
                background: playerHealthPct > 50 ? "linear-gradient(90deg, #2ECC71, #27ae60)" : playerHealthPct > 25 ? "linear-gradient(90deg, #f39c12, #e67e22)" : "linear-gradient(90deg, #e74c3c, #c0392b)",
                transition: "width 0.3s ease",
                borderRadius: "4px",
              }} />
            </div>
            <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
              ❤️ {Math.floor(battleState.playerHealth)} | ⚔️ {Math.floor(battleState.playerAttack)}
            </div>
          </div>

          <div style={{ fontSize: "32px", color: "#E67E22" }}>VS</div>

          <div style={{
            flex: 1,
            textAlign: "center",
            transform: shakeEnemy ? "translateX(5px)" : "none",
            transition: "transform 0.1s",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>👹</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#e74c3c", marginBottom: "4px" }}>YERLİ SAVAŞÇI</div>
            <div style={{
              background: "rgba(0,0,0,0.4)",
              borderRadius: "6px",
              overflow: "hidden",
              height: "20px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{
                height: "100%",
                width: `${enemyHealthPct}%`,
                background: enemyHealthPct > 50 ? "linear-gradient(90deg, #e74c3c, #c0392b)" : "linear-gradient(90deg, #e67e22, #d35400)",
                transition: "width 0.3s ease",
                borderRadius: "4px",
              }} />
            </div>
            <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
              ❤️ {Math.floor(battleState.enemyHealth)} | ⚔️ {Math.floor(battleState.enemyAttack)}
            </div>
          </div>
        </div>

        {lastAction && (
          <div style={{
            textAlign: "center",
            padding: "8px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#FFB800",
          }}>
            {lastAction}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={handleAttack}
            disabled={attackCooldown}
            style={{
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              background: attackCooldown ? "rgba(100,100,100,0.5)" : "linear-gradient(135deg, #e74c3c, #c0392b)",
              border: "1px solid rgba(231,76,60,0.5)",
              borderRadius: "8px",
              cursor: attackCooldown ? "not-allowed" : "pointer",
              letterSpacing: "1px",
              boxShadow: attackCooldown ? "none" : "0 0 20px rgba(231,76,60,0.3)",
              transition: "all 0.2s ease",
            }}
          >
            ⚔️ SALDIRI
          </button>
          <button
            onClick={handleFlee}
            style={{
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#aaa",
              background: "rgba(52,73,94,0.5)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              cursor: "pointer",
              letterSpacing: "1px",
              transition: "all 0.2s ease",
            }}
          >
            🏃 KAÇIŞ
          </button>
        </div>
      </div>
    </div>
  );
}

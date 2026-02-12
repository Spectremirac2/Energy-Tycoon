/**
 * Ticaret Paneli - Şehir ile ticaret yapma arayüzü.
 * Enerji satma, banka, market işlemleri.
 */
import { useState, useEffect } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { TRADE_CONFIG, getRegionAt } from "@/lib/gameConfig";

/** Piyasa fiyatı hesapla (dalgalanan) */
function getMarketPrice(tick: number): number {
  try {
    const base = TRADE_CONFIG.BASE_ENERGY_PRICE;
    const variance = TRADE_CONFIG.PRICE_VARIANCE;
    const wave = Math.sin(tick * 0.01) * variance;
    return Math.max(0.5, base + wave);
  } catch {
    return TRADE_CONFIG.BASE_ENERGY_PRICE;
  }
}

export function TradePanel() {
  const {
    gold, energy, dayTime, playerPosition,
    showTradePanel, toggleTradePanel,
  } = useGameState();
  const setGold = useGameState((s) => s.setGold);
  const setEnergy = useGameState((s) => s.setEnergy);
  const [sellAmount, setSellAmount] = useState(10);
  const [bankDeposit, setBankDeposit] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [activeBuffs, setActiveBuffs] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [priceTick, setPriceTick] = useState(0);

  // Fiyat dalgalanması için sayaç
  useEffect(() => {
    if (!showTradePanel) return;
    const interval = setInterval(() => {
      setPriceTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [showTradePanel]);

  const price = getMarketPrice(priceTick + Math.floor(dayTime * 100));
  const isNearCity = playerPosition
    ? getRegionAt(playerPosition[0], playerPosition[2])?.id === "city"
    : false;

  // Banka faizi
  useEffect(() => {
    if (bankBalance <= 0) return;
    const interval = setInterval(() => {
      setBankBalance((b) => b * (1 + TRADE_CONFIG.BANK_INTEREST_RATE));
    }, 1000);
    return () => clearInterval(interval);
  }, [bankBalance]);

  if (!showTradePanel) return null;

  /** Enerji sat */
  const handleSellEnergy = () => {
    try {
      if (energy < sellAmount) {
        setMessage("Yeterli enerji yok!");
        return;
      }
      const earnings = Math.floor(sellAmount * price);
      setEnergy(energy - sellAmount);
      setGold(gold + earnings);
      setMessage(`${sellAmount} enerji satıldı → +${earnings} altın`);
    } catch (e) {
      setMessage("Satış hatası!");
      console.error("[TradePanel] Satış hatası:", e);
    }
  };

  /** Bankaya yatır */
  const handleDeposit = () => {
    try {
      if (gold < bankDeposit || bankDeposit <= 0) {
        setMessage("Yeterli altın yok!");
        return;
      }
      setGold(gold - bankDeposit);
      setBankBalance((b) => b + bankDeposit);
      setMessage(`${bankDeposit} altın bankaya yatırıldı`);
    } catch (e) {
      setMessage("Yatırım hatası!");
      console.error("[TradePanel] Yatırım hatası:", e);
    }
  };

  /** Bankadan çek */
  const handleWithdraw = () => {
    try {
      const amount = Math.floor(bankBalance);
      if (amount <= 0) {
        setMessage("Bankada para yok!");
        return;
      }
      setBankBalance(0);
      setGold(gold + amount);
      setMessage(`${amount} altın bankadan çekildi`);
    } catch (e) {
      setMessage("Çekme hatası!");
      console.error("[TradePanel] Çekme hatası:", e);
    }
  };

  /** Market satın al */
  const handleBuyBuff = (itemId: string) => {
    try {
      const item = TRADE_CONFIG.MARKET_ITEMS.find((m) => m.id === itemId);
      if (!item) return;
      if (gold < item.cost) {
        setMessage("Yeterli altın yok!");
        return;
      }
      if (activeBuffs.includes(itemId)) {
        setMessage("Bu buff zaten aktif!");
        return;
      }
      setGold(gold - item.cost);
      setActiveBuffs((prev) => [...prev, itemId]);
      setMessage(`${item.name} satın alındı! ${item.duration}sn aktif.`);
      setTimeout(() => {
        setActiveBuffs((prev) => prev.filter((id) => id !== itemId));
      }, item.duration * 1000);
    } catch (e) {
      setMessage("Satın alma hatası!");
      console.error("[TradePanel] Satın alma hatası:", e);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        border: "2px solid #f39c12",
        borderRadius: "16px",
        padding: "24px",
        minWidth: "420px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        overflowY: "auto",
        color: "#fff",
        fontFamily: "'Rajdhani', sans-serif",
        zIndex: 1000,
        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(243,156,18,0.15)",
        pointerEvents: "auto",
      }}
    >
      {/* Başlık */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>🏙️ Ticaret Şehri</h2>
        <button
          onClick={toggleTradePanel}
          style={{
            background: "#e94560",
            border: "none",
            color: "#fff",
            borderRadius: "8px",
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: "'Rajdhani', sans-serif",
          }}
        >
          ✕ Kapat
        </button>
      </div>

      {!isNearCity && (
        <div style={{ background: "rgba(255,165,0,0.2)", padding: "10px", borderRadius: "8px", marginBottom: "12px", textAlign: "center", fontSize: "13px" }}>
          ⚠️ Ticaret yapmak için Ticaret Şehri'ne yaklaş! (Haritanın kuzey-doğusu)
        </div>
      )}

      {/* Enerji Borsası */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}>📈 Enerji Borsası</h3>
        <div style={{ fontSize: "13px", marginBottom: "8px" }}>
          Piyasa fiyatı: <strong style={{ color: "#FFD700" }}>{price.toFixed(2)} altın/enerji</strong>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="number"
            value={sellAmount}
            onChange={(e) => setSellAmount(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              background: "#1a1a2e",
              border: "1px solid #555",
              color: "#fff",
              borderRadius: "6px",
              padding: "6px 8px",
              width: "80px",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          />
          <button
            onClick={handleSellEnergy}
            disabled={!isNearCity}
            style={{
              background: isNearCity ? "#4CAF50" : "#555",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              padding: "6px 14px",
              cursor: isNearCity ? "pointer" : "not-allowed",
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
            }}
          >
            Sat → {Math.floor(sellAmount * price)} altın
          </button>
        </div>
      </div>

      {/* Banka */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}>🏦 Banka</h3>
        <div style={{ fontSize: "13px", marginBottom: "8px" }}>
          Bakiye: <strong style={{ color: "#FFD700" }}>{Math.floor(bankBalance)} altın</strong>{" "}
          (faiz: %{(TRADE_CONFIG.BANK_INTEREST_RATE * 100).toFixed(1)}/sn)
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
          <input
            type="number"
            value={bankDeposit}
            onChange={(e) => setBankDeposit(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              background: "#1a1a2e",
              border: "1px solid #555",
              color: "#fff",
              borderRadius: "6px",
              padding: "6px 8px",
              width: "80px",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          />
          <button
            onClick={handleDeposit}
            disabled={!isNearCity}
            style={{
              background: isNearCity ? "#2196F3" : "#555",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              padding: "6px 14px",
              cursor: isNearCity ? "pointer" : "not-allowed",
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
            }}
          >
            Yatır
          </button>
          <button
            onClick={handleWithdraw}
            disabled={!isNearCity}
            style={{
              background: isNearCity ? "#FF9800" : "#555",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              padding: "6px 14px",
              cursor: isNearCity ? "pointer" : "not-allowed",
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
            }}
          >
            Çek ({Math.floor(bankBalance)})
          </button>
        </div>
      </div>

      {/* Market */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}>🏪 Market</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {TRADE_CONFIG.MARKET_ITEMS.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <div>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{item.icon} {item.name}</span>
                <div style={{ fontSize: "11px", color: "#aaa" }}>{item.description}</div>
              </div>
              <button
                onClick={() => handleBuyBuff(item.id)}
                disabled={!isNearCity || activeBuffs.includes(item.id)}
                style={{
                  background: activeBuffs.includes(item.id)
                    ? "#444"
                    : isNearCity
                    ? "#e94560"
                    : "#555",
                  border: "none",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  cursor: isNearCity && !activeBuffs.includes(item.id) ? "pointer" : "not-allowed",
                  fontSize: "12px",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                }}
              >
                {activeBuffs.includes(item.id) ? "Aktif ✓" : `${item.cost} 💰`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aktif Buff'lar */}
      {activeBuffs.length > 0 && (
        <div style={{ background: "rgba(46,204,113,0.1)", borderRadius: "8px", padding: "8px 12px", marginBottom: "12px", fontSize: "12px" }}>
          ✨ Aktif: {activeBuffs.map((id) => {
            const item = TRADE_CONFIG.MARKET_ITEMS.find((m) => m.id === id);
            return item ? `${item.icon} ${item.name}` : id;
          }).join(", ")}
        </div>
      )}

      {/* Mesaj */}
      {message && (
        <div
          style={{
            background: "rgba(255,215,0,0.15)",
            borderRadius: "8px",
            padding: "8px",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

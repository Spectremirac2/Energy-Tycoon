import { useGameState } from "@/lib/stores/useGameState";

export function MainMenu() {
  const { startGame } = useGameState();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F2027 0%, #1A5F7A 50%, #0F2027 100%)",
        fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 30% 40%, rgba(255,184,0,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(26,95,122,0.15) 0%, transparent 50%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "6px",
            color: "#FFB800",
            textTransform: "uppercase",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          Çuhadar Enerji Presents
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 900,
            color: "#fff",
            textShadow: "0 0 40px rgba(26,95,122,0.6), 0 0 80px rgba(255,184,0,0.3)",
            margin: "0 0 8px",
            lineHeight: 1.1,
          }}
        >
          CUHADAR ENERJİ
        </h1>
        <h2
          style={{
            fontSize: "clamp(20px, 3vw, 36px)",
            fontWeight: 300,
            color: "#FFB800",
            textShadow: "0 0 20px rgba(255,184,0,0.4)",
            margin: "0 0 32px",
            letterSpacing: "4px",
          }}
        >
          S I M U L A T O R
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          {[
            { icon: "⚡", text: "Enerji imparatorluğunu kur" },
            { icon: "⛏️", text: "Altın madenlerini fethet" },
            { icon: "🎮", text: "Oyun şirketini büyüt" },
            { icon: "⚔️", text: "Yerlilerle savaş" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#b0c4de",
                fontSize: "16px",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={startGame}
          style={{
            padding: "16px 64px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#0F2027",
            background: "linear-gradient(135deg, #FFB800, #E67E22)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            letterSpacing: "3px",
            textTransform: "uppercase",
            boxShadow: "0 0 30px rgba(255,184,0,0.4), 0 4px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1.05)";
            (e.target as HTMLElement).style.boxShadow = "0 0 50px rgba(255,184,0,0.6), 0 6px 20px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1)";
            (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(255,184,0,0.4), 0 4px 15px rgba(0,0,0,0.3)";
          }}
        >
          Oyuna Başla
        </button>

        <div
          style={{
            marginTop: "32px",
            color: "#5a7a8a",
            fontSize: "12px",
            letterSpacing: "2px",
          }}
        >
          cuhadarenerji.com • Sustainable Energy Solutions
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}

/**
 * Tutorial / Rehber overlay bileşeni.
 * Yeni oyunculara oyunun temel mekaniklerini adım adım öğretir.
 */
import { useGameState } from "@/lib/stores/useGameState";

interface TutorialStep {
  title: string;
  message: string;
  icon: string;
  hint?: string;
}

const STEPS: TutorialStep[] = [
  {
    title: "Energy Tycoon'a Hoş Geldiniz!",
    message: "Bu oyunda enerji imparatorluğunuzu kuracak, altın madenleri fethidecek ve oyun şirketinizi büyüteceksiniz.",
    icon: "⚡",
    hint: "Devam etmek için 'İleri' butonuna tıklayın.",
  },
  {
    title: "Hareket",
    message: "WASD veya yön tuşları ile karakterinizi hareket ettirin. Dünyayı keşfetmek için etrafta gezinin.",
    icon: "🎮",
    hint: "W=İleri, S=Geri, A=Sol, D=Sağ",
  },
  {
    title: "Bina İnşaatı",
    message: "Sol alttaki 'İnşa Et' butonuna tıklayın ve bir bina türü seçin. Ardından haritada uygun bir yere tıklayarak binayı yerleştirin.",
    icon: "🏗️",
    hint: "İlk binanız olarak Güneş Paneli önerilir (50 altın).",
  },
  {
    title: "Enerji ve Altın",
    message: "Enerji binaları enerji üretir; Altın Madeni ve Oyun Ofisi altın üretir ama enerji harcar. Dengeyi sağlayın!",
    icon: "💰",
    hint: "Üretim oranlarını sol üst köşedeki HUD'dan takip edin.",
  },
  {
    title: "Maden Fethi",
    message: "Haritadaki altın madenlerine yaklaşın ve savaşarak fethedin. Fethedilen madenler pasif gelir sağlar.",
    icon: "⛏️",
    hint: "Daha fazla bina ve çalışan = Daha güçlü savaş gücü.",
  },
  {
    title: "Teknoloji ve Büyüme",
    message: "Teknoloji panelinden yeni teknolojiler araştırın. Şirket panelinden çalışan işe alın ve şirketinizi büyütün.",
    icon: "🔬",
    hint: "Her şey hazır! İmparatorluğunuzu kurmaya başlayın!",
  },
];

/** @description Tutorial overlay bileşeni */
export function TutorialOverlay() {
  const { tutorialStep, nextTutorialStep, skipTutorial, tutorialCompleted } = useGameState();

  if (tutorialStep <= 0 || tutorialCompleted) return null;
  const stepIdx = tutorialStep - 1;
  if (stepIdx >= STEPS.length) return null;

  const step = STEPS[stepIdx];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.6)",
        zIndex: 8000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        style={{
          background: "rgba(10, 15, 30, 0.98)",
          border: "1px solid #2a3a5a",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "440px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* İkon */}
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>{step.icon}</div>

        {/* Adım numarası */}
        <div style={{ fontSize: "10px", color: "#666", marginBottom: "8px", letterSpacing: "2px" }}>
          ADIM {tutorialStep} / {STEPS.length}
        </div>

        {/* Başlık */}
        <h2 style={{ margin: "0 0 12px", color: "#e0e8f0", fontSize: "20px", fontWeight: 700 }}>
          {step.title}
        </h2>

        {/* Mesaj */}
        <p style={{ color: "#aaa", fontSize: "13px", lineHeight: 1.6, margin: "0 0 12px" }}>
          {step.message}
        </p>

        {/* İpucu */}
        {step.hint && (
          <div
            style={{
              background: "rgba(52, 152, 219, 0.1)",
              border: "1px solid rgba(52, 152, 219, 0.3)",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "11px",
              color: "#3498db",
              marginBottom: "20px",
            }}
          >
            💡 {step.hint}
          </div>
        )}

        {/* İlerleme çubukları */}
        <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "20px" }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: "24px",
                height: "3px",
                borderRadius: "2px",
                background: i < tutorialStep ? "#3498db" : "#333",
              }}
            />
          ))}
        </div>

        {/* Butonlar */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={skipTutorial}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "transparent",
              color: "#888",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Atla
          </button>
          <button
            onClick={nextTutorialStep}
            style={{
              padding: "10px 28px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #3498db, #2980b9)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
            }}
          >
            {stepIdx === STEPS.length - 1 ? "Başla! 🚀" : "İleri →"}
          </button>
        </div>
      </div>
    </div>
  );
}

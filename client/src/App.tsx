import { Suspense, useEffect } from "react";
import { useGameState } from "./lib/stores/useGameState";
import { useAudio } from "./lib/stores/useAudio";
import { MainMenu } from "./components/ui/MainMenu";
import { GameWorld } from "./components/game/GameWorld";
import { GameHUD } from "./components/ui/GameHUD";
import { BuildPanel } from "./components/ui/BuildPanel";
import { BattlePanel } from "./components/ui/BattlePanel";
import { CompanyPanel } from "./components/ui/CompanyPanel";
import { EconomicPanel } from "./components/ui/EconomicPanel";
import { NotificationToast } from "./components/ui/NotificationToast";
import { TechPanel } from "./components/ui/TechPanel";
import { TutorialOverlay } from "./components/ui/TutorialOverlay";
import { SettingsPanel } from "./components/ui/SettingsPanel";
import { ActiveEventsBar } from "./components/ui/ActiveEventsBar";
import { Minimap } from "./components/ui/Minimap";
import { RivalsPanel } from "./components/ui/RivalsPanel";
import { StatsPanel } from "./components/ui/StatsPanel";
import { TradePanel } from "./components/ui/TradePanel";
import { VirtualJoystick } from "./components/ui/VirtualJoystick";
import { useIsMobile } from "./hooks/useIsMobile";

function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    setBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.3;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.4;
    setSuccessSound(success);
  }, []);

  return null;
}

function LoadingScreen() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0F2027, #1A5F7A)",
      zIndex: 200,
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "3px solid rgba(255,184,0,0.2)",
          borderTop: "3px solid #FFB800",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px",
        }} />
        <div style={{ color: "#FFB800", fontSize: "18px", fontWeight: 600, letterSpacing: "2px" }}>
          YÜKLENİYOR...
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const { phase } = useGameState();
  const isMobile = useIsMobile();

  useEffect(() => {
    /** Escape tuşuyla tüm panelleri kapat */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        try {
          useGameState.getState().closeAllPanels();
        } catch (err) {
          console.error("Panel kapatma hatası:", err);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <SoundManager />

      {phase === "menu" && <MainMenu />}

      {(phase === "playing" || phase === "battle") && (
        <>
          <Suspense fallback={<LoadingScreen />}>
            <GameWorld />
          </Suspense>
          <GameHUD />
          <BuildPanel />
          <CompanyPanel />
          <EconomicPanel />
          <TechPanel />
          <SettingsPanel />
          <BattlePanel />
          <TutorialOverlay />
          <ActiveEventsBar />
          <Minimap />
          <RivalsPanel />
          <StatsPanel />
          <TradePanel />
          {isMobile && <VirtualJoystick />}
          <NotificationToast />
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}

export default App;

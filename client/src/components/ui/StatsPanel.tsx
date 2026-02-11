/**
 * İstatistik Paneli - Gelir/üretim zaman çizelgesi grafikleri.
 * Canvas tabanlı hafif grafik çizimi (harici kütüphane yok).
 */
import { useRef, useEffect, useCallback, useMemo } from "react";
import { useGameState } from "@/lib/stores/useGameState";

/** Tek bir veri noktası */
interface DataPoint {
  tick: number;
  gold: number;
  energy: number;
  goldPerSec: number;
  energyPerSec: number;
}

/** Canvas boyutları */
const CANVAS_W = 320;
const CANVAS_H = 140;
const PADDING = 30;

/**
 * @description Mini çizgi grafik bileşeni (pure Canvas).
 */
function MiniChart({
  data,
  dataKey,
  color,
  label,
}: {
  data: DataPoint[];
  dataKey: keyof DataPoint;
  color: string;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawChart = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || data.length < 2) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = CANVAS_W * dpr;
      canvas.height = CANVAS_H * dpr;
      ctx.scale(dpr, dpr);

      // Temizle
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Veri aralığını hesapla
      const values = data.map((d) => d[dataKey] as number);
      const minVal = Math.min(...values) * 0.9;
      const maxVal = Math.max(...values) * 1.1 || 1;
      const rangeVal = maxVal - minVal || 1;

      const plotW = CANVAS_W - PADDING * 2;
      const plotH = CANVAS_H - PADDING - 10;

      // Grid çizgileri
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = 10 + (plotH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(PADDING, y);
        ctx.lineTo(CANVAS_W - 10, y);
        ctx.stroke();
      }

      // Y ekseni etiketleri
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "9px Rajdhani";
      ctx.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        const y = 10 + (plotH / 4) * i;
        const val = maxVal - (rangeVal / 4) * i;
        ctx.fillText(val.toFixed(0), PADDING - 4, y + 3);
      }

      // Çizgiyi çiz
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();

      data.forEach((d, i) => {
        const x = PADDING + (i / (data.length - 1)) * plotW;
        const y = 10 + ((maxVal - (d[dataKey] as number)) / rangeVal) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dolgu gradyanı
      const grad = ctx.createLinearGradient(0, 10, 0, CANVAS_H - PADDING);
      grad.addColorStop(0, color + "30");
      grad.addColorStop(1, color + "05");
      ctx.fillStyle = grad;
      ctx.lineTo(PADDING + plotW, 10 + plotH);
      ctx.lineTo(PADDING, 10 + plotH);
      ctx.closePath();
      ctx.fill();

      // Başlık
      ctx.fillStyle = color;
      ctx.font = "bold 11px Rajdhani";
      ctx.textAlign = "left";
      ctx.fillText(label, PADDING, CANVAS_H - 5);

      // Son değer
      const lastVal = values[values.length - 1];
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Rajdhani";
      ctx.textAlign = "right";
      ctx.fillText(lastVal.toFixed(1), CANVAS_W - 10, CANVAS_H - 5);
    } catch (e) {
      console.error("[MiniChart] draw hatası:", e);
    }
  }, [data, dataKey, color, label]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${CANVAS_W}px`,
        height: `${CANVAS_H}px`,
        borderRadius: "6px",
        background: "rgba(0,0,0,0.2)",
        display: "block",
      }}
    />
  );
}

export function StatsPanel() {
  const { statsHistory, showStatsPanel, toggleStatsPanel } = useGameState();

  const data = useMemo(() => {
    try {
      return (statsHistory ?? []).slice(-60);
    } catch {
      return [];
    }
  }, [statsHistory]);

  if (!showStatsPanel) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        maxHeight: "85vh",
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
          📊 İSTATİSTİKLER
        </span>
        <button
          onClick={toggleStatsPanel}
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

      {/* Grafikler */}
      <div style={{ padding: "12px 16px", overflowY: "auto", maxHeight: "70vh" }}>
        {data.length < 2 ? (
          <div style={{ color: "#556677", textAlign: "center", padding: "30px", fontSize: "13px" }}>
            Yeterli veri toplanıyor... ({data.length}/2)
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <MiniChart data={data} dataKey="gold" color="#f1c40f" label="💰 Toplam Altın" />
            <MiniChart data={data} dataKey="energy" color="#3498db" label="⚡ Toplam Enerji" />
            <MiniChart data={data} dataKey="goldPerSec" color="#2ecc71" label="📈 Altın/sn" />
            <MiniChart data={data} dataKey="energyPerSec" color="#e74c3c" label="⚡ Enerji/sn" />
          </div>
        )}
      </div>
    </div>
  );
}

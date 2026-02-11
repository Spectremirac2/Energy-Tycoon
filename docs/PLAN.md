# Energy Tycoon - Gelişmiş Özellikler Planı

## Genel Bakış

Bu plan, Energy Tycoon oyununa altı büyük özellik eklemeyi kapsar:
1. **LOD (Level of Detail)** - Uzaktaki nesneler için basit geometri
2. **Spatial Partitioning (Quadtree)** - O(log n) çarpışma kontrolü
3. **Post-processing Efektleri** - Bloom, SSAO, renk grading
4. **AI Rakip Sistemi** - Yapay zeka enerji şirketleri
5. **İstatistik Grafikleri** - Gelir/üretim zaman çizelgesi
6. **Mobil Dokunmatik Destek** - Joystick ve pinch-zoom

---

## 1. LOD (Level of Detail)

### Yaklaşım
- Drei `<Detailed>` bileşeni ile bina başına 3 seviye geometri
- Mesafe eşikleri: 0-40 (detaylı), 40-80 (orta), 80+ (kutu)
- `PerformanceMonitor` ile adaptif DPR

### Dosya Değişiklikleri
- `client/src/components/game/Buildings.tsx` → LOD wrapper
- `client/src/components/game/GameWorld.tsx` → PerformanceMonitor

---

## 2. Spatial Partitioning (Quadtree)

### Yaklaşım
- Sıfır bağımlılık TypeScript quadtree implementasyonu
- XZ düzleminde 2D bölümleme
- Bina yerleştirme ve çarpışma kontrolü için kullanım

### Dosya Değişiklikleri
- `client/src/lib/Quadtree.ts` → Yeni quadtree sınıfı
- `client/src/components/game/PlacementGrid.tsx` → Quadtree entegrasyonu

---

## 3. Post-processing Efektleri

### Yaklaşım
- `@react-three/postprocessing` (zaten yüklü)
- Bloom → Enerji binaları, altın madenler
- Vignette → Sinematik atmosfer
- ToneMapping → Renk grading
- SSAO → Opsiyonel (ağır, sadece masaüstünde)

### Dosya Değişiklikleri
- `client/src/components/game/GameWorld.tsx` → EffectComposer ekleme

---

## 4. AI Rakip Sistemi

### Yaklaşım
- Utility-Based AI: Her eylem fayda puanı ile değerlendirilir
- 3 rakip şirket, farklı kişilikler (agresif/dengeli/ihtiyatlı)
- Pazar fiyatları üzerinde rekabet etkisi
- Zorluk seviyesi oyuncunun performansına göre ayarlanır

### Dosya Değişiklikleri
- `client/src/lib/AIRival.ts` → AI motor sınıfı
- `client/src/lib/stores/useGameState.tsx` → Rakip durumu
- `client/src/components/ui/RivalsPanel.tsx` → Rakip bilgi paneli

---

## 5. İstatistik Grafikleri

### Yaklaşım
- Recharts (zaten yüklü) ile gelir/üretim zaman çizelgesi
- Tick bazlı veri toplama, son 60 tick saklanır
- ResponsiveContainer ile responsive grafikler

### Dosya Değişiklikleri
- `client/src/lib/stores/useGameState.tsx` → Tarihsel veri dizisi
- `client/src/components/ui/StatsPanel.tsx` → Grafik paneli

---

## 6. Mobil Dokunmatik Destek

### Yaklaşım
- `nipplejs` ile sanal joystick (sol alt köşe)
- Drei `MapControls` ile pinch-zoom desteği
- `useIsMobile()` hook ile responsive UI
- Dokunmatik yapı yerleştirme (tap vs drag ayrımı)

### Yeni Bağımlılıklar
- `nipplejs` (~10KB, 0 dep)

### Dosya Değişiklikleri
- `client/src/hooks/useIsMobile.ts` → Mobil tespit hook
- `client/src/components/ui/VirtualJoystick.tsx` → Joystick bileşeni
- `client/src/lib/stores/useJoystickStore.ts` → Joystick state
- `client/src/components/game/Player.tsx` → Joystick girişi
- `client/src/components/game/GameWorld.tsx` → MapControls
- `client/src/App.tsx` → Joystick render

---

## Uygulama Sırası

1. ✅ Post-processing (hızlı kazanım, görsel etki)
2. ✅ LOD sistemi (performans temeli)
3. ✅ Quadtree (yerleştirme optimizasyonu)
4. ✅ İstatistik grafikleri (UI zenginliği)
5. ✅ AI rakip sistemi (gameplay derinliği)
6. ✅ Mobil dokunmatik destek (erişilebilirlik)
7. ✅ Final build & test

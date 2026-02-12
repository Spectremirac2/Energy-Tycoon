# Energy Tycoon - Büyük Güncelleme Planı: Canlı Dünya & Bölge Sistemi

## Özet
Harita 200→400 birime büyütülecek. Ticaret Şehri, Çiftlik Kasaba ve Orman bölgeleri eklenecek.
Hayvanlar, kuşlar ve böcekler ile dünya canlandırılacak. Bölge yakınlık bonusları ile mekanik derinlik artırılacak.

---

## 1. Harita Büyütme
- [x] `MAP_CONFIG.SIZE` → 400
- [x] `MAP_CONFIG.BOUNDS` → 190
- [x] `MAP_CONFIG.BG_SIZE` → 800
- [x] `MAP_CONFIG.FOG_FAR` → 250
- [x] `MAP_CONFIG.CAMERA_FAR` → 600
- [x] Ağaç/kaya sayısı ve dağılım yarıçapı artır

## 2. Bölge Sistemi (REGIONS)
Her bölge haritada sabit bir konumda, belirli yarıçapta tanımlanır.

| Bölge | Merkez | Yarıçap | Açıklama |
|-------|--------|---------|----------|
| Ticaret Şehri | (80, 0, -70) | 35 | Binalar, NPC, ticaret |
| Çiftlik Kasaba | (-75, 0, 65) | 30 | Tarla, ahır, pazar |
| Orman | (-60, 0, -60) | 40 | Yoğun ağaç, hayvanlar |
| Fabrika Bölgesi | (70, 0, 70) | 25 | Sanayi bonusu |

## 3. Ticaret Şehri
- Şehir binaları (3D): Belediye, Banka, Market, Depo, Konut blokları
- Oyuncu şehire yaklaşınca interaksiyon paneli açılır
- **Ticaret Mekaniği**: Enerji sat → Altın al (piyasa fiyatı ile)
- **Banka**: Altın yatır → faiz kazanç
- **Market**: Özel upgrade/buff satın al
- Şirketi şehire yakın kurarsan: **+%30 gelir bonusu**

## 4. Çiftlik Kasaba
- Tarla, ahır, değirmen, pazar yeri 3D modelleri
- **Gıda Üretimi**: Yeni kaynak türü → çalışan morali
- **Hayvan Çiftliği**: Pasif gelir kaynağı
- Şirketi çiftliğe yakın kurarsan: **-%20 çalışan maaşı**

## 5. Hayvanlar ve Canlılar
- **Koyunlar** (InstancedMesh): Çiftlik yakınında, yavaş hareket
- **İnekler** (InstancedMesh): Çiftlik yakınında, sabit
- **Tavuklar** (InstancedMesh): Çiftlik yakınında, hızlı hareket
- **Kuşlar** (InstancedMesh): Hava, sinüs dalga uçuş
- **Kelebekler** (InstancedMesh): Çiçek alanlarında, rastgele uçuş
- **Geyikler** (InstancedMesh): Orman bölgesinde

## 6. Bölge Bonusları
- Her binanın konumu kontrol edilir → en yakın bölgeye göre bonus
- Şehir yakını: +%30 Altın üretimi
- Çiftlik yakını: -%20 Çalışan maaşı
- Orman yakını: +%20 Enerji üretimi (doğal kaynak)
- Fabrika yakını: +%50 Üretim hızı

## 7. Teknik Detaylar
- Tüm hayvanlar InstancedMesh ile tek draw call
- Basit CPU animasyonu (pozisyon güncellemesi her frame)
- Bölge 3D modelleri basit geometrilerden oluşur (box, cylinder, cone)
- Bölge tespit sistemi: Mesafe hesaplama ile O(1)
- Terrain doku tekrarı büyük haritaya göre ölçeklenir

## 8. Yeni Dosyalar
- `client/src/lib/regions.ts` - Bölge tanımları ve yardımcı fonksiyonlar
- `client/src/components/game/Animals.tsx` - Hayvan bileşenleri
- `client/src/components/game/CityRegion.tsx` - Şehir 3D binalar
- `client/src/components/game/FarmRegion.tsx` - Çiftlik 3D binalar
- `client/src/components/game/ForestRegion.tsx` - Orman yoğunlaştırma
- `client/src/components/ui/TradePanel.tsx` - Ticaret UI

---
*Plan tarihi: 2026-02-07*

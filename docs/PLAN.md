# Cuhadar Enerji Simulator - Bağımsız Uygulama Dönüşüm Planı

## Amaç
Projeyi Replit bağımlılıklarından arındırarak bağımsız, tek tıkla çalışır hale getirmek; Netlify üzerinden web deploy desteği sağlamak.

## Yapılacaklar

### 1. Replit Dosyalarının Silinmesi
- [x] `.replit` - Replit yapılandırma dosyası
- [x] `replit.md` - Replit dokümantasyonu
- [x] `.local/state/replit/` - Replit durum klasörü

### 2. Bağımlılık Temizliği
- [x] `package.json` - `@replit/vite-plugin-runtime-error-modal` kaldırılacak
- [x] `package.json` - proje adı `rest-express` -> `energy-tycoon` olarak değiştirildi
- [x] `cross-env` eklendi (Windows uyumluluğu için)

### 3. Yapılandırma Düzenlemeleri
- [x] `vite.config.ts` - `runtimeErrorOverlay` import ve kullanımı kaldırılacak
- [x] `server/index.ts` - Replit firewall yorumları temizlendi

### 4. Kod Taraması
- [x] Tüm dosyalarda "replit" kelimesi taranacak
- [x] Varsa diğer referanslar temizlenecek
- [x] package-lock.json yeniden oluşturuldu

### 5. Başlatma Scripti
- [x] `npm run dev` ile geliştirme modu
- [x] `npm run build` ile üretim derlemesi (server + client)
- [x] `npm run build:client` ile sadece client derlemesi (Netlify için)
- [x] `npm start` ile üretim sunucusu

### 6. Windows BAT Dosyası
- [x] `start-game.bat` oluşturuldu
- [x] Node.js kontrolü ve bağımlılık otomatik kurulumu
- [x] Geliştirme sunucusunu başlatır (http://localhost:5000)

### 7. Netlify Deploy Konfigürasyonu
- [x] `netlify.toml` oluşturuldu
- [x] SPA redirect kuralı (`/* -> /index.html`)
- [x] Build komutu: `npm run build:client`
- [x] Publish dizini: `dist/public`

## Deployment Rehberi

### Yerel Çalıştırma (Windows)
1. `start-game.bat` dosyasına çift tıklayın
2. Tarayıcıda `http://localhost:5000` adresine gidin

### Netlify Deploy
1. GitHub repo'yu Netlify'a bağlayın
2. Build ayarları otomatik algılanacak (`netlify.toml`)
3. Deploy tamamlandığında paylaşılabilir URL alırsınız

## Sonuç
Proje artık tamamen bağımsız, Windows'ta tek tıkla çalışır ve Netlify üzerinden herkesin erişebileceği şekilde deploy edilebilir durumda.

@echo off
chcp 65001 >nul 2>&1
title Cuhadar Enerji Simulator

echo ========================================
echo   Cuhadar Enerji Simulator
echo ========================================
echo.

:: Node.js kontrolü
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Node.js bulunamadı!
    echo Lütfen https://nodejs.org adresinden Node.js kurun.
    echo.
    pause
    exit /b 1
)

:: node_modules kontrolü
if not exist "node_modules" (
    echo [BILGI] Bağımlılıklar kuruluyor...
    echo Bu işlem ilk seferde birkaç dakika sürebilir.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [HATA] Bağımlılıklar kurulamadı!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Bağımlılıklar kuruldu.
    echo.
)

echo [BILGI] Oyun başlatılıyor...
echo Tarayıcınızda http://localhost:5000 adresini açın.
echo Kapatmak için bu pencereyi kapatın veya Ctrl+C basın.
echo.

:: Geliştirme sunucusunu başlat
call npx cross-env NODE_ENV=development npx tsx server/index.ts

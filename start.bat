@echo off
chcp 65001 >nul
echo ===================================================
echo   UBUNTU NETWORK - MOBIL VE MASAUSTU SUNUCU BASLATICI
echo ===================================================
echo.
set NODE_ENV=production
set PORT=3000

echo [1/2] Bagimliliklar ve derleme kontrol ediliyor...
if not exist ".next" (
  echo Derleme bulunamadi, derleniyor...
  call npm run build
)

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=1" %%b in ("%%a") do set LOCAL_IP=%%b
)

echo.
echo [2/2] Sunucu tum aglara acik baslatiliyor (Port: 3000)...
echo ---------------------------------------------------
echo 💻 Bilgisayardan giris:     http://localhost:3000
if defined LOCAL_IP (
  echo 📱 Cep Telefonundan giris:  http://%LOCAL_IP%:3000
  echo    (Telefonunuz bu bilgisayarla ayni Wi-Fi agina bagli olmalidir)
)
echo ---------------------------------------------------
echo.
call npm start
pause

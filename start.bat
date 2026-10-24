@echo off
echo ===================================================
echo   UBUNTU NETWORK - CANLI SUNUCU BASLATICI (WINDOWS)
echo ===================================================
echo.
set NODE_ENV=production
set PORT=3000

echo [1/2] Bağımlılıklar ve derleme kontrol ediliyor...
if not exist ".next" (
  echo Derleme bulunamadi, derleniyor...
  call npm run build
)

echo [2/2] Canli sunucu baslatiliyor (Port: 3000)...
echo Tarayicinizdan http://localhost:3000 adresine gidebilirsiniz.
echo.
call npm start
pause

#!/bin/bash
echo "==================================================="
echo "  UBUNTU NETWORK - CANLI SUNUCU BAŞLATICI (LINUX)  "
echo "==================================================="

export NODE_ENV=production
export PORT=3000

if [ ! -d ".next" ]; then
  echo "Derleme bulunamadı, derleniyor..."
  npm run build
fi

echo "Canlı sunucu başlatılıyor..."
npm start

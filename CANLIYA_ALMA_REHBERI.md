# 🚀 UBUNTU NETWORK - CANLIYA ALMA REHBERİ

Bu proje, modern **Next.js 16 (App Router)** ve **Tailwind CSS v4** ile inşa edilmiştir. Sahte veriler tamamen kaldırılmış, dinamik veri tabanı ve çoklu yönetici yetkilendirme sistemi hazır durumdadır.

---

## 🎯 SEÇENEK 1: VERCEL İLE 2 DAKİKADA YAYINA ALMA (EN KOLAY & ÜCRETSİZ)

Vercel, Next.js'in resmi bulut platformudur ve ücretsiz SSL, global CDN ve sıfır sunucu yönetimi sağlar.

1. **Projeyi GitHub'a yükleyin:**
   - GitHub'da yeni bir özel (Private) veya genel (Public) repository açın.
   - Bu proje klasörünü GitHub'a gönderin (`git push`).
2. **Vercel'e Giriş Yapın:**
   - [https://vercel.com](https://vercel.com) adresine gidin.
   - *"Add New..."* -> *"Project"* seçeneğine tıklayın.
   - GitHub reponuzu seçin.
3. **Deploy Edin:**
   - *"Deploy"* butonuna tıklayın.
   - 1 dakika içinde siteniz `https://ubuntu-network.vercel.app` olarak yayına alınacaktır.
   - Alan adınızı (örn: `ubuntunetwork.com`) *"Settings -> Domains"* bölümünden tek tıkla bağlayabilirsiniz.

---

## 🎯 SEÇENEK 2: DOCKER İLE LINUX VPS SUNUCUDA YAYINA ALMA

Projeye hazır `Dockerfile` ve `docker-compose.yml` dahil edilmiştir.

1. Sunucunuzda proje klasörüne gidin.
2. Aşağıdaki komutu çalıştırın:
   ```bash
   docker compose up -d --build
   ```
3. Siteniz `http://SUNUCU_IP_ADRESINIZ:3000` portunda 7/24 arka planda otomatik yeniden başlama güvencesiyle çalışacaktır.
4. Veriler sunucunuzun `./src/data/storage` klasöründe kalıcı olarak saklanır.

---

## 🎯 SEÇENEK 3: PM2 İLE LINUX SUNUCUDA (UBUNTU / DEBIAN) YAYINA ALMA

1. Sunucuda Node.js (v20+) ve PM2 kurulu olduğundan emin olun:
   ```bash
   npm install -g pm2
   ```
2. Proje klasörüne girip bağımlılıkları yükleyin ve derleyin:
   ```bash
   npm ci
   npm run build
   ```
3. Proje içindeki hazır `ecosystem.config.js` ile başlatın:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

---

## 🎯 SEÇENEK 4: cPANEL VEYA PLESK HOSTING (NODE.JS DESTEKLİ)

1. cPanel'de **"Setup Node.js App"** bölümüne gidin.
2. *"Create Application"* butonuna tıklayın.
   - Node.js Version: 20 veya 22 seçin.
   - Application Mode: Production
   - Application Root: `ubuntu-network` (veya dosyaları yüklediğiniz dizin)
   - Application Startup File: `node_modules/next/dist/bin/next`
3. Proje dosyalarını yükledikten sonra *"Run NPM Install"* ve *"Build"* butonlarına basın.

---

## 🔐 İLK YÖNETİCİ GİRİŞ BİLGİLERİ

- **Panel Adresi:** `https://siteniz.com/admin`
- **Varsayılan Kullanıcı Adı:** `admin`
- **Varsayılan Şifre:** `ubuntu2026`

> **Önemli Güvenlik Tavsiyesi:** Panele ilk girişinizi yaptıktan sonra sol menüdeki **"Şifre & Güvenlik"** sekmesinden şifrenizi hemen değiştiriniz. Ayrıca **"Yöneticiler & Yetkiler"** sekmesinden operatörlerinize özel roller tanımlayabilirsiniz.

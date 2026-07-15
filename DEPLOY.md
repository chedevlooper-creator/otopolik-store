# OTO POLİK — Vercel Deploy Rehberi

> Bu rehber, otopolik-store projesini Vercel'e deploy etmek için adım adım talimatları içerir.

---

## 1. Ön Hazırlık

### Gereksinimler

- [Vercel hesabı](https://vercel.com/signup) (GitHub ile bağlanabilir)
- GitHub/GitLab/Bitbucket hesabı (kodun pushlanacağı yer)
- Domain (opsiyonel): `otopolik.com` — Vercel ücretsiz `.vercel.app` domaini de sağlar
- **Node.js 20+** (lokalde build testi için)

### Build Testi (Lokal)

Projeyi deploy etmeden önce lokalde build alıp test edin:

```bash
cd otopolik-store

# Bağımlılıkları yükle
npm install

# Production build al
npm run build

# Build çıktısını test et
npm start
```

> Build sırasında hata alırsanız, `DEPLOY_CHECKLIST.md` dosyasındaki kontrolleri uygulayın.

---

## 2. Vercel'e Deploy (Git ile)

### 2.1. Git'e Pushla

```bash
cd otopolik-store
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/KULLANICI_ADI/otopolik-store.git
git push -u origin main
```

### 2.2. Vercel'de Proje Oluştur

1. **Vercel Dashboard → Add New → Project**
2. GitHub reposunu seç
3. **Framework Preset:** `Next.js` (otomatik algılanır)
4. **Root Directory:** `otopolik-store/` (seçili değilse ayarla)

### 2.3. Environment Variables

Vercel proje ayarlarından **Settings → Environment Variables** sayfasına gidin ve aşağıdaki değişkenleri ekleyin:

| Değişken | Değer | Not |
|----------|-------|-----|
| `NEXT_PUBLIC_SITE_URL` | `https://otopolik.com` | Canlı domain; preview için `https://{preview-url}.vercel.app` |

#### Ödeme Servisi (ileride)

| Değişken | Değer | Not |
|----------|-------|-----|
| `IYZIPAY_API_KEY` | `your_api_key` | iyzico API anahtarı |
| `IYZIPAY_SECRET_KEY` | `your_secret_key` | iyzico gizli anahtarı |
| `IYZIPAY_URI` | `https://api.iyzipay.com` | Production: `https://api.iyzipay.com` |

### 2.4. Deploy Ayarları

Varsayılan ayarlar yeterlidir. İsteğe bağlı optimizasyonlar:

| Ayar | Değer | Açıklama |
|------|-------|----------|
| **Build Command** | `npm run build` | Varsayılan |
| **Output Directory** | `.next` | Varsayılan |
| **Install Command** | `npm install` | Varsayılan |
| **Node.js Version** | 20.x (veya 22.x) | Önerilen |
| **Region** | `Frankfurt (fra1)` | Türkiye'ye en yakın Vercel bölgesi |

### 2.5. Deploy

**Deploy** butonuna tıklayın. İlk deploy ~2-3 dakika sürer.

---

## 3. Domain Bağlantısı

### 3.1. Vercel'de Domain Ekleme

1. Vercel projesi → **Settings → Domains**
2. `otopolik.com` yazıp **Add**'e tıkla
3. Vercel sana DNS ayarlarını gösterecek

### 3.2. DNS Ayarları (GoDaddy veya diğer)

DNS sağlayıcında (GoDaddy, Namecheap vb.) aşağıdaki kayıtları ekle:

```
Tür: CNAME
Ad: www
Değer: cname.vercel-dns.com

Tür: A (veya ALIAS)
Ad: @
Değer: 76.76.21.21
```

> Veya Vercel'in önerdiği **Nameservers** yöntemini kullanabilirsiniz.

### 3.3. SSL/TLS

Vercel otomatik olarak SSL sertifikası sağlar (Let's Encrypt). Ek işlem gerekmez.

---

## 4. Deploy Sonrası Kontroller

### 4.1. Çevre Değişkenini Güncelle

Domain bağlandıktan sonra `NEXT_PUBLIC_SITE_URL`'i `https://otopolik.com` olarak güncelle ve **Redeploy** yap.

### 4.2. Yapılacaklar

- [ ] Ana sayfa açılıyor mu?
- [ ] Tüm ürün sayfaları açılıyor mu? (12 ürün)
- [ ] Görseller yükleniyor mu?
- [ ] Sepet çalışıyor mu?
- [ ] Paspas konfigüratörü çalışıyor mu?
- [ ] WhatsApp bağlantıları doğru mu?
- [ ] Sitemap.xml erişilebilir mi? (`/sitemap.xml`)
- [ ] Robots.txt erişilebilir mi? (`/robots.txt`)
- [ ] 404 sayfası çalışıyor mu?
- [ ] Schema markup var mı? (Google Search Console ile test et)
- [ ] Analytics (Google Analytics / Vercel Analytics) kurulu mu?

### 4.3. Google Search Console

1. [Search Console](https://search.google.com/search-console)'a git
2. Domain ekle: `otopolik.com`
3. DNS doğrulaması yap (Vercel üzerinden TXT kaydı eklenebilir)
4. Sitemap gönder: `https://otopolik.com/sitemap.xml`

### 4.4. Vercel Analytics (Opsiyonel)

1. Vercel Dashboard → **Analytics** → **Enable**
2. `@vercel/analytics` paketini yükle:

```bash
npm install @vercel/analytics
```

3. `src/app/layout.tsx` dosyasına ekle:

```tsx
import { Analytics } from "@vercel/analytics/react";

// RootLayout içinde:
<Analytics />
```

---

## 5. Production Build Yapılandırması

### next.config.ts (mevcut)

```ts
const nextConfig: NextConfig = {
  output: "standalone",  // Vercel serverless için optimize
  images: {
    qualities: [75, 90, 95],
  },
  productionBrowserSourceMaps: false,
};
```

### Sık Karşılaşılan Hatalar

| Hata | Çözüm |
|------|-------|
| `Module not found: Can't resolve '...'` | `npm install` ile paketleri yükleyin |
| Görseller yüklenmiyor | `NEXT_PUBLIC_SITE_URL`'in doğru ayarlandığından emin olun |
| 500 Internal Server Error | Vercel deploy loglarını kontrol edin |
| Domain yönlendirmesi çalışmıyor | DNS kayıtlarının doğru olduğunu kontrol edin |

---

## 6. Production URL'ler

| Kaynak | URL |
|--------|-----|
| **Canlı Site** | `https://otopolik.com` |
| **Preview** | `https://otopolik-store-git-main-kullanici.vercel.app` |
| **Sitemap** | `https://otopolik.com/sitemap.xml` |
| **Robots** | `https://otopolik.com/robots.txt` |
| **Vercel Dashboard** | `https://vercel.com/kullanici/otopolik-store` |

---

## 7. Hızlı Deploy (Vercel CLI ile)

Alternatif olarak Vercel CLI ile de deploy edebilirsiniz:

```bash
# Vercel CLI yükle
npm install -g vercel

# Proje dizininde deploy et
cd otopolik-store
vercel --prod

# Environment variables ekle
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add IYZIPAY_API_KEY  # (ileride)
```

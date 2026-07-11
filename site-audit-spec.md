# OTO POLİK — Site Denetim & İyileştirme Spec Dosyası

> **Oluşturulma:** Temmuz 2026  
> **Proje:** `otopolik-store` — Oto Paspasları E-Ticaret Sitesi  
> **Amaç:** Mevcut sitenin tüm yönleriyle denetlenmesi ve iyileştirme yol haritasının belirlenmesi

---

## 1. Proje Genel Bakış

### 1.1. İşletme Bilgileri

| Alan | Mevcut Durum | Not |
|------|-------------|-----|
| **Marka** | OTO POLİK | ✅ |
| **Slogan** | Oto Paspasları | ✅ |
| **Telefon** | `0555 000 00 00` | ⚠️ Placeholder — gerçek bilgiyle güncellenecek |
| **WhatsApp** | `905550000000` | ⚠️ Placeholder |
| **E-posta** | `siparis@otopolik.com` | ⚠️ Placeholder |
| **Adres** | Örnek Mah. Sanayi Cad. No:1, İstanbul | ⚠️ Placeholder |
| **Instagram** | `instagram.com/otopolik` | ⚠️ Placeholder |
| **Çalışma Saatleri** | Pzt-Cmt, 09:00-18:00 | ⚠️ Placeholder |
| **Domain** | `otopolik.com` | Vercel deploy sonrası güncellenecek |

### 1.2. Teknik Stack

| Teknoloji | Sürüm | Notlar |
|-----------|-------|--------|
| Next.js | 16.2.10 | App Router |
| React | 19.2.4 | Server Components + Client Components |
| TypeScript | ^5 | strict mode |
| Tailwind CSS | ^4 | CSS-first configuration (v4) |
| ESLint | ^9 | next/core-web-vitals + next/typescript |
| PostCSS | — | @tailwindcss/postcss plugin |
| Hosting | — | Vercel'de barındırılacak |

### 1.3. Mevcut Sit Yapısı

```
/
├── Anasayfa (page.tsx)
│   ├── Hero                          ✅ Kullanılıyor
│   ├── VehicleFinder                 ✅ Kullanılıyor
│   ├── Marquee                       ✅ Kullanılıyor
│   ├── DesignerCta                   ✅ Kullanılıyor
│   ├── Showcase                      ✅ Kullanılıyor
│   ├── FeaturedProducts              ✅ Kullanılıyor
│   ├── Faq                           ✅ Kullanılıyor
│   ├── CtaBanner                     ✅ Kullanılıyor
│   ├── HowItWorks                    ❌ Mevcut ama kullanılmıyor → **EKLENECEK**
│   ├── Stats                         ❌ Mevcut ama kullanılmıyor → **EKLENECEK**
│   ├── InstagramGallery              ❌ Mevcut ama kullanılmıyor → **EKLENECEK**
│   ├── Testimonials                  ❌ Mevcut ama kullanılmıyor → **EKLENECEK**
│   └── FeatureStrip                  ❌ Mevcut ama kullanılmıyor → **EKLENECEK**
├── /urunler                          Ürün listeleme
│   ├── Filtreleme (marka/kategori/yıl/arama)
│   └── Sıralama (önerilen/fiyat artan/azalan)
├── /urunler/[slug]                   Ürün detay
│   ├── Galeri (thumbnail navigation)
│   ├── Renk seçici (3 renk)
│   ├── Adet seçici
│   ├── Sepete ekle / Hemen al
│   └── Benzer ürünler
├── /olusturucu                       Paspas konfigüratörü
│   ├── Canlı SVG önizleme
│   ├── Marka/model seçimi
│   ├── Taban rengi (8 renk)
│   ├── Kenar rengi (8 renk)
│   ├── Topuk pedi / Bagaj paspası opsiyonları
│   └── Sepete ekle / WhatsApp danışma
├── /sepet                            Sepet sayfası
├── /odeme                            Sipariş formu
├── /tesekkurler                      Teşekkür sayfası
├── /hakkimizda                       Hakkımızda
├── /iletisim                         İletişim
├── /bilgiler/kargo                   Kargo ve teslimat
├── /bilgiler/iade                    İade ve değişim
├── /bilgiler/ozel-uretim             Özel üretim bilgilendirmesi
├── /bilgiler/gizlilik                Gizlilik ve ön bilgilendirme
└── 404                               Sayfa bulunamadı
```

---

## 2. Mevcut Durum Analizi

### 2.1. ✅ Mevcut Güçlü Yönler

- **Modern teknoloji yığını:** Next.js 16 + React 19 + TypeScript strict
- **Temiz mimari:** Bileşen bazlı yapı, context-based state yönetimi
- **Güzel UI/UX tasarımı:** Scroll reveal animasyonları, kart hover efektleri, gradientler, marka tutarlılığı
- **Kapsamlı sayfa yapısı:** Tüm temel e-ticaret sayfaları mevcut
- **SEO altyapısı:** Metadata, sitemap.xml, robots.txt hazır
- **Paspas konfigüratörü:** Canlı SVG önizlemeli yaratıcı bir araç
- **Responsive tasarım:** Mobil/tablet/desktop uyumlu (Tailwind ile)
- **LocalStorage sepet:** useSyncExternalStore ile reactive cart yönetimi
- **Performans:** Statik sayfalar (SSG), görsel optimizasyon, font optimizasyonu

### 2.2. ⚠️ Tespit Edilen Sorun Alanları

Aşağıda her kategori için tespit edilen sorunlar ve önerilen çözümler listelenmiştir.

---

## 3. İyileştirme Kategorileri

### 3.1. 🎨 UI/UX & Tasarım

| # | Sorun | Şiddet | Öneri |
|---|-------|--------|-------|
| 1 | Ana sayfada kullanılmayan bileşenler var | Orta | HowItWorks, Stats, InstagramGallery, Testimonials, FeatureStrip ana sayfaya eklensin |
| 2 | Header scroll efektinde `bg-white/90` kullanılmış, saydamlık geçişi keskin | Düşük | `backdrop-blur-md` ile yumuşatılabilir (mevcut, geliştirilebilir) |
| 3 | Mobil menüde animasyon yok (ani açılıp kapanıyor) | Düşük | Slide-down animasyonu veya transition eklenebilir |
| 4 | CartDrawer kapanırken delay var (`invisible delay-300`) — iyi niyetli ama kullanıcı hissiyatı zayıf | Düşük | Alternatif: `pointer-events` yönetimi |
| 5 | Renk seçici butonlarında erişilebilirlik eksik (`aria-label` mevcut ama renk körleri için renk adı görünmüyor) | Orta | Her rengin üzerine hover/odaklanmada isim gösteren tooltip eklenebilir |
| 6 | Ürün kartlarında "İncele →" butonu sadece hover'da görünüyor, touch cihazlarda erişilemez | Orta | Mobilde her zaman görünür olmalı veya kartın tamamı link (zaten öyle) |
| 7 | Konfigüratör SVG önizlemesi mobilde küçük kalabilir | Düşük | Mobilde tam genişlik modu |

### 3.2. ⚡ Performans & SEO

| # | Sorun | Şiddet | Öneri |
|---|-------|--------|-------|
| 1 | Schema markup (JSON-LD) eksik | Yüksek | Product, Organization, FAQ, BreadcrumbList, LocalBusiness schema'ları eklenmeli |
| 2 | Ürün sayfalarında canonical URL eksik | Orta | Her ürün sayfasına `<link rel="canonical">` eklenmeli |
| 3 | Breadcrumb structured data eksik | Orta | Ürün detay sayfasına BreadcrumbList schema'sı eklenmeli |
| 4 | next/image quality=90/95 kullanılan görseller var ancak Next config'de qualities listesi tanımlanmış | Düşük | ✅ Zaten yapılmış |
| 5 | Hero video (`hero-video.mp4`) büyük boyutlu olabilir | Orta | Video sıkıştırma ve lazy loading kontrolü |
| 6 | `_loading` durumları yönetilmiyor (örn. VehicleFinder marka seçildiğinde model dropdown debounce/bekleme yok) | Düşük | UX iyileştirmesi |
| 7 | Görsel alt metinleri bazı yerlerde çok kısa | Düşük | Daha açıklayıcı alt metinler |
| 8 | Open Graph / Twitter card görselleri sadece 1 adet | Orta | Her ürün için özel OG görseli |
| 9 | `next/font` yerel font olarak Poppins ve Inter yüklenmiş, subset `latin` ile sınırlı — Türkçe karakterler (ğ,ü,ş,ı,ö,ç) sorunsuz | ✅ | Mevcut durum yeterli |

### 3.3. 🧱 Kod Kalitesi & Mimari

| # | Sorun | Şiddet | Öneri |
|---|-------|--------|-------|
| 1 | `products.ts` seed verileri statik ve manuel düzenleniyor | Düşük | CMS istenmiyor, statik devam — yeni ürün ekleme kolaylığı için ek fonksiyonlar eklenebilir |
| 2 | `STANDARD_COLORS` ve `STANDARD_FEATURES` products.ts'de her ürüne aynı şekilde dağıtılıyor. Farklı kategoriler (havuzlu, bagaj) farklı özelliklere sahip olabilir | Orta | Kategori bazlı feature/color tanımı yapılabilir |
| 3 | Bazı bileşenlerde `useMemo` gereksiz yere kullanılmış olabilir | Düşük | Profiling ile doğrulanabilir |
| 4 | `MatConfigurator.tsx` çok büyük bir bileşen (280+ satır) | Orta | Daha küçük alt bileşenlere bölünebilir (AraçSeçici, RenkSeçici, Ekstralar, Özet) |
| 5 | `site-config.ts` işletme bilgileri için TODO notları var | Düşük | Deploy öncesi güncellenmeli |
| 6 | Image `sizes` attribute'ları bazı bileşenlerde optimize edilebilir | Düşük | `ProductCard` için `(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw` yeterli |
| 7 | `cart-store.ts` içinde `ensureHydrated()` her işlemde çağrılıyor — ilk çağrıdan sonra gereksiz | Düşük | Optimize edilebilir ama performans etkisi ihmal edilebilir |
| 8 | `CartDrawer.tsx` ve `sepet/page.tsx` çok benzer kod içeriyor | Orta | Paylaşılan CartItem bileşeni çıkarılabilir |

### 3.4. 🛒 İşlevsellik & Eksik Özellikler

| # | Eksiklik | Şiddet | Öneri |
|---|----------|--------|-------|
| 1 | **Kredi kartı ödeme entegrasyonu eksik** | Yüksek | iyzico/PayTR gibi bir servis entegre edilmeli — servis kararı specler arası |
| 2 | "Bagaj" kategorisinde hiç ürün yok | Orta | Seed verilere bagaj ürünleri eklenmeli |
| 3 | Ürün sayısı sadece 12, genişletilebilir olmalı | Düşük | Statik data olduğu için manuel ekleme yeterli |
| 4 | Admin panel yok (CMS istenmiyor) | — | İstenmedi, products.ts manuel güncellenecek |
| 5 | Stok takibi yok | Düşük | Mevcut iş modelinde stok takibi gerekmiyor (sipariş üzerine üretim) |
| 6 | Sipariş geçmişi / hesap sayfası yok | Düşük | WhatsApp üzerinden sipariş modelinde gerekli değil |

### 3.5. 🔒 Güvenlik & Veri

| # | Sorun | Şiddet | Öneri |
|---|-------|--------|-------|
| 1 | `.env` dosyası yok veya projede görünmüyor | Düşük | API anahtarları için `.env.local` kullanılmalı |
| 2 | WhatsApp mesajları (sipariş detayları) URL'de açık metin gidiyor | Düşük | WhatsApp API doğası gereği böyle, risk düşük |
| 3 | XSS: `children` prop'ları doğrudan render ediliyor — server component avantajıyla risk düşük | ✅ | Next.js default XSS koruması |
| 4 | Form validasyonu: İletişim/ödeme formlarında sadece HTML5 required attribute'ları kullanılmış | Orta | Daha kapsamlı validasyon (e-posta formatı, telefon formatı) eklenebilir |
| 5 | Sipariş formu verileri localStorage'da değil, sadece state'te — sayfa yenilenince kaybolur | Düşük | Form verileri de sessionStorage'a kaydedilebilir |

### 3.6. 📝 İçerik & Metin

| # | Sorun | Şiddet | Öneri |
|---|-------|--------|-------|
| 1 | Placeholder işletme bilgileri (telefon, e-posta, adres) | Yüksek | Deploy öncesi güncellenmeli, spec'te uyarı olarak işaretli |
| 2 | Yasal metinler (gizlilik, mesafeli satış sözleşmesi) uyarısı mevcut | Orta | Yayına almadan önce hukuki danışmanla tamamlanmalı |
| 3 | SSS içeriği genel ve yeterli | ✅ | |
| 4 | InstagramGallery bileşeninde "Seçilen içerikler siteye sabit olarak eklenir" notu | Düşük | Gerçek Instagram embed veya API entegrasyonu düşünülebilir |

---

## 4. Yapılacaklar Listesi (Öncelik Sırasına Göre)

### 🚨 Acil (Yayına Almadan Önce)

1. **İşletme bilgilerini güncelle** — `site-config.ts`:
   - Telefon, WhatsApp, e-posta, adres, Instagram, çalışma saatleri
2. **Gelişmiş SEO iyileştirmeleri:**
   - JSON-LD schema markup (Product, Organization, FAQ, BreadcrumbList, LocalBusiness)
   - Canonical URL'ler
   - Breadcrumb structured data
   - OG/Twitter card görselleri
3. **Yasal metinler** — Gizlilik politikası, mesafeli satış sözleşmesi hukuki danışmanla tamamlansın
4. **Vercel deploy** — Statik export veya serverless deploy

### 📌 Yüksek Öncelik

5. **Ana sayfaya kullanılmayan bileşenleri ekle:**
   - FeatureStrip (ana özellik ikonları)
   - HowItWorks (3 adımda paspas)
   - Stats (istatistikler)
   - InstagramGallery (galeri)
   - Testimonials (müşteri yorumları bölümü — şu an sadece destek metni)
6. **Ödeme entegrasyonu** — Kredi kartı ödeme sağlayıcısı kararlaştırılıp entegre edilsin
7. **Gerçek ürün görselleri** — Mevcut placeholder görseller gerçek ürün fotoğraflarıyla değiştirilsin
8. **Bagaj kategorisi ürünleri** — Seed verilere bagaj paspası ürünleri ekle

### 🔧 Orta Öncelik

9. **MatConfigurator refactoring** — Büyük bileşeni alt bileşenlere böl
10. **CartDrawer/sepet sayfası** — Ortak CartItem bileşeni çıkar
11. **Form validasyonu** — Telefon formatı, e-posta doğrulama
12. **Mobil menü animasyonu** — Slide-down geçişi
13. **Renk seçici tooltip** — Renk körü kullanıcılar için erişilebilirlik
14. **"İncele →" butonu** — Touch cihazlarda görünürlük
15. **Form state persistence** — Sipariş formunu sessionStorage'a kaydet

### 💎 Düşük Öncelik

16. **ProductCode** — Kategori bazlı feature/color varyasyonları
17. **Hero video optimizasyonu**
18. **"Diğer" araç seçeneği** — Konfigüratörde kullanıcı aracını listede bulamazsa özel üretim akışı
19. **Instagram API entegrasyonu** — Gerçek Instagram gönderilerini çekmek için

---

## 5. Gereksinim Detayları

### 5.1. SEO Schema Markup (JSON-LD)

```typescript
// Product schema (ürün detay sayfası)
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": string,
  "description": string,
  "brand": { "@type": "Brand", "name": "OTO POLİK" },
  "offers": {
    "@type": "Offer",
    "price": number,
    "priceCurrency": "TRY",
    "availability": "https://schema.org/InStock",
    "shippingDetails": { ... }
  },
  "image": string[]
}

// Organization schema (tüm sayfalarda)
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OTO POLİK",
  "url": "https://otopolik.com",
  "logo": "https://otopolik.com/media/logo.jpg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": string,
    "contactType": "customer service"
  }
}

// FAQ schema (anasayfa SSS bölümü)
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQItem[]
}

// BreadcrumbList schema (ürün detay sayfası)
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": url },
    { "@type": "ListItem", "position": 2, "name": "Ürünler", "item": url },
    { "@type": "ListItem", "position": 3, "name": product.name }
  ]
}

// LocalBusiness schema (anasayfa)
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "OTO POLİK",
  "address": { ... },
  "telephone": string,
  "openingHours": string
}
```

### 5.2. Ana Sayfa Bileşen Sıralaması (Güncellenmiş)

```
Hero → VehicleFinder → FeatureStrip → Marquee → HowItWorks → Stats →
DesignerCta → Showcase → InstagramGallery → FeaturedProducts → 
Testimonials → Faq → CtaBanner
```

### 5.3. Ödeme Entegrasyon Planı

| Adım | Açıklama |
|------|----------|
| 1 | Ödeme sağlayıcısı seçimi (iyzico / PayTR / diğer) |
| 2 | API entegrasyonu ve checkout sayfası güncellemesi |
| 3 | Kredi kartı ödeme seçeneğinin aktifleştirilmesi |
| 4 | WhatsApp sipariş seçeneğinin korunması |
| 5 | Test ve güvenlik doğrulaması |

---

## 6. Teknik Notlar

### 6.1. Görseller

- Gerçek ürün fotoğrafları mevcut → `public/media/` altına eklenecek
- Her ürün için en az 4 görsel (ön sürücü, ön yolcu, arka sıra, genel set)
- Kalite: JPEG için 85-90, WebP'ye dönüşüm `next.config` ile sağlanacak
- Logo: `public/media/logo.jpg` — mevcut, gerçek logoyla değiştirilecek

### 6.2. Fiyatlandırma Modeli

- **Ürüne özel fiyatlandırma:** Her araç modeli için ayrı taban fiyat
- **Opsiyonel ekstralar:**
  - Topuk pedi: 149₺
  - Bagaj paspası: 349₺
- Havuzlu EVA kategorisi ürünleri için ek fiyat farkı olabilir

### 6.3. Deployment

- **Platform:** Vercel
- **Build:** `next build` (static generation + serverless functions)
- **Env vars:** `.env.local` ile yönetilecek
  - `NEXT_PUBLIC_SITE_URL`
  - Ödeme API anahtarları (seçilen servise göre)
- **Özel domain:** `otopolik.com` Vercel projesine bağlanacak

---

## 7. Karar Günlüğü

| Tarih | Karar | Gerekçe |
|-------|-------|---------|
| 2026-07 | Placeholder bilgiler korunacak, "gerçek bilgilerle güncellenecek" notu eklenecek | Kolay referans için |
| 2026-07 | CMS kullanılmayacak, statik product.ts yeterli | İşletme ihtiyacı yok |
| 2026-07 | WhatsApp + Kredi kartı ödeme bir arada | Müşteri tercihine göre esneklik |
| 2026-07 | Sadece Türkçe yayın | Sadece Türkiye pazarı |
| 2026-07 | Vercel hosting | Modern stack ile uyumlu |
| 2026-07 | Kullanılmayan ana sayfa bileşenleri eklenecek | Eksik içeriği tamamlama |
| 2026-07 | Gelişmiş SEO (schema markup) eklenecek | Arama motoru görünürlüğü |
| 2026-07 | Responsive tasarım yeterli, ek düzenleme gerekmez | Mevcut Tailwind yapısı yeterli |

---

## 8. Yaklaşık İş Takvimi (Tahmini)

| Aşama | Süre (tahmini) |
|-------|----------------|
| Faz 1: Acil düzeltmeler (SEO, schema, işletme bilgileri) | 1-2 gün |
| Faz 2: Ana sayfa bileşenlerinin eklenmesi | 1 gün |
| Faz 3: Kod refactoring (Konfigüratör, Cart bileşenleri) | 1-2 gün |
| Faz 4: Ödeme entegrasyonu | 2-3 gün |
| Faz 5: Görseller ve içerik güncellemeleri | 1-2 gün |
| Faz 6: Test, Vercel deploy, canlıya alma | 1 gün |

> **Toplam:** ~7-11 iş günü (ödeme entegrasyonu ve servis seçimine bağlı olarak değişebilir)

---

## 9. Ek Notlar

- Mevcut sitenin tüm sayfaları render edilebilir durumda
- Proje Next.js 16.2.10 kullanıyor — deprecation/breaking change uyarıları için `AGENTS.md` ve `CLAUDE.md` dosyaları mevcut
- `eslint.config.mjs` Next.js 16 kuralları ile yapılandırılmış
- Statik export (SSG) çalışıyor — tüm statik sayfalar build'de oluşturuluyor

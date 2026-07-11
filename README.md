# OTO POLİK — Oto Paspasları E-Ticaret Sitesi

Next.js (App Router) + Tailwind CSS ile hazırlanmış, araca özel EVA oto paspası satan bir e-ticaret vitrini. Sepet ve sipariş talebi akışı çalışır durumda; onay WhatsApp üzerinden yapılır ve kapıda ödeme tercihi desteklenir.

## Geliştirme

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Yayına Almadan Önce Yapılacaklar

1. **`src/lib/site-config.ts`** — telefon, WhatsApp numarası, e-posta, adres, çalışma saatleri, kargo ücreti ve `url` alanlarını gerçek işletme bilgilerinizle güncelleyin.
2. **`src/lib/products.ts`** — araç bazlı uyumluluk, set kapsamı, fiyatlar ve gerçek ürün fotoğraflarını güncelleyin. Instagram&apos;dan seçilen onaylı içerikleri `public/media/` altında saklayın; canlı Instagram akışı kullanmayın.
3. **Hukukî metinler** — `src/app/bilgiler/[slug]/page.tsx` içindeki taslakları işletmenize özel gizlilik, ön bilgilendirme ve mesafeli satış metinleriyle tamamlayın.
3. **Ödeme altyapısı** — iyzico/PayTR/Stripe hesabınız hazır olduğunda `src/app/odeme/page.tsx` içindeki WhatsApp akışının yanına gerçek ödeme entegrasyonunu ekleyebiliriz.
4. **Analitik/SEO** — `siteConfig.url` güncellendikten sonra `src/app/sitemap.ts` ve `src/app/robots.ts` otomatik doğru adresi kullanır.

## Proje Yapısı

- `src/app/` — sayfalar (Ana Sayfa, Ürünler, Ürün Detay, Sepet, Ödeme, Hakkımızda, İletişim)
- `src/components/` — paylaşılan arayüz bileşenleri (Header, Footer, ürün kartı, sepet butonu vb.)
- `src/lib/` — ürün verisi, site ayarları, para birimi formatlama, sepet deposu (localStorage)
- `src/context/cart-context.tsx` — sepet state'ini uygulamaya sağlayan React context
- `public/media/` — hero video/görselleri ve logo

## Vercel'e Deploy

1. Bu projeyi bir GitHub reposuna push edin.
2. [vercel.com/new](https://vercel.com/new) üzerinden repoyu içe aktarın, framework olarak Next.js otomatik algılanır.
3. Deploy sonrası aldığınız domaini `src/lib/site-config.ts` içindeki `url` alanına yazıp yeniden deploy edin (doğru sitemap/Open Graph görselleri için).

```bash
npm run build
npm run start
```

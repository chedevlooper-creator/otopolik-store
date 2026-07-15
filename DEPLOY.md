# OTO POLİK — Vercel Deploy Rehberi

> WhatsApp + kapıda ödeme MVP. Kart ödemesi bu sürümde yoktur.

---

## 1. Ön Hazırlık

### Gereksinimler

- Vercel hesabı
- Convex hesabı (`npx convex login`)
- Node.js 20+
- Domain (opsiyonel): `otopolik.com`

### Lokal test

```bash
npm install
cp .env.example .env.local   # gerçek değerlerle doldurun
npx convex dev               # NEXT_PUBLIC_CONVEX_URL oluşur
# Convex ortam değişkeni (Vercel ADMIN_SECRET ile AYNI olmalı):
npx convex env set ADMIN_SECRET "<güçlü-değer>"
# Seed:
npx convex run seed:seedProducts '{"adminKey":"<ADMIN_SECRET>"}'
npx convex run cms:seedCms '{"adminKey":"<ADMIN_SECRET>"}'
npm run build && npm start
```

Katalogda **7 ürün** seed ile yüklenir. Convex yoksa vitrin `src/lib/products.ts` fallback kullanır — **canlıda Convex zorunlu** (sipariş kaydı için).

---

## 2. Vercel Environment Variables

| Değişken | Zorunlu | Not |
|----------|---------|-----|
| `NEXT_PUBLIC_SITE_URL` | Evet | Canlı domain (`https://otopolik.com`) |
| `NEXT_PUBLIC_CONVEX_URL` | Evet | Convex deployment URL |
| `CONVEX_DEPLOY_KEY` | Evet | Prod deploy |
| `ADMIN_PASSWORD` | Evet | Admin giriş — **örnek `admin123` kullanmayın** |
| `ADMIN_SECRET` | Evet | Convex `ADMIN_SECRET` ile **birebir aynı** |
| `NEXT_PUBLIC_SITE_*` / kargo / mat | Hayır | Override; canlı değerler Convex `siteSettings` |

Convex tarafında da:

```bash
npx convex env set ADMIN_SECRET "<Vercel'dekiyle aynı>"
```

---

## 3. Deploy

- Framework: Next.js
- Region: Frankfurt (`fra1`)
- Build: `npm run build`
- Root: repo kökü

---

## 4. Deploy sonrası kontroller

- [ ] `ADMIN_PASSWORD` / `ADMIN_SECRET` örnek değerden değiştirildi
- [ ] Convex'te `seedProducts` + `seedCms` çalıştırıldı
- [ ] Ana sayfa + hero video
- [ ] 7 ürün listeleniyor; admin'den fiyat değişince vitrin güncelleniyor
- [ ] Test siparişi: WhatsApp açılıyor **ve** Admin → Siparişler'de kayıt görünüyor
- [ ] Özel tasarım (konfigüratör) siparişte araç/renk detayı görünüyor
- [ ] Admin → Ürünler → dosya yükleme çalışıyor
- [ ] Yasal sayfalar işletme bilgileriyle güncellendi (`/admin/icerik`)
- [ ] `/sitemap.xml`, `/robots.txt` (`/admin` disallow)
- [ ] SEO site URL'si canlı domain ile uyumlu (`/admin/icerik` → SEO)

---

## 5. Kapsam dışı (sonraki sprint)

- iyzico / kredi kartı
- Analytics / KVKK cookie banner
- Otomatik test / CI

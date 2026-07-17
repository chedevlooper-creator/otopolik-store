# Project: Otopolik - Ultra Luxury Reimagined

## Core Value
Eşi benzeri olmayan, "Apple / Porsche" kalitesinde premium bir EVA oto paspas e-ticaret deneyimi sunmak. Web sitesi sadece bir mağaza değil, lüks bir aracın iç mekanı gibi hissettirmeli.

## Context
Otopolik halihazırda Next.js, Tailwind CSS ve Convex ile inşa edilmiş çalışan bir e-ticaret altyapısına (brownfield) sahip. Ancak kullanıcı deneyimi ve görsel estetik standart web seviyesinden, eşsiz bir lüks seviyesine taşınmak isteniyor. "Ölen kalite", 3D animasyonlar, akıcı scroll deneyimi (Lenis kullanılarak) ve karanlık/kırmızı ağırlıklı yüksek kontrastlı premium tasarım hedefleniyor.

## What This Is
- Mevcut yapının Apple standartlarında lüks konsepte göre tamamen yeniden tasarlanması
- Pürüzsüz sayfa geçişleri, scroll animasyonları ve premium mikro etkileşimler eklenmesi
- Konfigüratör ve ana sayfanın dev ekranlara ve mobil cihazlara kusursuz adapte edilmesi

## What This Is NOT
- Sıfırdan yeni bir veritabanı veya backend mimarisi kurmak (Convex altyapısı korunacak)
- Sadece çalışsın diye yapılan standart bir "sepet / ödeme" akışı (her adım lüks hissettirmeli)
- Ucuz, karmaşık veya kalabalık bir e-ticaret şablonu

## Requirements

### Validated
- ✓ Next.js App Router mimarisi — v1.0
- ✓ Convex veritabanı entegrasyonu — v1.0
- ✓ Tailwind v4 ile şekillendirilmiş temel bileşenler — v1.0
- ✓ Temel ürün konfigüratörü ve form yapısı — v1.0
- ✓ Lenis smooth-scrolling ve sayfa geneli pürüzsüz kaydırma — v1.0 (Phase 1)
- ✓ Scroll-linked animasyonlar ve staggered entrances — v1.0 (Phase 2)
- ✓ Lüks 3D car render ve floating panel entegrasyonu — v1.0 (Phase 2)
- ✓ Spring-physics step geçişleri ve glassmorphism stepper — v1.0 (Phase 3)
- ✓ Pinch-to-zoom ve cursor-follow loupe galeri — v1.0 (Phase 3)
- ✓ useAnimatedNumber fiyat sayacı ve add-to-cart animasyonları — v1.0 (Phase 3)
- ✓ SafeImage error fallback, custom scrollbars, ve mobile sticky hover engelleme — v1.0 (Phase 4)
- ✓ NetworkToast bağlantı kesilme uyarısı — v1.0 (Phase 4)

### Active
- None (All initial milestone phases complete)

### Out of Scope
- Backend değişiklikleri — Sadece görsel ve frontend odaklı

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Lüks Tasarım | Paspas bir aksesuar değil, aracın devamı. Kullanıcıya bu premium hissi geçirmeliyiz. | ✓ Shipped |
| Akıcı Animasyonlar | "Apple kalitesi" beklentisini karşılamak için düz sayfa geçişleri yetmez. | ✓ Shipped |

---
*Last updated: 2026-07-17 after v1.0 milestone complete*

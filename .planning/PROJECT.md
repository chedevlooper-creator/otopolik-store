# Project: Otopolik - Ultra Luxury Reimagined

## Current Milestone: v1.1 AI Destekli Lüks Deneyim

**Goal:** Layer AI capabilities over the shipped luxury storefront — customer-facing assistants for configuration, vehicle matching, and support, plus an admin content generator — without touching the core Convex commerce backbone.

**Target features:**
- AI configurator assistant — Turkish chat assistant guiding customers through vehicle selection → mat colors/extras → price → WhatsApp checkout handoff
- AI vehicle matcher — free-text vehicle input ("2019 Passat variant") matched to `vehicle-data.ts` brand/model with the correct price tier
- AI content generator (admin) — generates Turkish product descriptions, SEO titles/meta, and FAQ copy, saved into the Convex CMS
- AI support / order helper — answers shipping, sizing, and care questions from site content and drafts WhatsApp order messages

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
- v1.1 requirements being defined — see REQUIREMENTS.md (AI configurator assistant, AI vehicle matcher, admin AI content generator, AI support/order helper)

### Out of Scope
- Backend değişiklikleri — Sadece görsel ve frontend odaklı

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Lüks Tasarım | Paspas bir aksesuar değil, aracın devamı. Kullanıcıya bu premium hissi geçirmeliyiz. | ✓ Shipped |
| Akıcı Animasyonlar | "Apple kalitesi" beklentisini karşılamak için düz sayfa geçişleri yetmez. | ✓ Shipped |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-17 — milestone v1.1 started*

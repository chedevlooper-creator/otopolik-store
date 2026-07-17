# Project: Otopolik - Ultra Luxury Reimagined

## Current Milestone: v1.2 Sade Lüks Deneyim

**Goal:** Ana sayfa dahil tüm müşteri arayüzünü, premium marka hissini kaybetmeden daha sade, anlaşılır ve akıcı hale getirmek.

**Target features:**
- Gereksiz veya tekrarlanan storefront bölümlerini kaldırmak
- Yoğun animasyon ve görsel efektleri az ama etkili mikro etkileşimlere indirgemek
- Konfigüratör, ürün, sepet ve ödeme akışlarını kısaltıp sadeleştirmek
- OLED siyah/kırmızı marka dilini, WhatsApp sipariş akışını ve temel konfigürasyonu korumak
- Müşteri tarafındaki AI arayüzlerini kodda koruyup görünür storefront deneyiminden gizlemek

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
- ✓ Sunucu-taraflı AI istemci katmanı + guardrails (rate limit, kill switch, key server-only) — v1.1 (Phase 5)
- ✓ AI araç eşleştirici (serbest metin → vehicle-data.ts, deterministik arama + LLM fallback, disambiguation, configurator prefill) — v1.1 (Phase 5)
- ✓ Golden eval harness (fiyat-eşitliği + Türkçe kalite assertion'ları) — v1.1 (Phase 5)
- ✓ Türkçe streaming configurator asistanı (gerçek stepper'ı sürer, gerçek sepete calculateMatPrice ile ekler) — v1.1 (Phase 6)
- ✓ AI destek / sipariş yardımcısı (canlı CMS/ayar grounding, kapsam-dışı reddi, wa.me handoff, kullanıcı-gönderir sipariş taslağı, KVKK minimizasyonu) — v1.1 (Phase 7)
- ✓ Admin AI içerik üreticisi (taslak-sonra-yayımla, ürün/SEO/FAQ, admin-key-gated, premium Türkçe marka sesi) — v1.1 (Phase 8)
- ✓ Müşteri AI arayüzleri `CUSTOMER_AI_UI_ENABLED` bayrağı arkasında; nav omurgası kilitli, `/destek` WhatsApp fallback'i canlı — v1.2 (Phase 9)
- ✓ Sade lüks ana sayfa: tek birincil CTA'lı statik hero, hareket diyeti (parallax/stagger/glow kaldırıldı), FAQ + WhatsApp güven yüzeyi ve JSON-LD korunarak — v1.2 (Phase 10)

### Active
- Tüm müşteri arayüzünde sade lüks tasarım ve içerik hiyerarşisi — v1.2
- Konfigüratör, ürün, sepet ve ödeme akışlarının sadeleştirilmesi — v1.2

### Out of Scope
- Backend/Convex mimari değişiklikleri — AI katmanı mevcut ticaret omurgasının üzerine additive
- AI'ın otonom sipariş vermesi — WhatsApp-onaylı güven modelini bozar (AI taslak hazırlar, müşteri gönderir)
- Genel amaçlı açık-domain chatbot — kapsam-dışı istismar/maliyet/prompt-injection riski
- AI'ın canlı CMS'e otomatik yayın yapması — halüsinasyon riski, insan onayı şart
- mat-pricing.ts dışında fiyat üreten AI — iki kaynak-of-truth yaratır

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Lüks Tasarım | Paspas bir aksesuar değil, aracın devamı. Kullanıcıya bu premium hissi geçirmeliyiz. | ✓ Shipped |
| Akıcı Animasyonlar | "Apple kalitesi" beklentisini karşılamak için düz sayfa geçişleri yetmez. | ✓ Shipped |
| AI anahtarları yalnızca sunucuda | API anahtarlarının tarayıcıya sızması maliyet/güvenlik felaketi olur; tüm AI çağrıları `src/app/api/ai/*` route handler'ları üzerinden. | ✓ Shipped (v1.1) |
| Graceful degradation (AI kapalıyken tam işlevsel) | `AI_FEATURES_ENABLED` / anahtar yoksa site eski manuel akışlarla çalışmaya devam eder; AI additive bir katman. | ✓ Shipped (v1.1) |
| Fiyat tek kaynağı mat-pricing.ts | AI asla fiyat üretmez; her rakam koddan gelir → golden eval'de fiyat-eşitliği assertion'ı. | ✓ Shipped (v1.1) |
| AI sipariş vermez, taslak hazırlar | WhatsApp-onaylı güven modeli korunur; müşteri her zaman son göndereni olur. | ✓ Shipped (v1.1) |
| Grounded cevaplar + kapsam-dışı reddi | Destek asistanı yalnızca canlı CMS/ayar içeriğinden cevaplar, alakasız soruları kibarca reddeder. | ✓ Shipped (v1.1) |
| Sade lüks storefront | Görsel yoğunluk ve uzun akışlar premium algıyı zayıflatıyor; v1.2'de marka dili korunurken gereksiz bölümler ve efektler azaltılacak. | — Pending (v1.2) |

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
*Last updated: 2026-07-17 — Phase 10 (Homepage and Motion Diet) complete*

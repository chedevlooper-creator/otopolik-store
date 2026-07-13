# OTO POLİK — UI/UX ve Fonksiyon Denetim Raporu

> **Not:** Bu ilk ön raporun yerine görünür tarayıcıyla doğrulanan güncel raporu kullanın: [browser-ui-ux-audit-2026-07-12.md](./browser-ui-ux-audit-2026-07-12.md)

**Tarih:** 12 Temmuz 2026  
**Ortam:** Yerel geliştirme sunucusu (`http://127.0.0.1:3000`)  
**Test edilen kapsam:** Ana sayfa, katalog, ürün detayı, tasarlayıcı, sepet, sipariş talebi, teşekkür, hakkımızda, iletişim ve tüm bilgi sayfaları; masaüstü ve 375 px mobil görünüm.

## Özet

Ana alışveriş akışı (ürün ekleme, sepet, sipariş talebi) çalışıyor. Tasarlayıcıdan eklenen ürün ve ürün detayından eklenen ürün sepet ile sipariş özetine doğru yansıyor. Kritik eksikler; canlıya uygun olmayan iletişim bilgileri, devre dışı kredi kartı ödeme seçeneği ve katalogdaki ürün bilgisinin birbiriyle uyuşmamasıdır.

## Görsel tasarım ve ürün yerleşimi değerlendirmesi

Genel yön doğru: koyu zemin, kırmızı vurgu ve krem tonları oto aksesuarı/premium atölye hissini destekliyor. Ana sayfanın hero alanı güçlü ve marka karakteri belirgin. Ancak ürün keşfi ve dönüşüm alanlarında aynı görsel disiplin korunmuyor.

| Alan | Gözlem | Öneri |
|---|---|---|
| Renk sistemi | Siyah/antrasit arka plan ile kırmızı ana CTA iyi bir kontrast kuruyor. Krem vurgu ise başlıkta değer katıyor. Buna karşın aynı kırmızı; CTA, çizgi, indirim etiketi, bildirim ve WhatsApp ile yarışıyor. | Kırmızıyı yalnızca ana satın alma eylemi ve kritik durum için saklayın. İkincil aksiyonları krem çerçeve veya daha sakin gri tonuyla ayırın. WhatsApp yeşili için etrafında yeterli boşluk bırakın. |
| Hero | Masaüstünde güçlü görsel hiyerarşi, büyük başlık ve iki CTA var. Mobilde metin/CTA okunaklı; fakat WhatsApp butonu alt CTA’nın üstüne geliyor. | Hero’daki iki CTA’dan yalnızca ana CTA’yı dolu kırmızı bırakın; ikinci CTA’yı daha az baskınlaştırın. Mobilde sabit WhatsApp düğmesini bu bölgeden kaçırın. |
| Ürün kartları | Kartlar markaya uygun ve fiyat/indirim hiyerarşisi görünür. Fakat ürün adları veri hatası nedeniyle aynı; kategori farklılığı kart üzerinde yeterince belirgin değil. | Kart sırası: kategori etiketi → gerçek ürün adı → kısa kullanım faydası → fiyat/indirim → tek net CTA. Bagaj, direksiyon, minder ve ekran ürünü aynı EVA paspas görsel dilinde sunmayın. |
| Ana sayfada ürün konumu | “En çok tercih edilen setler” bölümü sayfanın oldukça aşağısında kalıyor; kullanıcı uzun ürün anlatımı ve görsel bölümlerden geçiyor. | İlk ekran/araç bulucu sonrasında 3–4 ürünlük kısa bir “Popüler setler” şeridi ekleyin. Detaylı EVA faydalarını ürün keşfinden sonra konumlandırın. |
| Ürün detay düzeni | Galeri, fiyat, renk ve sepete ekleme sıralaması mantıklı. Ancak araç uyumluluğu, teslimat ve ürün içeriği satın alma aksiyonundan önce fazla alan kaplıyor. | Masaüstünde satın alma kutusunu sticky yapın; uyumluluk/kargo bilgisini akordeon veya kısa güven rozetleriyle sıkıştırın. Renk ve adet kontrolünü CTA’nın hemen üstünde tutun. |
| Tasarlayıcı | 4 adımlı yapı anlaşılır, renklerin erişilebilir adları mevcut ve canlı önizleme ikna edici. | Seçim özetini mobilde ekran altına sabit CTA olarak taşıyın: “₺1.298 — Sepete Ekle”. Renk seçeneklerinde seçili durumun yanında yazılı renk adı da her zaman görünür olsun. |
| Tipografi | Başlıklardaki endüstriyel, kalın tipografi markaya uyuyor; gövde metinleri ise bazı uzun bölümlerde yoğun. | Ana sayfa açıklamalarını 2–3 satırla sınırlayın. Faydaları ikon + kısa ifade biçiminde gruplayın. Tüm büyük harf metinlerde harf aralığını ve font ağırlığını mobilde bir kademe azaltın. |
| Boşluk ve ritim | Hero sonrası araç bulucu güçlü bir geçiş sağlıyor; ancak fayda şeridinin tekrarı ve çok sayıda anlatı bölümü sayfayı uzatıyor. | “Problem → ürün → güven → özelleştirme → SSS” sırasını koruyun; benzer fayda mesajlarını tek bölümde toplayın. Bölümler arası dikey boşlukları daha tutarlı yapın. |
| Güven unsurları | Ücretsiz kargo, iade ve araç uyumu mesajları mevcut; ancak metin içinde dağılıyor. | Ürün fiyatının yanında 3 sabit rozet kullanın: “Araca özel kesim”, “1–3 iş gününde kargo”, “14 gün iade”. Ödeme/iletişim gerçek bilgileri eklenmeden güven dilini büyütmeyin. |

### Önerilen ana sayfa sıralaması

`Hero + araç bulucu → Popüler ürünler → 3 temel fayda → Tasarlayıcı CTA → Nasıl çalışır → Gerçek ürün/atölye görselleri → SSS → iletişim CTA`

Bu sıralama, uzun teknik anlatımdan önce kullanıcının ürünleri ve fiyat seviyesini görmesini sağlar.

## Bulgular

| Öncelik | Alan | Bulgu | Etki / öneri |
|---|---|---|---|
| P1 | Canlıya hazırlık | Telefon, WhatsApp, e-posta, adres ve Instagram bilgileri placeholder. Örn. `0555 000 00 00`, `siparis@otopolik.com`, `Örnek Mah.`. | Müşteri iletişimi ve marka güveni doğrudan zarar görür. Yayından önce tek bir merkezi yapılandırmadan gerçek bilgilerle güncellenmeli. |
| P1 | Ödeme | Sipariş ekranında “Kredi kartı ile ödeme — yakında aktif olacak” seçeneği devre dışı. | Kartla ödeme bekleyen kullanıcıyı siparişten düşürür. Ödeme sağlayıcısı entegre edilene kadar bu seçeneği ve ödeme vaadini görünür biçimde “yakında” sunmak yerine, desteklenen ödeme yöntemlerini netleştirin. |
| P1 | Katalog içeriği | Katalogda farklı ürünler olmasına rağmen kartların büyük kısmında aynı ad görünüyor: “Tüm Modeller EVA Paspas Seti”. Bu, bagaj havuzu, bagaj çantası, direksiyon kılıfı, minder ve ekran koruyucu için de geçerli. | Kullanıcı ürünün ne aldığını anlayamaz; reklam/fiyat eşleşmesi zayıflar. Her ürünün `name`, kategori, açıklama, görsel ve özellikleri ayrı veriyle bağlanmalı. |
| P2 | Mobil UI | Sabit WhatsApp düğmesi, ana sayfadaki araç bulucu başlangıcının üzerinde konumlanıyor. Mobil menü açıkken de “Ürünleri İncele” CTA’sının sağ tarafını kapatıyor. | Form ve ana CTA tıklanabilirliğini ve okunabilirliğini azaltır. Mobilde bu bölgelere yaklaşırken düğmeyi gizleyin/alta taşıyın veya güvenli alt boşluk ve çakışma kontrolü ekleyin. |
| P2 | Sepet / yüklenme | Sepeti dolu kullanıcı `/sepet` veya `/odeme` sayfasına ilk geçtiğinde kısa süre “Sepetiniz boş” durumu render ediliyor; ardından localStorage hydrate edilince gerçek sepet geliyor. | Özellikle ödeme akışında güven kaybı yaratır; kullanıcı yanlışlıkla geri dönebilir. Hydration tamamlanana kadar iskelet/yükleniyor durumu kullanın; boş sepeti yalnızca hydration sonrasında gösterin. |
| P2 | SEO | `/hakkimizda` ve `/iletisim` sayfalarında tarayıcı başlığı iki kez marka eki içeriyor: `Hakkımızda | OTO POLİK | OTO POLİK`. | Arama sonuçlarında ve paylaşım önizlemelerinde kalitesiz görünür. Sayfa metadata’larında yalnızca kısa başlık kullanın ya da global `title.template` ekini kaldırın. |
| P2 | Sipariş formu | Zorunlu alanlar mevcut; ancak alanlarda `name`, `autocomplete` ve telefon `pattern` tanımları yok. | Mobil otomatik doldurma ve telefon doğrulaması zayıf; sipariş kalitesi düşer. `name`/`autocomplete` (`name`, `tel`, `address-level2`, `street-address`) ve Türkiye telefon doğrulaması ekleyin. |
| P2 | Erişilebilirlik | Mobil başlıktaki sepet ikonu erişilebilir isim yerine yalnızca ürün sayısını (`2`) veriyor. | Ekran okuyucu kullanıcıları kontrolün işlevini anlayamaz. Butona `aria-label="Sepetim, 2 ürün"` benzeri dinamik bir ad verin. |
| P2 | Ürün performansı | Ürün detayında Next.js, LCP görselinin eager yüklenmediği uyarısını veriyor. | İlk içerik boyama ve ürün algısı yavaşlayabilir. Üstteki ana ürün görselinde `priority`/uygun eager yükleme kullanın; sadece gerçek LCP görselini önceliklendirin. |
| P3 | Ana sayfa içerik ritmi | Fayda şeridi aynı beş mesajı art arda iki kez tekrar ediyor. | Görsel gürültü ve “sonsuz şerit” hissi oluşturur. Tekrarı mobilde azaltın veya başı/sonu kesintisiz döngü için daha dengeli kurgulayın. |
| P3 | Bilgi mimarisi | Katalogda “Bagaj Paspası” filtre bağlantısı var, fakat sonuç sıfır ürün. Boş durum mesajı iyi; ancak kategori kullanıcıya aktif ürün varmış izlenimi veriyor. | Boş kategori bağlantısını ürün gelene kadar gizleyin veya “Yakında” etiketi verin. |

## Doğrulanan olumlu noktalar

- Ürün detayından ve tasarlayıcıdan sepete eklenen ürünler sepet çekmecesinde ve sipariş özetinde doğru göründü.
- Araç seçildikten sonra tasarlayıcıda model listesi açılıyor; seçime kadar sipariş düğmeleri bilinçli biçimde devre dışı.
- Katalog boş durumunda “Filtreleri Temizle” ve WhatsApp’a yönlendiren açık bir kurtarma akışı var.
- İncelenen tüm halka açık sayfalar render edildi; tarayıcı konsolunda çalışma zamanı hatası görülmedi.
- 375 px mobil görünümde yatay taşma tespit edilmedi.

## Öncelikli çözüm sırası

1. Gerçek iletişim/işletme bilgileri ile katalog ürün verilerini düzeltin.
2. Ödeme yöntemini netleştirin; kartla ödeme sunulacaksa entegrasyonu tamamlayın.
3. Mobil WhatsApp çakışmasını ve sepet hydration flaşını giderin.
4. Metadata, form otomatik doldurma/doğrulama ve ikon erişilebilirliğini iyileştirin.
5. LCP görseli ve içerik tekrarları için performans/ince ayar yapın.

## Teknik doğrulama notu

`npm run lint` şu anda başarısız. Halka açık header bileşeninde route değişiminde effect içinde doğrudan `setMenuOpen(false)` çağrısı React lint kuralına takılıyor. Admin sayfalarında da kullanılmayan importlar, `any` kullanımı ve effect içinden senkron state güncellemesi hataları var. Bunlar bu raporun UI bulgularından bağımsızdır; ancak CI/build kalite kapısına alınmadan önce düzeltilmelidir.

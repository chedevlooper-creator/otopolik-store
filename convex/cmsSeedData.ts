// =============================================================
// OTO POLİK — CMS Seed Verisi (mevcut vitrin metinleri)
// =============================================================

export type SeedPage = {
  slug: string;
  path: string;
  pageType: "marketing" | "legal" | "utility";
  metaTitle: string;
  metaDescription: string;
  title: string;
  description: string;
  sortOrder: number;
};

export type SeedSection = {
  pageSlug: string;
  sectionKey: string;
  sortOrder: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  iconKey?: string;
};

export const SITE_SEO_SEED = {
  siteName: "OTO POLİK",
  tagline: "Oto Paspasları",
  defaultDescription:
    "Aracınıza özel üretim, EVA malzemeden 4 mevsim kullanılabilir, çamura ve suya karşı üstün korumalı oto paspasları.",
  siteUrl: "https://otopolik.com",
  defaultOgImage: "/og.png",
  locale: "tr_TR",
  titleTemplate: "%s | OTO POLİK",
  ogImageAlt: "OTO POLİK — Aracına tam oturan premium koruma",
} as const;

export const CONTENT_PAGES_SEED: SeedPage[] = [
  {
    slug: "home",
    path: "/",
    pageType: "marketing",
    metaTitle: "OTO POLİK | Oto Paspasları",
    metaDescription: SITE_SEO_SEED.defaultDescription,
    title: "Ana Sayfa",
    description: "Ana sayfa bölüm başlıkları ve hero metinleri.",
    sortOrder: 0,
  },
  {
    slug: "hakkimizda",
    path: "/hakkimizda",
    pageType: "marketing",
    metaTitle: "Hakkımızda",
    metaDescription:
      "OTO POLİK hakkında — araca özel EVA oto paspası üretimi, milimetrik kalıp ve premium malzeme.",
    title: "Aracınız İçin Üstün Koruma",
    description: "Hakkımızda sayfası içerikleri.",
    sortOrder: 10,
  },
  {
    slug: "iletisim",
    path: "/iletisim",
    pageType: "marketing",
    metaTitle: "İletişim",
    metaDescription:
      "OTO POLİK iletişim — telefon, WhatsApp, e-posta ve adres bilgileri. Araç uyumluluğu ve sipariş sorularınız için bize yazın.",
    title: "Bize Ulaşın",
    description:
      "Aracınıza özel paspas seçimi, kargo durumu veya sipariş öncesi sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.",
    sortOrder: 20,
  },
  {
    slug: "urunler",
    path: "/urunler",
    pageType: "marketing",
    metaTitle: "Ürünler",
    metaDescription: "Araca özel üretim EVA oto paspası setlerini keşfedin.",
    title: "Araca Özel EVA Paspas Setleri",
    description:
      "Modelinizi bulun, size uygun EVA paspas setini inceleyin. Listede aracınızı göremiyorsanız WhatsApp üzerinden bize ulaşın, size özel üretim yapalım.",
    sortOrder: 30,
  },
  {
    slug: "olusturucu",
    path: "/olusturucu",
    pageType: "marketing",
    metaTitle: "Paspas Tasarla",
    metaDescription:
      "Aracınıza özel EVA paspas setini taban ve kenar renkleriyle tasarlayın.",
    title: "Paspasınızı Tasarlayın",
    description:
      "Marka ve modelinizi seçin, renkleri belirleyin, ekstraları ekleyin.",
    sortOrder: 40,
  },
  {
    slug: "sepet",
    path: "/sepet",
    pageType: "utility",
    metaTitle: "Sepetim",
    metaDescription: "Sepetinizdeki ürünleri inceleyin ve siparişi tamamlayın.",
    title: "Sepetim",
    description: "Sipariş özeti ve tamamlayıcı ürünler.",
    sortOrder: 50,
  },
  {
    slug: "odeme",
    path: "/odeme",
    pageType: "utility",
    metaTitle: "Sipariş",
    metaDescription: "Sipariş bilgilerinizi girin; WhatsApp veya kapıda ödeme ile tamamlayın.",
    title: "Siparişi Tamamla",
    description:
      "Bilgilerinizi girin. Siparişiniz WhatsApp üzerinden teyit edilecek; kapıda ödeme seçebilirsiniz.",
    sortOrder: 60,
  },
  {
    slug: "tesekkurler",
    path: "/tesekkurler",
    pageType: "utility",
    metaTitle: "Teşekkürler",
    metaDescription: "Sipariş talebiniz alındı.",
    title: "Sipariş talebiniz alındı",
    description:
      "Talebiniz kaydedildi. WhatsApp üzerinden kısa sürede sizinle iletişime geçeceğiz.",
    sortOrder: 70,
  },
  {
    slug: "kargo",
    path: "/bilgiler/kargo",
    pageType: "legal",
    metaTitle: "Kargo ve Teslimat",
    metaDescription:
      "Siparişlerinizin hazırlanma ve teslimat sürecine ilişkin bilgiler.",
    title: "Kargo ve Teslimat",
    description:
      "Siparişlerinizin hazırlanma ve teslimat sürecine ilişkin bilgiler.",
    sortOrder: 100,
  },
  {
    slug: "iade",
    path: "/bilgiler/iade",
    pageType: "legal",
    metaTitle: "İade ve Değişim",
    metaDescription:
      "İade veya değişim talebi oluşturmadan önce bu koşulları inceleyin.",
    title: "İade ve Değişim",
    description:
      "İade veya değişim talebi oluşturmadan önce bu koşulları inceleyin.",
    sortOrder: 110,
  },
  {
    slug: "ozel-uretim",
    path: "/bilgiler/ozel-uretim",
    pageType: "legal",
    metaTitle: "Özel Üretim Bilgilendirmesi",
    metaDescription:
      "Araca özel EVA paspas sipariş sürecinin nasıl ilerlediğini öğrenin.",
    title: "Özel Üretim Bilgilendirmesi",
    description:
      "Araca özel EVA paspas sipariş sürecinin nasıl ilerlediğini öğrenin.",
    sortOrder: 120,
  },
  {
    slug: "gizlilik",
    path: "/bilgiler/gizlilik",
    pageType: "legal",
    metaTitle: "Gizlilik ve Kişisel Verilerin Korunması",
    metaDescription:
      "Sipariş talebi sırasında paylaşılan kişisel bilgilerin kullanımına ilişkin bilgilendirme.",
    title: "Gizlilik ve Kişisel Verilerin Korunması",
    description:
      "Sipariş talebi sırasında paylaşılan kişisel bilgilerin kullanımına ilişkin bilgilendirme.",
    sortOrder: 130,
  },
  {
    slug: "mesafeli-satis",
    path: "/bilgiler/mesafeli-satis",
    pageType: "legal",
    metaTitle: "Mesafeli Satış Sözleşmesi",
    metaDescription:
      "WhatsApp üzerinden onaylanan siparişlere uygulanan mesafeli satış koşulları.",
    title: "Mesafeli Satış Sözleşmesi",
    description:
      "WhatsApp üzerinden onaylanan siparişlere uygulanan mesafeli satış koşulları.",
    sortOrder: 140,
  },
  {
    slug: "on-bilgilendirme",
    path: "/bilgiler/on-bilgilendirme",
    pageType: "legal",
    metaTitle: "Ön Bilgilendirme Formu",
    metaDescription: "Sipariş öncesi tüketici bilgilendirmesi.",
    title: "Ön Bilgilendirme Formu",
    description: "Sipariş öncesi tüketici bilgilendirmesi.",
    sortOrder: 150,
  },
];

export const CONTENT_SECTIONS_SEED: SeedSection[] = [
  // Home — hero
  {
    pageSlug: "home",
    sectionKey: "hero",
    sortOrder: 10,
    eyebrow: "Araca Özel Kalıp • Premium EVA • 1-3 Günde Kargo",
    title: "Aracınızın Zeminine",
    subtitle: "Kusursuz Uyum.",
    body: "Premium EVA teknolojisi ile üretilen, her araca özel tasarlanmış havuzlu paspaslar.",
    ctaLabel: "ARACINI SEÇ",
    ctaHref: "/olusturucu",
  },
  {
    pageSlug: "home",
    sectionKey: "hero-secondary-cta",
    sortOrder: 11,
    body: "",
    ctaLabel: "KOLEKSİYONU KEŞFET",
    ctaHref: "/urunler",
  },
  {
    pageSlug: "home",
    sectionKey: "featured",
    sortOrder: 20,
    eyebrow: "Öne çıkan ürünler",
    title: "Aracınıza yakışan koruma",
    body: "Araca özel paspas setinden bagaj düzenine kadar, aynı malzeme disipliniyle üretilen üç temel çözüm.",
    ctaLabel: "Tüm ürünleri gör",
    ctaHref: "/urunler",
  },
  {
    pageSlug: "home",
    sectionKey: "steps",
    sortOrder: 30,
    eyebrow: "Size özel üretim",
    title: "Üç adımda kusursuz uyum",
    body: "",
    ctaLabel: "Tasarlamaya başla",
    ctaHref: "/olusturucu",
  },
  {
    pageSlug: "home",
    sectionKey: "step-01",
    sortOrder: 31,
    title: "Aracını seç",
    body: "Marka, model ve model yılını seç; aracına özel kalıbı saniyeler içinde bul.",
    iconKey: "car",
  },
  {
    pageSlug: "home",
    sectionKey: "step-02",
    sortOrder: 32,
    title: "Tarzını belirle",
    body: "Taban ve kenar rengini eşleştir, aracının iç mekânına özel kombinasyonunu oluştur.",
    iconKey: "palette",
  },
  {
    pageSlug: "home",
    sectionKey: "step-03",
    sortOrder: 33,
    title: "Üretime gönder",
    body: "Uyumluluğu birlikte teyit edelim; setin 1-3 iş günü içinde kargoya çıksın.",
    iconKey: "package",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase",
    sortOrder: 40,
    eyebrow: "Malzeme ve gerçek uygulama",
    title: "Yakından bakınca fark edilen EVA işçiliği.",
    body: "Gösteriş için değil, araç tabanında kusursuz çalışması için tasarlandı. Görsellerin tamamı gerçek EVA set ve uygulama detaylarıdır.",
    ctaLabel: "Kendi setini oluştur",
    ctaHref: "/olusturucu",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-01",
    sortOrder: 41,
    eyebrow: "01 · Gerçek uygulama",
    title: "Taban hattını eksiksiz takip eder",
    body: "Kenar kıvrımları, sabitleme noktaları ve pedal boşluğu araca göre kesilir.",
    imageUrl: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
    imageAlt: "Kırmızı kenarlı siyah EVA paspasın araç içindeki gerçek uygulaması",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-02",
    sortOrder: 42,
    eyebrow: "02 · Tam set",
    title: "Ön ve arka sıra birlikte",
    body: "",
    imageUrl: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
    imageAlt: "Beş parçalı siyah EVA oto paspas seti",
    iconKey: "contain",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-03",
    sortOrder: 43,
    eyebrow: "03 · Renk uyumu",
    title: "İç mekâna göre seçim",
    body: "",
    imageUrl: "/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg",
    imageAlt: "Bej EVA paspasın araç içindeki gerçek uygulaması",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-gallery-04",
    sortOrder: 44,
    eyebrow: "04 · Detay",
    title: "Metal topukluk",
    body: "",
    imageUrl: "/media/scraped/evaotopaspas/paspas-seti/06-metal-topukluk.jpg",
    imageAlt: "EVA paspas üzerindeki metal sürücü topukluğu",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-feature-01",
    sortOrder: 45,
    title: "Milimetrik kalıp",
    body: "Aracın taban hattına özel CNC kesim",
    iconKey: "ruler",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-feature-02",
    sortOrder: 46,
    title: "Hücreli yüzey",
    body: "Su ve çamuru paspasın içinde tutar",
    iconKey: "droplets",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-feature-03",
    sortOrder: 47,
    title: "Güçlendirilmiş set",
    body: "Sürücü topukluğu ve sabitleme noktaları",
    iconKey: "layers",
  },
  {
    pageSlug: "home",
    sectionKey: "showcase-feature-04",
    sortOrder: 48,
    title: "Dört mevsim",
    body: "Kokusuz, esnek ve su geçirmez EVA",
    iconKey: "shield",
  },
  {
    pageSlug: "home",
    sectionKey: "faq",
    sortOrder: 50,
    eyebrow: "Sık sorulanlar",
    title: "Karar vermeden önce bilmeniz gerekenler",
    body: "",
  },
  {
    pageSlug: "home",
    sectionKey: "faq-sidebar",
    sortOrder: 51,
    title: "Aracınız listede yok mu?",
    body: "Marka, model, yıl ve kasa bilginizi gönderin. Doğru kalıbı birlikte teyit edip size uygun seti belirleyelim.",
    ctaLabel: "WhatsApp'tan sor",
    subtitle: "Ücretsiz uyumluluk kontrolü|Sipariş öncesi kalıp teyidi|Renk ve set önerisi",
  },
  {
    pageSlug: "home",
    sectionKey: "chrome-header",
    sortOrder: 1,
    title: "6.000+ araç modeli için özel kalıp",
    body: "{freeShippingThreshold}₺ üzeri ücretsiz kargo · {estimatedDispatch} içinde kargo",
  },
  {
    pageSlug: "home",
    sectionKey: "chrome-footer",
    sortOrder: 2,
    eyebrow: "Aracınıza özel üretim",
    title: "Doğru kalıbı seçin, tarzınızı yola taşıyın.",
    body: "Her araca özel kalıp, premium EVA malzeme ve titiz işçilik. Aracınızın iç mekânını koruyan modern çözümler.",
    ctaLabel: "Tasarımını başlat",
    ctaHref: "/olusturucu",
    subtitle: "İstanbul'da üretilir · Türkiye'ye gönderilir",
  },
  {
    pageSlug: "home",
    sectionKey: "testimonials",
    sortOrder: 60,
    eyebrow: "Müşteri Yorumları",
    title: "Araç sahipleri ne diyor?",
    body: "Gerçek kullanıcı deneyimleri",
  },

  {
    pageSlug: "sepet",
    sectionKey: "empty",
    sortOrder: 1,
    title: "Sepetiniz boş",
    body: "Aracınıza özel EVA paspas setini keşfetmek için ürünlere göz atın.",
    ctaLabel: "Ürünleri İncele",
    ctaHref: "/urunler",
  },
  {
    pageSlug: "odeme",
    sectionKey: "empty",
    sortOrder: 1,
    title: "Sepetiniz boş",
    body: "Ödeme adımına geçmeden önce sepetinize ürün ekleyin.",
    ctaLabel: "Ürünleri İncele",
    ctaHref: "/urunler",
  },
  {
    pageSlug: "tesekkurler",
    sectionKey: "body",
    sortOrder: 1,
    title: "Sipariş Özetiniz Hazır",
    body: "WhatsApp sohbet penceresinde hazırlanan sipariş detaylarını göndererek talebinizi tamamlayın. Mesaj gönderilmeden sipariş kesinleşmez. Ekibimiz mesajınızın ardından uyumluluğu teyit edip sizinle iletişime geçecektir.",
    ctaLabel: "Alışverişe Devam Et",
    ctaHref: "/urunler",
    subtitle: "Ana Sayfa",
  },

  // About paragraphs
  {
    pageSlug: "hakkimizda",
    sectionKey: "kicker",
    sortOrder: 1,
    title: "Hakkımızda",
    body: "",
  },
  {
    pageSlug: "hakkimizda",
    sectionKey: "image",
    sortOrder: 2,
    body: "",
    imageUrl: "/media/eva-rear-black.png",
    imageAlt: "OTO POLİK EVA paspas",
  },
  {
    pageSlug: "hakkimizda",
    sectionKey: "p1",
    sortOrder: 10,
    body: "{siteName}, araç sahiplerinin ihtiyaç duyduğu üstün koruma ve maksimum konforu bir araya getiren premium EVA oto paspasları üretir. Her ürünümüz, araç modeline özel kalıplarla üretilir; taban hatlarına milimetrik uyum sağlayarak hem estetik hem de fonksiyonel bir çözüm sunar.",
  },
  {
    pageSlug: "hakkimizda",
    sectionKey: "p2",
    sortOrder: 11,
    body: "Su, çamur, kar ve toza karşı dört mevsim koruma sağlayan EVA malzememiz kokusuzdur, esnektir ve uzun yıllar boyunca ilk günkü performansını korur. Kaymaz taban ve güçlendirilmiş topukluk yapısıyla sürüş güvenliğine katkı sağlar.",
  },
  {
    pageSlug: "hakkimizda",
    sectionKey: "p3",
    sortOrder: 12,
    body: "Misyonumuz, her araca özel üretim kalitesini uygun fiyatla müşterilerimize ulaştırmak ve satış sonrası desteğimizle yanınızda olmaktır.",
  },

  {
    pageSlug: "iletisim",
    sectionKey: "kicker",
    sortOrder: 1,
    title: "İletişim",
    body: "",
  },
  {
    pageSlug: "iletisim",
    sectionKey: "whatsapp-subtitle",
    sortOrder: 2,
    body: "Anında yazışın",
  },

  {
    pageSlug: "urunler",
    sectionKey: "kicker",
    sortOrder: 1,
    title: "Katalog",
    body: "",
  },

  {
    pageSlug: "olusturucu",
    sectionKey: "kicker",
    sortOrder: 1,
    title: "Özel tasarım",
    body: "",
  },

  // Legal sections
  {
    pageSlug: "kargo",
    sectionKey: "s1",
    sortOrder: 1,
    title: "Hazırlık süresi",
    body: "Siparişler, stok ve araç uyumluluğu teyidinin ardından {estimatedDispatch} içinde kargoya teslim edilir.",
  },
  {
    pageSlug: "kargo",
    sectionKey: "s2",
    sortOrder: 2,
    title: "Kargo ücreti",
    body: "{freeShippingThreshold}₺ ve üzerindeki siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde sabit kargo ücreti {shippingFee}₺ olarak sipariş özetinde gösterilir.",
  },
  {
    pageSlug: "kargo",
    sectionKey: "s3",
    sortOrder: 3,
    title: "Teslimat",
    body: "Teslimat süresi kargo firmasına ve teslimat adresine göre değişir. Sipariş onayı sırasında güncel tahmini teslimat bilgisi paylaşılır.",
  },
  {
    pageSlug: "iade",
    sectionKey: "s1",
    sortOrder: 1,
    title: "Başvuru",
    body: "İade veya değişim talebinizi sipariş numaranız ve ürün fotoğraflarıyla WhatsApp üzerinden iletebilirsiniz.",
  },
  {
    pageSlug: "iade",
    sectionKey: "s2",
    sortOrder: 2,
    title: "Özel üretim",
    body: "Araç uyumluluğuna göre hazırlanan ürünlerde Cayma hakkı, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği'ndeki istisnalar çerçevesinde değerlendirilir. Kullanılmış veya kişiye özel üretilmiş ürünlerde iade mümkün olmayabilir.",
  },
  {
    pageSlug: "iade",
    sectionKey: "s3",
    sortOrder: 3,
    title: "İnceleme",
    body: "Talebiniz incelenmeden ürünü göndermeyin. Onay sonrası gönderim adresi ve süreç bilgisi paylaşılır.",
  },
  {
    pageSlug: "ozel-uretim",
    sectionKey: "s1",
    sortOrder: 1,
    title: "Uyumluluk teyidi",
    body: "Marka, model, yıl ve kasa/versiyon bilgisi siparişten önce WhatsApp üzerinden teyit edilir.",
  },
  {
    pageSlug: "ozel-uretim",
    sectionKey: "s2",
    sortOrder: 2,
    title: "Set kapsamı",
    body: "Standart set kapsamı ürün sayfasında gösterilir. Bagaj paspası gibi opsiyonlar ayrıca teyit edilir.",
  },
  {
    pageSlug: "ozel-uretim",
    sectionKey: "s3",
    sortOrder: 3,
    title: "Değişiklik",
    body: "Araç bilgisinde farklılık varsa üretime geçmeden önce WhatsApp üzerinden bildirin.",
  },
  {
    pageSlug: "gizlilik",
    sectionKey: "s1",
    sortOrder: 1,
    title: "Toplanan bilgiler",
    body: "Sipariş talebi için ad, telefon, şehir, teslimat adresi ve sipariş notu alınır.",
  },
  {
    pageSlug: "gizlilik",
    sectionKey: "s2",
    sortOrder: 2,
    title: "Kullanım amacı",
    body: "Bu bilgiler yalnızca siparişi teyit etmek, teslimatı yürütmek ve gerektiğinde sizinle iletişime geçmek amacıyla kullanılır. Üçüncü kişilerle pazarlama amaçlı paylaşılmaz.",
  },
  {
    pageSlug: "gizlilik",
    sectionKey: "s3",
    sortOrder: 3,
    title: "Saklama",
    body: "Sipariş kayıtları yasal yükümlülüklerin gerektirdiği süre boyunca saklanır. Talepleriniz için WhatsApp veya e-posta üzerinden bize ulaşabilirsiniz.",
  },
  {
    pageSlug: "gizlilik",
    sectionKey: "s4",
    sortOrder: 4,
    title: "İletişim",
    body: "{email} · {phoneDisplay}",
  },
  {
    pageSlug: "gizlilik",
    sectionKey: "s5",
    sortOrder: 5,
    title: "Çerezler",
    body: "Site; sepet, oturum ve tercihleriniz için gerekli çerezler kullanır. İsteğe bağlı olarak Vercel Analytics ile anonim ziyaret istatistikleri toplanabilir. Banner üzerinden “Yalnızca gerekli” veya “Kabul et” seçebilirsiniz; tercihinizi tarayıcı verilerini temizleyerek sıfırlayabilirsiniz.",
  },
  {
    pageSlug: "mesafeli-satis",
    sectionKey: "s1",
    sortOrder: 1,
    title: "Taraflar",
    body: "Satıcı: {siteName}. Adres: {address}. İletişim: {phoneDisplay}, {email}. Alıcı: sipariş formunda belirtilen ad-soyad ve iletişim bilgilerine sahip tüketici.",
  },
  {
    pageSlug: "mesafeli-satis",
    sectionKey: "s2",
    sortOrder: 2,
    title: "Konu",
    body: "Bu sözleşme, alıcının elektronik ortamda sipariş ettiği EVA oto paspası ve aksesuar ürünlerinin satışı ile ilgili tarafların hak ve yükümlülüklerini düzenler.",
  },
  {
    pageSlug: "mesafeli-satis",
    sectionKey: "s3",
    sortOrder: 3,
    title: "Siparişin kurulması",
    body: "Sipariş talebi sitemiz üzerinden oluşturulur; kesinleşmesi WhatsApp üzerinden karşılıklı teyit ile tamamlanır. Teyit öncesi fiyat, kargo bedeli ve ürün özellikleri müşteriye bildirilir.",
  },
  {
    pageSlug: "mesafeli-satis",
    sectionKey: "s4",
    sortOrder: 4,
    title: "Ödeme",
    body: "Ödeme yöntemi WhatsApp onayı veya kapıda ödeme olarak seçilebilir. Kapıda ödemede ek hizmet bedeli uygulanmaz. Kredi kartı ile online tahsilat bu sürümde sunulmamaktadır.",
  },
  {
    pageSlug: "mesafeli-satis",
    sectionKey: "s5",
    sortOrder: 5,
    title: "Teslimat",
    body: "Üretim ve kargoya veriliş süresi yaklaşık {estimatedDispatch} olup adres/kargo firmasına göre değişiklik gösterebilir.",
  },
  {
    pageSlug: "mesafeli-satis",
    sectionKey: "s6",
    sortOrder: 6,
    title: "Cayma / iade",
    body: "Araca özel üretilen ürünlerde Mesafeli Sözleşmeler Yönetmeliği'ndeki istisnalar uygulanabilir. Detaylar için İade ve Değişim sayfasını inceleyin.",
  },
  {
    pageSlug: "on-bilgilendirme",
    sectionKey: "s1",
    sortOrder: 1,
    title: "Satıcı bilgileri",
    body: "{siteName} · {address} · Tel: {phoneDisplay} · E-posta: {email}",
  },
  {
    pageSlug: "on-bilgilendirme",
    sectionKey: "s2",
    sortOrder: 2,
    title: "Ürünün temel nitelikleri",
    body: "Ürün sayfalarında belirtilen marka/model uyumluluğu, set içeriği, malzeme ve fiyat bilgileri satışa konu ürünün temel nitelikleridir. Araç uyumluluğu sipariş öncesi ayrıca teyit edilir.",
  },
  {
    pageSlug: "on-bilgilendirme",
    sectionKey: "s3",
    sortOrder: 3,
    title: "Fiyat ve kargo",
    body: "Fiyatlar KDV dahildir. {freeShippingThreshold}₺ altı siparişlerde kargo ücreti {shippingFee}₺'dir.",
  },
  {
    pageSlug: "on-bilgilendirme",
    sectionKey: "s4",
    sortOrder: 4,
    title: "Ödeme ve onay",
    body: "Sipariş WhatsApp üzerinden onaylanır. Kapıda ödeme seçilebilir. Online kart ödemesi henüz yoktur.",
  },
  {
    pageSlug: "on-bilgilendirme",
    sectionKey: "s5",
    sortOrder: 5,
    title: "Cayma hakkı",
    body: "Tüketici, sözleşmeden cayma hakkına Mesafeli Sözleşmeler Yönetmeliği çerçevesinde sahiptir; kişiye özel üretilen mallarda yasal istisnalar saklıdır.",
  },
];

export const FAQ_SEED = [
  {
    sortOrder: 1,
    question: "EVA paspas her araca uyar mı?",
    answer:
      "Her set, seçtiğiniz marka ve modelin taban kalıbına göre üretilir; boşluk bırakmadan tam oturur. Listede aracınızı bulamazsanız WhatsApp'tan yazın.",
  },
  {
    sortOrder: 2,
    question: "Nasıl temizlenir?",
    answer:
      "Paspası araçtan çıkarın ve üzerine su tutun. Hücreli yapıdaki kirler kolayca akıp gider; günlük temizlik için özel bir ürüne ihtiyaç duymazsınız.",
  },
  {
    sortOrder: 3,
    question: "Kargo ne kadar sürer?",
    answer:
      "{estimatedDispatch} içinde kargoya verilir. {freeShippingThreshold}₺ üzeri siparişlerde kargo ücretsizdir.",
  },
  {
    sortOrder: 4,
    question: "Siparişten önce uyumluluk kontrol ediliyor mu?",
    answer:
      "Evet. Marka, model, yıl ve kasa bilgilerinizi sipariş öncesinde teyit ederek doğru kalıbın üretime alınmasını sağlıyoruz.",
  },
];

export const PROMO_SEED = [
  {
    kind: "marquee" as const,
    sortOrder: 1,
    label: "{freeShippingThreshold}₺ üzeri ücretsiz kargo",
  },
  {
    kind: "marquee" as const,
    sortOrder: 2,
    label: "Araca özel milimetrik kalıp",
  },
  {
    kind: "marquee" as const,
    sortOrder: 3,
    label: "Su ile kolay temizlik",
  },
  {
    kind: "marquee" as const,
    sortOrder: 4,
    label: "Sipariş öncesi uyumluluk onayı",
  },
  {
    kind: "marquee" as const,
    sortOrder: 5,
    label: "Kokusuz premium EVA",
  },
  {
    kind: "trust" as const,
    sortOrder: 1,
    label: "Araca özel ölçü",
    detail: "Taban hattına milimetrik uyum",
    iconKey: "ruler",
  },
  {
    kind: "trust" as const,
    sortOrder: 2,
    label: "Premium EVA",
    detail: "Kokusuz ve su geçirmez yapı",
    iconKey: "layers",
  },
  {
    kind: "trust" as const,
    sortOrder: 3,
    label: "Kalıp teyidi",
    detail: "Üretim öncesi uyumluluk kontrolü",
    iconKey: "check",
  },
  {
    kind: "trust" as const,
    sortOrder: 4,
    label: "Kapıda ödeme",
    detail: "Teslimatta ödeme seçeneği",
    iconKey: "banknote",
  },
  {
    kind: "header_badge" as const,
    sortOrder: 1,
    label: "6.000+ araç modeli için özel kalıp",
  },
  {
    kind: "footer_cta" as const,
    sortOrder: 1,
    label: "Doğru kalıbı seçin, tarzınızı yola taşıyın.",
    detail: "Aracınıza özel üretim",
    href: "/olusturucu",
  },
];

export const TESTIMONIALS_SEED = [
  {
    sortOrder: 1,
    name: "Mehmet K.",
    location: "İstanbul · VW Passat 2021",
    rating: 5,
    text: "Tam oturdu, 5 dakikada taktım. Çamurlu haftalarda bile zemin kuru kalıyor. Kargo da beklediğimden hızlı geldi.",
  },
  {
    sortOrder: 2,
    name: "Ayşe D.",
    location: "Ankara · Hyundai i20 2022",
    rating: 5,
    text: "Öncekinden çok farklı, su tutmuyor. Kokusuz olması en büyük artısı, yeni araç kokusu gitmedi.",
  },
  {
    sortOrder: 3,
    name: "Burak S.",
    location: "İzmir · BMW 3 Seri 2019",
    rating: 5,
    text: "Aracıma özel kesilmesi büyük konfor. Standart paspaslardan çok daha sağlam görünüyor, kayma yok.",
  },
];

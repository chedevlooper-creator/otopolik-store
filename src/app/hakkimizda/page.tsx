import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <span className="spec-label">Hakkımızda</span>
      <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
        Aracınız İçin Üstün Koruma
      </h1>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-border">
        <Image src="/media/eva-rear-black.png" alt="OTO POLİK EVA paspas" fill className="object-cover" />
      </div>
      <div className="mt-8 max-w-none space-y-5 leading-relaxed text-foreground/80">
        <p>
          {siteConfig.name}, araç sahiplerinin ihtiyaç duyduğu üstün koruma ve
          maksimum konforu bir araya getiren premium EVA oto paspasları üretir.
          Her ürünümüz, araç modeline özel kalıplarla üretilir; taban
          hatlarına milimetrik uyum sağlayarak hem estetik hem de fonksiyonel
          bir çözüm sunar.
        </p>
        <p>
          Su, çamur, kar ve toza karşı dört mevsim koruma sağlayan EVA
          malzememiz kokusuzdur, esnektir ve uzun yıllar boyunca ilk günkü
          performansını korur. Kaymaz taban ve güçlendirilmiş topukluk
          yapısıyla sürüş güvenliğine katkı sağlar.
        </p>
        <p>
          Misyonumuz, her araca özel üretim kalitesini uygun fiyatla
          müşterilerimize ulaştırmak ve satış sonrası desteğimizle yanınızda
          olmaktır.
        </p>
      </div>
    </div>
  );
}

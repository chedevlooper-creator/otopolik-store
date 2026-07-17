import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "6.000'den fazla araç için ürettiğimiz premium EVA paspasların gerçek araç içi çekimleri. Kaliteyi ve uyumu kendi gözlerinizle görün.",
  openGraph: {
    title: "Galeri | OTO POLİK",
    description:
      "Gerçek müşteri uygulamaları ve araç içi montajlardan seçilmiş fotoğraf ve videolar.",
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

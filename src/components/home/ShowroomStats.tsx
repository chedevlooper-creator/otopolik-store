import { ShieldCheckIcon, LayoutGridIcon, UsersIcon } from "lucide-react";

export default function ShowroomStats() {
  const stats = [
    {
      icon: <LayoutGridIcon className="h-8 w-8 text-[var(--red-hot)]" />,
      value: "6.000+",
      label: "Araç Modeli",
      desc: "Lazer taramalı milimetrik CNC kesim kalıbı",
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-[var(--red-hot)]" />,
      value: "15.000+",
      label: "Mutlu Sürücü",
      desc: "Türkiye geneli birebir uyumlu teslimat",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-[var(--red-hot)]" />,
      value: "%100",
      label: "Birebir Uyum Garantisi",
      desc: "Zeminde kaymayan sıfır hata toleransı",
    },
  ];

  return (
    <section className="blk border-b border-white/5 bg-black/20">
      <div className="wrap">
        <div className="head rev text-center flex flex-col items-center">
          <span className="mono">VERİLERLE OTO POLİK</span>
          <h2 className="mt-3 text-center">Mühendislik Standartlarımız</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-white/50">
            Kocaeli tesislerimizde son teknoloji tarama cihazları ve lazer kesim makineleriyle her araç için benzersiz hassasiyetle üretim yapıyoruz.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 mt-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rev flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-white/10 transition-all duration-300 group"
            >
              <div className="mb-4 flex items-center justify-center p-3 rounded-full bg-white/[0.02] group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <span className="font-heading text-4xl font-extrabold tracking-tight text-white">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-bold text-white/80 tracking-wide uppercase">
                {stat.label}
              </span>
              <p className="mt-2 text-xs text-white/40 leading-relaxed max-w-[200px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

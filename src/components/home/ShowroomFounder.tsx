import Image from "next/image";

export default function ShowroomFounder() {
  return (
    <section className="blk border-b border-white/5 bg-black/40">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Column: Image with HUD Frame */}
          <div className="rev relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5 bg-black/60 p-1.5 shadow-2xl">
            <Image
              src="/media/eva-laser-cut.png"
              alt="OTO POLİK CNC Lazer Kesim"
              fill
              className="object-cover rounded-xl opacity-90"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* HUD Decorative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 font-mono text-[9px] text-[var(--red-hot)] tracking-widest uppercase bg-black/60 px-2.5 py-1 rounded border border-white/10">
              SYS-MODEL: CNC_LAZER_PRO
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-white/40">
              TOLERANS: ±0,5 MM
            </div>
          </div>

          {/* Right Column: Founder Quote & Copy */}
          <div className="rev flex flex-col justify-center">
            <span className="mono" style={{ color: "var(--red-hot)" }}>MARKA HİKAYEMİZ</span>
            <blockquote className="mt-4 font-heading text-3xl font-bold leading-tight text-white tracking-tight">
              &ldquo;Hazır paspasların hiçbiri zemin hatlarına tam oturmuyordu.&rdquo;
            </blockquote>
            
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              OTO POLİK serüveni, aracımız için aradığımız hassaslığı piyasadaki standart paspaslarda bulamamamızla başladı. Bugün, 6.000&apos;den fazla araç modelini kapsayan lazer taramalı kalıp veritabanımızla hizmet veriyoruz.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Tek kuralımızdan asla ödün vermedik: Paspas, zemin havuzuyla milimetrik seviyede birleşmeli, pedal hareketlerine asla engel olmamalı ve ömür boyu şeklini korumalıdır.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-8 bg-white/20" />
              <div>
                <span className="block text-sm font-extrabold text-white tracking-wide">Can Polat</span>
                <span className="block text-xs text-white/40 font-mono tracking-wider mt-0.5 uppercase">Kurucu & Baş Mühendis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

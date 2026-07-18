import Link from "next/link";

export default function ShowroomFinalCTA() {
  return (
    <section className="final">
      <div className="inner wrap rev">
        <h2>Aracın seni bekliyor.</h2>
        <span className="mono">SİPARİŞ SONRASI ÜRETİM — STOKTAN DEĞİL, ARACINA GÖRE</span>
        <div>
          <Link
            className="btn-press btn-red-rich inline-flex items-center justify-center gap-2.5 rounded-full px-11 py-[19px] text-[13px] font-bold uppercase tracking-[0.09em] text-white"
            href="/olusturucu"
          >
            Aracını Seç →
          </Link>
        </div>
      </div>
    </section>
  );
}

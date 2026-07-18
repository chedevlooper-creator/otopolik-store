import Link from "next/link";

export default function ShowroomFinalCTA() {
  return (
    <section className="final">
      <div className="inner wrap rev">
        <h2>Aracın seni bekliyor.</h2>
        <span className="mono">SİPARİŞ SONRASI ÜRETİM — STOKTAN DEĞİL, ARACINA GÖRE</span>
        <div>
          <Link className="btn btn-red" href="/olusturucu" style={{ padding: "19px 44px" }}>
            Aracını Seç →
          </Link>
        </div>
      </div>
    </section>
  );
}

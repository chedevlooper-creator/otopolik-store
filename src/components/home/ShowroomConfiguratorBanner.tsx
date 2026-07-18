import Link from "next/link";

export default function ShowroomConfiguratorBanner() {
  return (
    <section className="blk" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="config rev">
          <div className="bg"></div>
          <div className="shade"></div>
          <div className="inner">
            <span className="mono" style={{ color: "var(--red-hot)" }}>TASARLA</span>
            <h2 style={{ marginTop: "12px" }}>Kendi setini <em>60 saniyede</em> tasarla.</h2>
            <p>Aracını seç, taban ve kenar rengini belirle, canlı önizlemeyle sipariş ver.</p>
            <div className="steps">
              <span className="step"><b>01</b> Araç</span>
              <span className="step"><b>02</b> Renk</span>
              <span className="step"><b>03</b> Sipariş</span>
            </div>
            <Link
              className="btn-press btn-red-rich inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.09em] text-white"
              href="/olusturucu"
            >
              Tasarlamaya Başla →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

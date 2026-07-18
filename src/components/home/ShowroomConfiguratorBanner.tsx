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
            <Link className="btn btn-red" href="/olusturucu">Tasarlamaya Başla →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

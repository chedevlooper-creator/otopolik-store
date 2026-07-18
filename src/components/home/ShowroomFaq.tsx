type FaqPair = { q: string; a: string };

type Props = {
  items: FaqPair[];
};

export default function ShowroomFaq({ items }: Props) {
  return (
    <section className="blk" id="sss" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head rev" style={{ justifyContent: "center", textAlign: "center" }}>
          <div style={{ width: "100%" }}>
            <span className="mono">SSS</span>
            <h2>Aklına takılanlar</h2>
          </div>
        </div>
        <div className="faq rev">
          {items.map((item, idx) => (
            <details key={idx}>
              <summary>{item.q}</summary>
              <p className="a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

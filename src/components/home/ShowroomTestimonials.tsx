const REVIEWS = [
  {
    stars: "★★★★★",
    quote: '"Kalıp birebir oturdu; kenarlarda milim boşluk yok. Vidasız, kaymadan duruyor. İyi ki almışım."',
    initials: "MK",
    name: "Mehmet K.",
    car: "BMW 3 Serisi (G20)",
  },
  {
    stars: "★★★★★",
    quote: '"Bej rengi iç mekânla harika uydu. Havuzlu kenar gerçekten işe yarıyor — yağmurlu haftayı sorunsuz atlattı."',
    initials: "ES",
    name: "Elif S.",
    car: "Togg T10X",
  },
  {
    stars: "★★★★★",
    quote: '"Salı sipariş verdim, perşembe kapımdaydı. Söküp yıkadım, iki dakikada kurudu. Bagaj havuzunu da aldım."',
    initials: "BA",
    name: "Burak A.",
    car: "VW Passat B8.5",
  },
];

export default function ShowroomTestimonials() {
  return (
    <section className="blk" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head rev">
          <div>
            <h2>Takan bir daha çıkarmıyor.</h2>
          </div>
        </div>
        <div className="quotes rev-stagger">
          {REVIEWS.map((r, idx) => (
            <div key={idx} className="q rev">
              <span className="stars" aria-label="5 yıldız">{r.stars}</span>
              <p>{r.quote}</p>
              <div className="who">
                <span className="av">{r.initials}</span>
                <span>
                  <b>{r.name}</b>
                  <span>{r.car}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

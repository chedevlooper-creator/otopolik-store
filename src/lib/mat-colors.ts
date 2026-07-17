export type MatColor = {
  name: string;
  hex: string;
  slug?: string;
};

export const FLOOR_COLORS = [
  { name: "Gece Siyahı", hex: "#0b0a0a", slug: "gece-siyahi" },
  { name: "Koyu Kahve", hex: "#170700", slug: "koyu-kahve" },
  { name: "Espresso", hex: "#170700", slug: "espresso" },
  { name: "Toprak Kahve", hex: "#834f3a", slug: "toprak-kahve" },
  { name: "Tarçın Kahve", hex: "#dc7338", slug: "tarcin-kahve" },
  { name: "Asil Bordo", hex: "#bd5c5d", slug: "asil-bordo" },
  { name: "Sıcak Karamel", hex: "#5c1f00", slug: "sicak-karamel" },
  { name: "Kıyı Beji", hex: "#be8861", slug: "kiyi-beji" },
  { name: "Kum Işığı", hex: "#edd4b8", slug: "kum-isigi" },
  { name: "Gün Işığı", hex: "#f79000", slug: "gun-isigi" },
  { name: "Gece Mavisi", hex: "#313e5d", slug: "gece-mavisi" },
  { name: "Saks Mavisi", hex: "#313e5d", slug: "saks-mavisi" },
  { name: "Şehrin Grisi", hex: "#868485", slug: "sehrin-grisi" },
] as const satisfies readonly MatColor[];

export const EDGE_COLORS = [
  { name: "Gece Siyahı", hex: "#2e292c", slug: "gece-siyahi" },
  { name: "Espresso", hex: "#56362e", slug: "espresso" },
  { name: "Toprak Kahve", hex: "#894c2c", slug: "toprak-kahve" },
  { name: "Haki Yeşil", hex: "#292a18", slug: "haki-yesil" },
  { name: "Şehrin Grisi", hex: "#544648", slug: "sehrin-grisi" },
  { name: "Kirli Beyaz", hex: "#aaa5a4", slug: "kirli-beyaz" },
  { name: "Kum Işığı", hex: "#b79688", slug: "kum-isigi" },
  { name: "Sıcak Karamel", hex: "#a2480b", slug: "sicak-karamel" },
  { name: "Turuncu", hex: "#ed6b22", slug: "turuncu" },
  { name: "Asil Bordo", hex: "#5d0007", slug: "asil-bordo" },
  { name: "Alev Kırmızı", hex: "#ec4e3d", slug: "alev-kirmizi" },
  { name: "Fuşya Pembesi", hex: "#ff97bb", slug: "fusya-pembesi" },
  { name: "Pudra Pembe", hex: "#f1acc6", slug: "pudra-pembe" },
  { name: "Lavanta Moru", hex: "#cd9ce0", slug: "lavanta-moru" },
  { name: "Duman Moru", hex: "#795d91", slug: "duman-moru" },
  { name: "Gece İndigosu", hex: "#39374c", slug: "gece-indigosu" },
  { name: "Saks Mavisi", hex: "#335eb3", slug: "saks-mavisi" },
  { name: "Kristal Mavisi", hex: "#30c3dd", slug: "kristal-mavisi" },
  { name: "Açık Mavi", hex: "#0bb2c6", slug: "acik-mavi" },
  { name: "Okyanus Yeşili", hex: "#002127", slug: "okyanus-yesili" },
  { name: "Mint Yeşili", hex: "#658e58", slug: "mint-yesili" },
  { name: "Limon Yeşili", hex: "#cfe877", slug: "limon-yesili" },
  { name: "Canlı Sarı", hex: "#eebe00", slug: "canli-sari" },
] as const satisfies readonly MatColor[];

export const FLOOR_COLOR_NAMES = FLOOR_COLORS.map((color) => color.name);
export const EDGE_COLOR_NAMES = EDGE_COLORS.map((color) => color.name);

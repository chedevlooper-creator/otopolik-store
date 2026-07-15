export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: "eva-3d" | "eva-havuzlu" | "hali-paspas" | "bagaj" | "bagaj-havuzu" | "bagaj-cantasi" | "direksiyon-kilifi" | "minder-seti" | "ekran-koruyucu";
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  description: string;
  features: string[];
  compatibility: {
    yearRange: string;
    bodyOrChassis: string;
    note: string;
  };
  setContents: string[];
  optionalExtras: string[];
  dispatchEstimate: string;
  badge?: string;
  inStock?: boolean;
  isActive?: boolean;
};

export type CartItemConfiguration = {
  vehicle?: string;
  baseColor?: string;
  edgeColor?: string;
  heelPad?: boolean;
  trunkMat?: boolean;
};

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string;
  quantity: number;
  /** Konfigüratör özel tasarım detayı — siparişe aktarılır */
  configuration?: CartItemConfiguration;
};

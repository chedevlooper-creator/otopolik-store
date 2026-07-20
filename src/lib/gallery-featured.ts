import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery-media";

const FEATURED_PHOTO_PATHS = [
  "/media/galeri/musteri/photo_5845771899898629465_w.webp",
  "/media/galeri/musteri/photo_5913595644025179581_w.webp",
  "/media/galeri/musteri/photo_6048734054099652074_w.webp",
  "/media/galeri/musteri/photo_5906683564177165681_w.webp",
  "/media/galeri/musteri/photo_5893451229499690967_w.webp",
  "/media/galeri/musteri/photo_5296399832748596372_w.webp",
  "/media/galeri/musteri/photo_5872860529217441550_w.webp",
  "/media/galeri/musteri/photo_5222318759358437776_w.webp",
  "/media/galeri/musteri/photo_5787249693430583343_w.webp",
  "/media/galeri/musteri/photo_5949742393730993938_w.webp",
  "/media/galeri/musteri/photo_6028468658935369350_w.webp",
  "/media/galeri/musteri/photo_6039562318942768644_w.webp",
  "/media/galeri/musteri/photo_5875222516417105562_w.webp",
  "/media/galeri/musteri/photo_5805194698153464026_w.webp",
  "/media/galeri/musteri/photo_5918175303228395302_w.webp",
  "/media/galeri/musteri/photo_5927193811132026744_w.webp",
  "/media/galeri/musteri/photo_5771790740332678919_w.webp",
  "/media/galeri/musteri/photo_5445155157462161177_w.webp",
] as const;

const itemByPath = new Map(GALLERY_ITEMS.map((item) => [item.src, item]));

export const FEATURED_GALLERY_ITEMS: GalleryItem[] = FEATURED_PHOTO_PATHS.flatMap(
  (src) => {
    const item = itemByPath.get(src);
    return item ? [item] : [];
  },
);

const featuredPaths = new Set<string>(FEATURED_PHOTO_PATHS);

export const ORDERED_GALLERY_ITEMS: GalleryItem[] = [
  ...FEATURED_GALLERY_ITEMS,
  ...GALLERY_ITEMS.filter((item) => !featuredPaths.has(item.src)),
];

export const CONFIGURATOR_GALLERY_ITEMS = FEATURED_GALLERY_ITEMS.slice(0, 12);

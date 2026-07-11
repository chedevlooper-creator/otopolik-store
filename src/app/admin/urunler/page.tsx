"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  EyeIcon,
  PackageIcon,
  FilterIcon,
} from "lucide-react";
import { products as allProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";

const KATEGORILER = [
  { key: "tumu", label: "Tümü" },
  { key: "eva-3d", label: "3D EVA Paspas" },
  { key: "eva-havuzlu", label: "Havuzlu EVA Paspas" },
  { key: "bagaj", label: "Bagaj Paspası" },
];

export default function AdminUrunler() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("tumu");

  const filtered = allProducts.filter((p) => {
    if (kategori !== "tumu" && p.category !== kategori) return false;
    if (search) {
      const q = search.toLocaleLowerCase("tr-TR");
      return `${p.brand} ${p.model} ${p.name}`.toLocaleLowerCase("tr-TR").includes(q);
    }
    return true;
  });

  const toplamStok = filtered.length;
  const ortalamaFiyat = filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + p.price, 0) / filtered.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Ürünler
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {toplamStok} ürün · Ortalama fiyat: {formatPrice(ortalamaFiyat)}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {KATEGORILER.map((k) => (
            <button
              key={k.key}
              type="button"
              onClick={() => setKategori(k.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                kategori === k.key
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-neutral-700 bg-[#141414] text-neutral-400 hover:border-neutral-600"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Marka veya model ara..."
            className="w-full rounded-full border border-neutral-600 py-2 pl-10 pr-4 text-sm focus:border-brand-red focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Ürün grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-600 bg-[#141414] px-6 py-16 text-center">
          <FilterIcon className="mx-auto h-8 w-8 text-neutral-300" aria-hidden="true" />
          <p className="mt-2 text-sm text-neutral-500">Aramanıza uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.slug}
              className="group flex gap-4 rounded-2xl border border-neutral-700 bg-[#141414] p-4 transition-colors hover:border-neutral-600 hover:shadow-md"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-800">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {product.badge && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-red px-2 py-0.5 text-[9px] font-bold text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {product.brand}
                  </span>
                  <h3 className="line-clamp-1 text-sm font-bold text-white">
                    {product.model}
                  </h3>
                  <p className="text-xs text-neutral-500">{product.category === "eva-havuzlu" ? "Havuzlu" : product.category === "bagaj" ? "Bagaj" : "3D EVA"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-extrabold text-brand-red">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-brand-red"
                      aria-label="Düzenle"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-brand-red"
                      aria-label="Sil"
                    >
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toplu işlem çubuğu */}
      <div className="rounded-2xl border border-neutral-700 bg-[#141414] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-sm font-bold text-white">Hızlı İstatistikler</p>
            <p className="text-xs text-neutral-500">
              {filtered.filter((p) => p.oldPrice).length} üründe indirim var ·{" "}
              {filtered.filter((p) => p.badge).length} üründe rozet aktif
            </p>
          </div>
          <a
            href="/urunler"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
          >
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
            Mağazada Görüntüle
          </a>
        </div>
      </div>
    </div>
  );
}

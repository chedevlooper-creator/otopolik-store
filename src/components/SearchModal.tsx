"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  CarFrontIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useCatalogProducts } from "@/context/catalog-context";
import { CATEGORY_LABELS } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { normalizeSearchText, searchVehicles } from "@/lib/vehicle-search";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const products = useCatalogProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const { productResults, vehicleResults } = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      return { productResults: [], vehicleResults: [] };
    }

    return {
      productResults: products
        .filter((product) =>
          normalizeSearchText(
            [
              product.name,
              product.brand,
              product.model,
              CATEGORY_LABELS[product.category],
              product.description,
            ].join(" ")
          ).includes(normalizedQuery)
        )
        .slice(0, 4),
      vehicleResults: searchVehicles(query, 5),
    };
  }, [query, products]);

  const hasResults = productResults.length > 0 || vehicleResults.length > 0;
  const catalogHref = query.trim()
    ? `/urunler?q=${encodeURIComponent(query.trim())}`
    : "/urunler";

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-search-title"
      aria-describedby="site-search-help"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/85 px-4 pt-16 backdrop-blur-md sm:pt-24"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="surface-glass w-full max-w-2xl overflow-hidden rounded-[1.4rem] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-4 sm:px-5">
          <h2 id="site-search-title" className="sr-only">
            Araç ve ürün ara
          </h2>
          <p id="site-search-help" className="sr-only">
            Araç modeli, marka, ürün veya kategori adı yazın.
          </p>
          <SearchIcon className="h-5 w-5 shrink-0 text-sand" aria-hidden="true" />
          <label htmlFor="site-search-input" className="sr-only">
            Araç modeli veya ürün adı
          </label>
          <input
            id="site-search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Golf, Egea, Passat veya ürün ara…"
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Aramayı kapat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-foreground"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="sr-only" role="status" aria-live="polite">
            {query.trim()
              ? `${vehicleResults.length} araç ve ${productResults.length} ürün eşleşmesi bulundu.`
              : "Arama yapmaya hazır."}
          </p>
          {query.trim().length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              Araç modeli, marka, ürün veya kategori adı yazın. Örn:
              &ldquo;Passat&rdquo;, &ldquo;Egea&rdquo;, &ldquo;bagaj&rdquo;.
            </p>
          ) : !hasResults ? (
            <div className="px-3 py-7 text-center">
              <p className="text-sm font-semibold text-white">
                &ldquo;{query}&rdquo; için eşleşme bulunamadı.
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted">
                Yazımı kontrol edin veya detaylı filtrelerle yeniden deneyin.
              </p>
              <Link
                href={catalogHref}
                onClick={onClose}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-sand hover:border-sand/50"
              >
                Katalogda detaylı ara
              </Link>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              {vehicleResults.length > 0 && (
                <section aria-labelledby="search-vehicle-results">
                  <h3
                    id="search-vehicle-results"
                    className="spec-label px-3 pb-1.5 pt-1"
                  >
                    Araçlar
                  </h3>
                  <ul className="space-y-1">
                    {vehicleResults.map((vehicle) => (
                      <li key={`${vehicle.brand}-${vehicle.model}`}>
                        <Link
                          href={vehicle.href}
                          onClick={onClose}
                          className="group flex min-h-16 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-white/10 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-sand/5 text-sand">
                            <CarFrontIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="spec-value block text-[10px] font-bold uppercase tracking-[0.14em] text-sand">
                              {vehicle.brand}
                            </span>
                            <span className="block text-sm font-semibold text-foreground">
                              {vehicle.displayModel}
                            </span>
                            <span className="spec-value block text-[11px] text-muted">
                              {vehicle.bodyType} · Araca özel ürünleri gör
                            </span>
                          </span>
                          <ArrowRightIcon
                            className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-sand"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {productResults.length > 0 && (
                <section aria-labelledby="search-product-results">
                  <h3
                    id="search-product-results"
                    className="spec-label px-3 pb-1.5 pt-1"
                  >
                    Ürünler
                  </h3>
                  <ul className="space-y-1">
                    {productResults.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/urunler/${product.slug}`}
                          onClick={onClose}
                          className="flex min-h-16 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-white/8 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                        >
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-background">
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="spec-value block text-[10px] font-bold uppercase tracking-[0.14em] text-sand">
                              {CATEGORY_LABELS[product.category]}
                            </span>
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {product.name}
                            </span>
                            <span className="spec-value block text-[11px] text-muted">
                              {product.brand} · {product.model}
                            </span>
                          </span>
                          <span className="spec-value shrink-0 text-sm font-semibold text-sand">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/8 bg-background/45 px-4 py-3 text-[10px] text-muted sm:px-5">
          <span className="spec-value uppercase tracking-[0.14em]">ESC ile kapat</span>
          <Link
            href={catalogHref}
            onClick={onClose}
            className="spec-value font-bold uppercase tracking-[0.14em] text-sand hover:underline"
          >
            Tüm sonuçlar →
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon, XIcon } from "lucide-react";
import { useCatalogProducts } from "@/context/catalog-context";
import { CATEGORY_LABELS } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
};

function supportsClosedBy() {
  return typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;
}

export default function SearchModal({ open, onClose }: Props) {
  const products = useCatalogProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.setAttribute("closedby", "any");

    if (open) {
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }

    if (dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const syncClosed = () => {
      setQuery("");
      onClose();
    };
    dialog.addEventListener("close", syncClosed);

    // closedby fallback — Safari and older browsers
    let onBackdropClick: ((event: MouseEvent) => void) | undefined;
    if (!supportsClosedBy()) {
      onBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (inContent) return;
        dialog.close();
      };
      dialog.addEventListener("click", onBackdropClick);
    }

    return () => {
      dialog.removeEventListener("close", syncClosed);
      if (onBackdropClick) dialog.removeEventListener("click", onBackdropClick);
    };
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.brand, p.model, CATEGORY_LABELS[p.category]]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Ürün arama"
      className="search-dialog m-0 mt-16 w-[calc(100%-2rem)] max-w-2xl border-0 bg-transparent p-0 open:flex open:flex-col sm:mt-24"
    >
      <div className="surface-glass w-full overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-4 sm:px-5">
          <SearchIcon className="h-5 w-5 shrink-0 text-sand" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, marka veya kategori ara…"
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
            aria-label="Ürün arama kutusu"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Aramayı kapat"
            className="flex h-9 w-9 items-center justify-center border border-transparent text-muted hover:border-white/12 hover:bg-white/[0.04] hover:text-foreground"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              Ürün, marka veya kategori adı yazın. Örn: &ldquo;Passat&rdquo;, &ldquo;bagaj&rdquo;.
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              &ldquo;{query}&rdquo; için sonuç bulunamadı.
            </p>
          ) : (
            <ul className="space-y-1" role="listbox" aria-label="Arama sonuçları">
              {results.map((p) => (
                <li key={p.slug} role="option" aria-selected="false">
                  <Link
                    href={`/urunler/${p.slug}`}
                    onClick={() => dialogRef.current?.close()}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-white/8 hover:bg-white/[0.04]"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-background">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="48px"
                        fetchPriority="low"
                        className="object-contain p-1"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="spec-value block text-[10px] font-bold uppercase tracking-[0.14em] text-sand">
                        {CATEGORY_LABELS[p.category]}
                      </span>
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {p.name}
                      </span>
                      <span className="spec-value block text-[11px] text-muted">
                        {p.brand} · {p.model}
                      </span>
                    </span>
                    <span className="spec-value shrink-0 text-sm font-semibold text-sand">
                      {formatPrice(p.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/8 bg-background/45 px-4 py-3 text-[10px] text-muted sm:px-5">
          <span className="spec-value uppercase tracking-[0.14em]">ESC ile kapat</span>
          <Link
            href="/urunler"
            onClick={() => dialogRef.current?.close()}
            className="spec-value font-bold uppercase tracking-[0.14em] text-sand hover:underline"
          >
            Tüm ürünler →
          </Link>
        </div>
      </div>
    </dialog>
  );
}

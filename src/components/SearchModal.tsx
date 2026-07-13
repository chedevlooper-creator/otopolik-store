"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon, XIcon } from "lucide-react";
import { products } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/products";
import { formatPrice } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
  }, [query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ürün arama"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/85 px-4 pt-16 backdrop-blur-md sm:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
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
            onClick={onClose}
            aria-label="Aramayı kapat"
            className="rounded p-1 text-muted hover:bg-surface-hover hover:text-foreground"
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
                    onClick={onClose}
                    className="flex items-center gap-3 border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-surface-hover"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden border border-border bg-background">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="48px"
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
        <div className="flex items-center justify-between border-t border-border bg-background/50 px-4 py-2 text-[10px] text-muted">
          <span className="spec-value uppercase tracking-[0.14em]">ESC ile kapat</span>
          <Link
            href="/urunler"
            onClick={onClose}
            className="spec-value font-bold uppercase tracking-[0.14em] text-sand hover:underline"
          >
            Tüm ürünler →
          </Link>
        </div>
      </div>
    </div>
  );
}

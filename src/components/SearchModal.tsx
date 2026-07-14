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
        ref={dialogRef}
        className="surface-glass w-full max-w-2xl overflow-hidden rounded-[1.4rem] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
            onClick={onClose}
            aria-label="Aramayı kapat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-foreground"
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
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-white/8 hover:bg-white/[0.04]"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-background">
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
        <div className="flex items-center justify-between border-t border-white/8 bg-background/45 px-4 py-3 text-[10px] text-muted sm:px-5">
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

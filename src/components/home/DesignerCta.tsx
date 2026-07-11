import Link from "next/link";
import { PaletteIcon, ArrowRightIcon } from "lucide-react";

const SWATCHES = ["#16161a", "#8a8f96", "#c9b79c", "#5e1a22", "#8B1A2B", "#1e3a5f", "#2456a6", "#e07a20"];

export default function DesignerCta() {
  return (
    <section className="border-t border-neutral-800 bg-[#141414]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
        <Link
          href="/olusturucu"
          className="group flex flex-col gap-6 overflow-hidden rounded-2xl bg-neutral-900 p-6 transition-colors hover:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white">
              <PaletteIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-extrabold text-white sm:text-xl">
                Paspasını Kendin Tasarla
              </h2>
              <p className="mt-1 text-sm text-white/60">
                64 renk kombinasyonu — taban ve kenar rengini seç, canlı önizlemeyle gör.
              </p>
              <div className="mt-3 flex items-center gap-1">
                {SWATCHES.slice(0, 6).map((hex) => (
                  <span
                    key={hex}
                    className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <span className="ml-1 text-xs text-white/40">+daha</span>
              </div>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-[#141414] px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-neutral-700 sm:self-auto">
            Tasarlamaya Başla
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}

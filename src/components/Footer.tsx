"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  RulerIcon,
  TruckIcon,
  ScissorsIcon,
  CheckIcon,
} from "lucide-react";

const TRUST_BADGES = [
  { icon: RulerIcon, label: "Araca özel lazer kalıp", sub: "Milimetrik uyum" },
  { icon: ScissorsIcon, label: "Premium EVA malzeme", sub: "Kokusuz, dayanıklı" },
  { icon: TruckIcon, label: "1-3 günde kargoda", sub: "Ücretsiz gönderim fırsatı" },
];

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.5 8.5C2.5 6 4 4.5 6.5 4.5h11C20 4.5 21.5 6 21.5 8.5v7c0 2.5-1.5 4-4 4h-11c-2.5 0-4-1.5-4-4z" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </svg>
  );
}

const SOCIAL_LINKS: { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { href: siteConfig.instagram, label: "Instagram", icon: InstagramIcon },
  { href: "https://youtube.com/@otopolik", label: "YouTube", icon: YoutubeIcon },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setStatus("err");
      return;
    }
    setStatus("ok");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4" noValidate>
      <label htmlFor="footer-newsletter" className="sr-only">
        E-posta adresi
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="footer-newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="ornek@eposta.com"
          aria-invalid={status === "err"}
          className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-sand focus:outline-none"
        />
        <button
          type="submit"
          className="btn-press inline-flex shrink-0 items-center justify-center gap-1.5 bg-brand-red px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
        >
          {status === "ok" ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : null}
          {status === "ok" ? "Eklendi" : "Abone Ol"}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-muted" aria-live="polite">
        {status === "ok"
          ? "Teşekkürler! Yeni kampanyalardan ilk siz haberdar olacaksınız."
          : status === "err"
            ? "Geçerli bir e-posta adresi girin."
            : "Kampanya ve yeni ürünlerden haberdar olun. Spam göndermeyiz."}
      </p>
    </form>
  );
}

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-background text-white">
      {/* Trust badges band */}
      <div className="border-b border-dashed border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-stretch px-4">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }, index) => (
            <div
              key={label}
              className={`flex flex-1 items-center gap-3 py-5 min-[480px]:min-w-[180px] ${
                index !== 0 ? "border-l border-border pl-5 sm:pl-6" : ""
              } ${index !== TRUST_BADGES.length - 1 ? "sm:pr-6" : ""}`}
            >
              <Icon className="h-5 w-5 shrink-0 text-sand" aria-hidden="true" />
              <div>
                <p className="spec-value text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  {label}
                </p>
                <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <span className="font-heading text-3xl font-bold uppercase tracking-wide">
              OTO<span className="text-brand-red">POLİK</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Premium EVA paspas setleri. Her araca özel, milimetrik uyumlu üretim. 4 mevsim, tek sıkım suyla temizlik.
            </p>
            <div className="mt-6 space-y-3 text-sm text-foreground/70">
              <a
                href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
                className="spec-value inline-flex items-center gap-2.5 transition-colors hover:text-sand"
              >
                <PhoneIcon className="h-4 w-4 text-sand" aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
              <br />
              <a
                href={`mailto:${siteConfig.email}`}
                className="spec-value inline-flex items-center gap-2.5 transition-colors hover:text-sand"
              >
                <MailIcon className="h-4 w-4 text-sand" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <span className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sand" aria-hidden="true" />
                <span className="leading-relaxed">{siteConfig.address}</span>
              </span>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-border text-muted transition-colors hover:border-sand hover:text-sand"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="spec-label mb-5">Sayfalar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/urunler" className="text-foreground/60 transition-colors hover:text-sand">Ürünler</Link></li>
              <li><Link href="/olusturucu" className="text-foreground/60 transition-colors hover:text-sand">Paspas Tasarla</Link></li>
              <li><Link href="/iletisim" className="text-foreground/60 transition-colors hover:text-sand">İletişim</Link></li>
              <li><Link href="/hakkimizda" className="text-foreground/60 transition-colors hover:text-sand">Hakkımızda</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="spec-label mb-5">Bilgi</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/bilgiler/kargo" className="text-foreground/60 transition-colors hover:text-sand">Kargo ve Teslimat</Link></li>
              <li><Link href="/bilgiler/iade" className="text-foreground/60 transition-colors hover:text-sand">İade ve Değişim</Link></li>
              <li><Link href="/bilgiler/gizlilik" className="text-foreground/60 transition-colors hover:text-sand">Gizlilik</Link></li>
              <li><Link href="/sepet" className="text-foreground/60 transition-colors hover:text-sand">Sepetim</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="spec-label mb-5">Bülten</h3>
            <p className="text-sm text-muted">
              Kampanya ve yeni ürünlerden ilk siz haberdar olun.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted">
          <span className="spec-value">© {currentYear ?? 2026} {siteConfig.name}</span>
          <div className="flex items-center gap-4">
            <span className="spec-value text-white/20" aria-hidden="true">|</span>
            <span className="spec-value">Premium EVA Paspas Üreticisi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

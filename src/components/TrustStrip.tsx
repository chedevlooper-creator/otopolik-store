import { ShieldCheckIcon, LockIcon, BadgeCheckIcon, CreditCardIcon, BanknoteIcon, MessageCircleIcon } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheckIcon, label: "SSL Şifreli" },
  { icon: BadgeCheckIcon, label: "Güvenli Ödeme" },
  { icon: BanknoteIcon, label: "Kapıda Ödeme" },
  { icon: MessageCircleIcon, label: "WhatsApp Onay" },
  { icon: CreditCardIcon, label: "Kredi Kartı (Yakında)" },
  { icon: LockIcon, label: "KVKK Uyumlu" },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Güven sinyalleri"
      className="border-y border-dashed border-border bg-surface/40"
    >
      <div className="mx-auto max-w-7xl px-4 py-5">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-2 border border-border bg-background/60 px-3 py-2.5"
            >
              <Icon className="h-4 w-4 shrink-0 text-sand" aria-hidden="true" />
              <span className="spec-value text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/85">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

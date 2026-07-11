import { type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  variant?: "default" | "red" | "green" | "blue" | "amber";
};

const variants = {
  default: "bg-[#141414] border-neutral-700",
  red: "bg-neutral-800/60 border-neutral-700",
  green: "bg-green-50/60 border-green-100",
  blue: "bg-blue-50/60 border-blue-100",
  amber: "bg-amber-50/60 border-amber-100",
};

const iconBg = {
  default: "bg-neutral-800 text-neutral-300",
  red: "bg-neutral-700 text-brand-red",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
};

export default function StatCard({ label, value, change, icon: Icon, variant = "default" }: Props) {
  return (
    <div className={`rounded-2xl border p-5 ${variants[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg[variant]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="font-heading mt-3 text-2xl font-extrabold text-white">
        {value}
      </p>
      {change && (
        <p className="mt-1 text-xs font-medium text-neutral-500">
          <span className={change.startsWith("+") ? "text-green-600" : "text-brand-red"}>
            {change}
          </span>{" "}
          son 7 gün
        </p>
      )}
    </div>
  );
}

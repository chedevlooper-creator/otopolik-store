import { type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  change?: string | null;
  icon: LucideIcon;
  variant?: "default" | "red" | "green" | "blue" | "amber";
};

const variants = {
  default: "bg-surface border-border",
  red: "bg-surface-hover border-border",
  green: "bg-green-500/10 border-green-500/30",
  blue: "bg-blue-500/10 border-blue-500/30",
  amber: "bg-amber-500/10 border-amber-500/30",
};

const iconBg = {
  default: "bg-surface-hover text-foreground",
  red: "bg-surface-hover text-brand-red",
  green: "bg-green-500/10 text-green-400",
  blue: "bg-blue-500/10 text-blue-400",
  amber: "bg-amber-500/10 text-amber-400",
};

export default function StatCard({ label, value, change, icon: Icon, variant = "default" }: Props) {
  return (
    <div className={`border p-5 ${variants[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <span className={`flex h-10 w-10 items-center justify-center ${iconBg[variant]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="font-heading mt-3 text-2xl font-extrabold text-white">
        {value}
      </p>
      {change && (
        <p className="mt-1 text-xs font-medium text-muted">
          <span className={change.startsWith("+") ? "text-green-600" : "text-brand-red"}>
            {change}
          </span>{" "}
          son 7 gün
        </p>
      )}
    </div>
  );
}

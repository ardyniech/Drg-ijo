import { Progress } from "@/components/ui/progress";
import { rupiah } from "../types";
import { ShieldAlert, Heart, Coins } from "lucide-react";

export function KasContributionProgress() {
  const targets = [
    {
      label: "Iuran Wajib Koperasi Bulan Ini",
      current: 18500000,
      target: 20000000,
      color: "bg-emerald-600",
      icon: Coins,
    },
    {
      label: "Dana Sosial Darurat & Santunan Duka",
      current: 12400000,
      target: 15000000,
      color: "bg-blue-600",
      icon: Heart,
    },
    {
      label: "Cadangan Operasional Satgas & Alat",
      current: 8200000,
      target: 10000000,
      color: "bg-amber-600",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Target & Ketercapaian Dana Komunitas
        </h3>
        <p className="text-xs text-muted-foreground">
          Capaian pengumpulan iuran wajib dan pos cadangan darurat komunitas DRG
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {targets.map((t) => {
          const pct = Math.min(100, Math.round((t.current / t.target) * 100));
          const IconComponent = t.icon;
          return (
            <div
              key={t.label}
              className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <IconComponent className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{t.label}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs font-mono">
                <span className="font-bold text-foreground">{rupiah(t.current)}</span>
                <span className="text-muted-foreground text-[11px]">{pct}% Target</span>
              </div>
              <Progress value={pct} className="h-2 rounded-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

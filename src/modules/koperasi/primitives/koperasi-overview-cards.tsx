import { SimpananSummary } from "../types";
import { rupiah } from "@/modules/kas";
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, HandCoins, Landmark, ShieldCheck } from "lucide-react";

export function KoperasiOverviewCards({ summary }: { summary: SimpananSummary }) {
  const cards = [
    {
      title: "Simpanan Pokok Anggota",
      value: rupiah(summary.simpanan_pokok_total),
      sub: "Modal awal abadi anggota",
      icon: PiggyBank,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: "Simpanan Wajib Rutin",
      value: rupiah(summary.simpanan_wajib_total),
      sub: "Akumulasi urunan bulanan",
      icon: HandCoins,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      title: "Dana Bergulir Aktif",
      value: rupiah(summary.dana_bergulir_aktif),
      sub: "Bantuan modal jalan dulur",
      icon: Landmark,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      title: "Sisa Kas Siaga Koperasi",
      value: rupiah(summary.sisa_kas_koperasi),
      sub: "Dana likuid di rekening posko",
      icon: ShieldCheck,
      color: "text-primary bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="border-border/70 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">{c.title}</span>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-base font-bold font-mono text-foreground">{c.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.sub}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

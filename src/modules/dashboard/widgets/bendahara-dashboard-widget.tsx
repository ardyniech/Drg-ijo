import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, PiggyBank, ArrowUpRight } from "lucide-react";

export function BendaharaDashboardWidget() {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-600 shadow-xs">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Dashboard Bendahara Keuangan</h3>
            <p className="text-xs text-muted-foreground">
              Arus kas sosial, iuran gotong royong, kuintansi QR & modal koperasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" asChild>
            <Link to="/kas">
              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" /> Kelola Keuangan Kas
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Saldo Kas Utama
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">Rp 14.850.000</div>
          <div className="text-[10px] text-muted-foreground">+Rp 2.450.000 bulan ini</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <PiggyBank className="h-3.5 w-3.5 text-amber-600" /> Dana Koperasi DRG
          </div>
          <div className="mt-1.5 text-xl font-bold text-amber-600">Rp 8.200.000</div>
          <div className="text-[10px] text-muted-foreground">Saham 128 Anggota</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Wallet className="h-3.5 w-3.5 text-primary" /> Status Iuran Bulan Ini
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">88% Terbayar</div>
          <div className="text-[10px] text-muted-foreground">Kuintansi QR Otomatis</div>
        </div>
      </div>
    </div>
  );
}

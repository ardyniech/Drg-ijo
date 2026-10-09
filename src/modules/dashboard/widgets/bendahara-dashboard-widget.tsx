import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDashboardOrg } from "@/modules/dashboard/logic/use-dashboard-org";
import { formatRupiah } from "@/shared/utils/formatters";
import { Wallet, TrendingUp, PiggyBank, ArrowUpRight } from "lucide-react";

export function BendaharaDashboardWidget() {
  const org = useDashboardOrg();

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-600 shadow-xs">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Dashboard Bendahara Kas Gotong Royong
            </h3>
            <p className="text-xs text-muted-foreground">
              Amanah pembukuan: kas seduluran, santunan dulur musibah, & dana guyub pangkalan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" asChild>
            <Link to="/kas">
              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" /> Buku Kas Seduluran
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Kas Utama Satu Aspal
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {org.txCount > 0 ? formatRupiah(org.saldo) : "Belum Tercatat"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {org.masukBulanIni > 0
              ? `+${formatRupiah(org.masukBulanIni)} guyub bulan ini`
              : `${org.txCount} transaksi di buku kas`}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <PiggyBank className="h-3.5 w-3.5 text-amber-600" /> Dana Sosial / Guyub
          </div>
          <div className="mt-1.5 text-xl font-bold text-amber-600">
            {org.txCount > 0 ? formatRupiah(org.saldoSosial) : "Belum Tercatat"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Gotong royong {org.activeCount} sedulur terdata
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Wallet className="h-3.5 w-3.5 text-primary" /> Transaksi Disetujui
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">
            {org.approvedPct === null ? "Belum Ada" : `${org.approvedPct}%`}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {org.txCount > 0
              ? `${org.txApproved} dari ${org.txCount} transaksi berstatus disetujui`
              : "Belum ada transaksi di buku kas"}
          </div>
        </div>
      </div>
    </div>
  );
}

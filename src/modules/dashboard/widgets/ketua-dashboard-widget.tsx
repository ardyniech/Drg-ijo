import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDashboardOrg } from "@/modules/dashboard/logic/use-dashboard-org";
import { useEtik } from "@/modules/etik/logic/use-etik";
import { usePersetujuan } from "@/modules/persetujuan/logic/use-persetujuan";
import { formatRupiah } from "@/shared/utils/formatters";
import { Crown, ShieldCheck, Wallet, Scale } from "lucide-react";

export function KetuaDashboardWidget() {
  const org = useDashboardOrg();
  const { rawCases = [] } = useEtik();
  const { rawList = [] } = usePersetujuan();

  const sengketa = rawCases.filter((c) => c.status !== "resolved").length;
  const verifikasi = rawList.filter((a) => a.status === "pending").length;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/20 text-amber-600 shadow-xs">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Dashboard Eksekutif Ketua Umum</h3>
            <p className="text-xs text-muted-foreground">
              Otoritas pengesahan SK, pengawasan keuangan & dewan etik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
            asChild
          >
            <Link to="/roles">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Kelola Peran Pengurus
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Mandat Pengurus Aktif
          </div>
          <div className="mt-1.5 text-xl font-bold text-amber-600">
            {org.pengurusCount > 0 ? `${org.pengurusCount} Pengurus` : "Belum Ditetapkan"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {org.pengurusCount > 0 ? "Amanah terdaftar & tercatat" : "Kelola lewat Manajemen Peran"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Pengawasan Kas
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {org.txCount > 0 ? formatRupiah(org.saldo) : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {org.masukBulanIni > 0
              ? `+${formatRupiah(org.masukBulanIni)} guyub bulan ini`
              : `${org.txCount} transaksi tercatat`}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Scale className="h-3.5 w-3.5 text-indigo-600" /> Sidang Etik Aktif
          </div>
          <div className="mt-1.5 text-xl font-bold text-indigo-600">
            {sengketa > 0 ? `${sengketa} Sengketa` : "Kondusif"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {sengketa > 0 ? "Butuh putusan dewan etik" : "Tidak ada perkara pending"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Crown className="h-3.5 w-3.5 text-primary" /> Verifikasi Pendaftaran
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">
            {verifikasi > 0 ? `${verifikasi} Menunggu` : "Antrean Kosong"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {verifikasi > 0 ? "Buka rute persetujuan" : "Belum ada pengajuan baru"}
          </div>
        </div>
      </div>
    </div>
  );
}

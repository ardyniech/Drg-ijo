import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEtik } from "@/modules/etik/logic/use-etik";
import { Scale, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export function DewanEtikDashboardWidget() {
  const { rawCases = [] } = useEtik();

  const pending = rawCases.filter((c) => c.status === "investigating").length;
  const resolved = rawCases.filter((c) => c.status === "resolved").length;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/20 text-indigo-600 shadow-xs">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Dashboard Dewan Etik & Kehormatan</h3>
            <p className="text-xs text-muted-foreground">
              Pengawasan perselisihan driver, mediasi sengketa, & penerbitan SK sanksi/rehabilitasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700" asChild>
            <Link to="/etik">
              <Scale className="mr-1.5 h-3.5 w-3.5" /> Buka Sidang Kode Etik
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <ShieldAlert className="h-3.5 w-3.5 text-indigo-600" /> Kasus Disiplin
          </div>
          <div className="mt-1.5 text-xl font-bold text-indigo-600">
            {pending > 0 ? `${pending} Pending` : "Kondusif"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {pending > 0 ? "Perkara menunggu sidang" : "Tidak ada kasus dalam penyelidikan"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Mediasi Selesai
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {resolved > 0 ? `${resolved} Teratasi` : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">Kesepakatan musyawarah tercatat</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <FileText className="h-3.5 w-3.5 text-primary" /> Arsip Perkara
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">
            {rawCases.length > 0 ? `${rawCases.length} Berkas` : "Kosong"}
          </div>
          <div className="text-[10px] text-muted-foreground">Rekam jejak keputusan etik</div>
        </div>
      </div>
    </div>
  );
}

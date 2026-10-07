import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Crown, ShieldCheck, FileCheck, Wallet, Scale } from "lucide-react";

export function KetuaDashboardWidget() {
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
            <FileCheck className="h-3.5 w-3.5 text-amber-600" /> Mandat SK Aktif
          </div>
          <div className="mt-1.5 text-xl font-bold text-amber-600">8 Pengurus</div>
          <div className="text-[10px] text-muted-foreground">SK-KETUA/DRG/2026</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Pengawasan Kas
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">100% Transparan</div>
          <div className="text-[10px] text-muted-foreground">Otorisasi Bersama Bendahara</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Scale className="h-3.5 w-3.5 text-indigo-600" /> Sidang Etik Aktif
          </div>
          <div className="mt-1.5 text-xl font-bold text-indigo-600">0 Sengketa Pending</div>
          <div className="text-[10px] text-muted-foreground">Kondisi Kondusif</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Verifikasi Pendaftaran
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">Siap Disetujui</div>
          <div className="text-[10px] text-muted-foreground">Buka Rute Persetujuan</div>
        </div>
      </div>
    </div>
  );
}

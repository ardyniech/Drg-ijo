import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Siren, Shield, Map, Activity } from "lucide-react";

export function SatgasDashboardWidget() {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-rose-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/20 text-rose-600 shadow-xs">
            <Siren className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Dashboard Satgas Reaksi Cepat (SOS)
            </h3>
            <p className="text-xs text-muted-foreground">
              Posko siaga 24 jam, pengawalan medis, laka lantas, & bantuan mogok
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-rose-600 text-white hover:bg-rose-700" asChild>
            <Link to="/kejadian">
              <Siren className="mr-1.5 h-3.5 w-3.5" /> Pantau Kejadian SOS
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10"
            asChild
          >
            <Link to="/peta">
              <Map className="mr-1.5 h-3.5 w-3.5" /> Peta Live Satgas
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Siren className="h-3.5 w-3.5 text-rose-600" /> Sinyal SOS Aktif
          </div>
          <div className="mt-1.5 text-xl font-bold text-rose-600">Siaga Patroli</div>
          <div className="text-[10px] text-muted-foreground">Respon Cepat &lt; 10 Menit</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Shield className="h-3.5 w-3.5 text-primary" /> Petugas On-Bit
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">8 Satgas Siaga</div>
          <div className="text-[10px] text-muted-foreground">Tersebar di 4 Sektor</div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Activity className="h-3.5 w-3.5 text-emerald-600" /> Laporan Teratasi
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">14 Kejadian Selesai</div>
          <div className="text-[10px] text-muted-foreground">Bantuan Mogok & Ban Bocor</div>
        </div>
      </div>
    </div>
  );
}

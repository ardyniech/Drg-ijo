import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDashboardOverview } from "@/modules/dashboard/logic/use-dashboard-overview";
import { usePetaRadar } from "@/modules/peta/logic/use-peta-radar";
import { supabase } from "@/integrations/supabase/client";
import { CalendarClock, MapPin, RefreshCw } from "lucide-react";

export function KorlapDashboardWidget() {
  const { data: overview } = useDashboardOverview();
  const peta = usePetaRadar();

  const { data: swapCount = 0 } = useQuery({
    queryKey: ["piket-swaps-pending"],
    queryFn: async () => {
      const { data } = await supabase
        .from("piket_swap_requests")
        .select("id")
        .eq("status", "menunggu");
      return (data ?? []).length;
    },
  });

  const petugasSiaga = (overview?.piket ?? []).reduce((acc, p) => acc + p.personil, 0);
  const visible = peta.shelters
    .slice(0, 3)
    .map((s) => s.nama)
    .join(", ");
  const shelterNames =
    peta.shelters.length > 3 ? `${visible} +${peta.shelters.length - 3} lainnya` : visible;

  return (
    <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-orange-500/20">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/20 text-orange-600 shadow-xs">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Dashboard Koordinator Lapangan (Korlap)
            </h3>
            <p className="text-xs text-muted-foreground">
              Pengawasan posko pangkalan, pembagian piket, & persetujuan tukar shift
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-orange-600 text-white hover:bg-orange-700" asChild>
            <Link to="/piket">
              <CalendarClock className="mr-1.5 h-3.5 w-3.5" /> Atur Jadwal Piket
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <CalendarClock className="h-3.5 w-3.5 text-orange-600" /> Shift Piket Hari Ini
          </div>
          <div className="mt-1.5 text-xl font-bold text-orange-600">
            {overview && overview.shiftHariIni > 0 ? `${overview.shiftHariIni} Shift` : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {overview && overview.shiftHariIni > 0
              ? `${overview.wilayahHariIni} zona · ${petugasSiaga} petugas siaga`
              : "Belum ada jadwal shift tercatat"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <RefreshCw className="h-3.5 w-3.5 text-primary" /> Permohonan Tukar Shift
          </div>
          <div className="mt-1.5 text-xl font-bold text-primary">
            {swapCount > 0 ? `${swapCount} Permohonan` : "Tidak Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {swapCount > 0 ? "Butuh persetujuan korlap" : "Belum ada swap shift menunggu"}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Posko Terdaftar
          </div>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">
            {peta.shelters.length > 0 ? `${peta.shelters.length} Posko` : "Belum Ada"}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {peta.shelters.length > 0 ? shelterNames : "Belum ada posko tercatat di peta"}
          </div>
        </div>
      </div>
    </div>
  );
}

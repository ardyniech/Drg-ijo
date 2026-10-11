import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { RadarMapView, ShelterListCard, usePetaRadar } from "@/modules/peta";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radio } from "lucide-react";

export const Route = createFileRoute("/_authenticated/peta")({
  component: PetaRadarPage,
});

function PetaRadarPage() {
  const {
    drivers,
    allDriversCount,
    shelters,
    pangkalanOptions,
    maxRadius,
    setMaxRadius,
    selectedPangkalan,
    setSelectedPangkalan,
  } = usePetaRadar();

  return (
    <PageShell
      title="Radar Dulur & Peta Basecamp"
      description="Pantau sebaran dulur on-bit yang sedang narik santui di sekitar jalur dan shelter/pos pantau resmi DRG."
      actions={
        <div className="flex items-center gap-2">
          <Select value={selectedPangkalan} onValueChange={setSelectedPangkalan}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Semua Pangkalan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pangkalan</SelectItem>
              {pangkalanOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/90 p-3.5 sm:p-4 rounded-2xl border border-border/75 shadow-xs text-xs">
          <div className="flex items-center gap-2.5">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse shrink-0" />
            <span className="text-muted-foreground">
              Terdeteksi{" "}
              <strong className="text-foreground">{drivers.length} sedulur narik di jalan</strong>{" "}
              dalam radius {maxRadius} km (dari total {allDriversCount} online satu aspal).
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Radius:</span>
            {[3, 5, 10].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={maxRadius === r ? "default" : "outline"}
                onClick={() => setMaxRadius(r)}
                className="h-7 min-h-[28px] px-2.5 text-xs rounded-lg font-semibold"
              >
                {r} km
              </Button>
            ))}
          </div>
        </div>

        <RadarMapView drivers={drivers} shelters={shelters} radiusKm={maxRadius} />

        <ShelterListCard shelters={shelters} />
      </div>
    </PageShell>
  );
}

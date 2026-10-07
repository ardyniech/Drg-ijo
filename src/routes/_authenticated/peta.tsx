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
    maxRadius,
    setMaxRadius,
    selectedPangkalan,
    setSelectedPangkalan,
  } = usePetaRadar();

  return (
    <PageShell
      title="Radar & Peta Satgas"
      description="Pantau sebaran rekan driver on-bit di sekitar Anda dan lokasi pos pantau resmi DRG."
      action={
        <div className="flex items-center gap-2">
          <Select value={selectedPangkalan} onValueChange={setSelectedPangkalan}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Semua Pangkalan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pangkalan</SelectItem>
              <SelectItem value="Pangkalan Suhat">Pangkalan Suhat</SelectItem>
              <SelectItem value="Pangkalan Dinoyo">Pangkalan Dinoyo</SelectItem>
              <SelectItem value="Pangkalan Sawojajar">Pangkalan Sawojajar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border/70 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span>
              Terdeteksi <strong>{drivers.length} driver aktif</strong> dalam radius {maxRadius} km
              (dari total {allDriversCount} online).
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Radius:</span>
            {[3, 5, 10].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={maxRadius === r ? "secondary" : "outline"}
                onClick={() => setMaxRadius(r)}
                className="h-7 px-2.5 text-xs"
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

import { Compass, Navigation, Radio, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ActiveDriverMarker, OfficialShelter } from "../types";

interface RadarMapViewProps {
  drivers: ActiveDriverMarker[];
  shelters: OfficialShelter[];
  radiusKm: number;
}

export function RadarMapView({ drivers, shelters, radiusKm }: RadarMapViewProps) {
  return (
    <Card className="overflow-hidden border-border/80">
      <div className="relative flex h-80 w-full flex-col items-center justify-center bg-slate-900 text-slate-100 p-4 select-none">
        {/* Radar concentric range rings */}
        <div className="absolute h-72 w-72 rounded-full border border-primary/20 animate-pulse" />
        <div className="absolute h-52 w-52 rounded-full border border-primary/30" />
        <div className="absolute h-32 w-32 rounded-full border border-primary/40" />
        <div className="absolute h-12 w-12 rounded-full border border-primary/60 bg-primary/20" />

        {/* Center marker (You) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Navigation className="h-3.5 w-3.5" />
          </div>
          <span className="mt-1 text-[10px] font-bold bg-slate-900/80 px-1.5 py-0.5 rounded text-primary">
            Posisi Anda
          </span>
        </div>

        {/* Dynamic driver dots */}
        {drivers.map((drv, idx) => {
          const angle = idx * 110 * (Math.PI / 180);
          const distRatio = Math.min(drv.distance_km / radiusKm, 1);
          const topPercent = 50 + Math.sin(angle) * (distRatio * 38);
          const leftPercent = 50 + Math.cos(angle) * (distRatio * 38);

          return (
            <div
              key={drv.id}
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-md ring-2 ring-slate-900 transition-transform group-hover:scale-125">
                <Radio className="h-2.5 w-2.5 text-white animate-ping opacity-75" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-4 hidden group-hover:flex flex-col items-center whitespace-nowrap bg-slate-800 text-[10px] text-white px-2 py-1 rounded shadow-lg border border-slate-700">
                <span className="font-semibold">{drv.nama}</span>
                <span className="text-slate-400">
                  {drv.distance_km} km ({drv.pangkalan})
                </span>
              </div>
            </div>
          );
        })}

        {/* Shelters */}
        {shelters.map((sh, idx) => {
          const angle = (idx * 150 + 60) * (Math.PI / 180);
          const topPercent = 50 + Math.sin(angle) * 35;
          const leftPercent = 50 + Math.cos(angle) * 35;

          return (
            <div
              key={sh.id}
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 shadow-md ring-2 ring-slate-900 transition-transform group-hover:scale-125">
                <Shield className="h-3 w-3 text-white" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:flex flex-col items-center whitespace-nowrap bg-slate-800 text-[10px] text-white px-2 py-1 rounded shadow-lg border border-slate-700">
                <span className="font-semibold">{sh.nama}</span>
                <span className="text-amber-300">Pos Pantau</span>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded text-[11px] border border-slate-800">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Driver On-Bit ({drivers.length})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Shelter Resmi ({shelters.length})</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Fuel, FileText, MapPin, CheckCircle2 } from "lucide-react";
import { ProfileRow } from "../types";

interface Props {
  profile: ProfileRow;
}

export function ProfileVehicleCard({ profile }: Props) {
  const plat = profile.plat_nomor || "N ---- XX";
  const jenis = profile.jenis_kendaraan || "Sepeda Motor";
  const merk = profile.merk_kendaraan || "Belum diisi";
  const pangkalan = profile.pangkalan || "Belum diatur";

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Car className="h-4 w-4 text-primary" />
          Kendaraan & Operasional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{jenis}</p>
              <p className="font-bold text-base text-foreground">{merk}</p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end">
            <div className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1 font-mono text-sm font-black tracking-widest text-zinc-100 border border-zinc-700 shadow-inner">
              {plat}
            </div>
            <span className="mt-1 flex items-center gap-1 text-[10px] text-success font-medium">
              <CheckCircle2 className="h-3 w-3" /> Terdaftar di Operasional
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 pt-1">
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" /> Pangkalan Operasional
            </span>
            <p className="font-semibold text-foreground">{pangkalan}</p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <FileText className="h-3 w-3 text-primary" /> Nomor STNK
            </span>
            <p className="font-mono text-xs font-medium text-foreground">
              {profile.nomor_stnk || "Belum diisi"}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Fuel className="h-3 w-3 text-primary" /> Jenis Armada
            </span>
            <p className="font-medium text-foreground">{jenis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

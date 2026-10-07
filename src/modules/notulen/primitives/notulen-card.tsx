import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotulenRecord } from "../types";

export function NotulenCard({ notulen }: { notulen: NotulenRecord }) {
  return (
    <Card className="border-border/70 hover:border-primary/40 transition-colors">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-bold text-foreground">{notulen.judul}</CardTitle>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px] shrink-0"
          >
            {notulen.status === "disahkan" ? "Disahkan" : "Draft"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-primary" /> {notulen.tanggal}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" /> {notulen.lokasi}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {notulen.peserta_count} Hadir
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2.5 text-xs">
        <p className="text-muted-foreground">{notulen.agenda}</p>
        <div className="space-y-1.5 rounded-md bg-muted/40 p-2.5">
          <p className="font-semibold text-foreground text-[11px]">Poin Keputusan Musyawarah:</p>
          <ul className="space-y-1">
            {notulen.poin_keputusan.map((p, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-foreground/90">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
          <span>
            Pemimpin: <strong>{notulen.pemimpin_rapat}</strong>
          </span>
          <span>
            Notulis: <strong>{notulis_or_dash(notulen.notulis)}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function notulis_or_dash(val: string) {
  return val || "-";
}

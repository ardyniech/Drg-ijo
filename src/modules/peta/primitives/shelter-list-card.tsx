import { Phone, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OfficialShelter } from "../types";

export function ShelterListCard({ shelters }: { shelters: OfficialShelter[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" /> Daftar Basecamp & Pos Pantau Resmi DRG
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shelters.map((sh) => (
          <Card key={sh.id} className="border-border/60 shadow-none">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-start justify-between gap-1">
                <CardTitle className="text-sm font-bold">{sh.nama}</CardTitle>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  Kapasitas {sh.kapasitas}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{sh.alamat}</p>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2 text-xs">
              <div className="flex flex-wrap gap-1">
                {sh.fasilitas.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 text-primary" /> {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                <span className="text-muted-foreground">
                  Korlap: <strong className="text-foreground">{sh.korlap_nama}</strong>
                </span>
                <a
                  href={`https://wa.me/${sh.korlap_phone}?text=Halo%20Korlap%20${encodeURIComponent(sh.korlap_nama)},%20saya%20anggota%20DRG%20ingin%20koordinasi%20di%20${encodeURIComponent(sh.nama)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <Phone className="h-3 w-3" /> WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

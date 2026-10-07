import { Phone, CheckCircle, ShieldCheck, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IncidentRecord } from "../types";
import { useKejadian } from "../logic/use-kejadian";
import { useMe } from "@/hooks/use-me";

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  kecelakaan: { label: "Kecelakaan", color: "bg-red-500/15 text-red-700" },
  begal_kriminal: { label: "Begal / Kriminal", color: "bg-rose-500/15 text-rose-700" },
  mogok_mesin: { label: "Mogok / Mesin", color: "bg-amber-500/15 text-amber-700" },
  razia_kendala: { label: "Kendala Razia", color: "bg-blue-500/15 text-blue-700" },
  medis: { label: "Bantuan Medis", color: "bg-purple-500/15 text-purple-700" },
};

export function IncidentCard({ incident }: { incident: IncidentRecord }) {
  const { updateStatus } = useKejadian();
  const { data: me } = useMe();
  const cat = CATEGORY_LABELS[incident.kategori] || {
    label: incident.kategori,
    color: "bg-muted text-muted-foreground",
  };
  const isResolved = incident.status === "selesai";

  const handleRespond = () => {
    if (!me) return;
    updateStatus.mutate({
      id: incident.id,
      status: "dalam_penanganan",
      responder: me.nama,
    });
  };

  const handleResolve = () => {
    updateStatus.mutate({
      id: incident.id,
      status: "selesai",
    });
  };

  const cleanDigits = incident.driver_phone.replace(/\D/g, "");
  const waPhone = cleanDigits.startsWith("0") ? `62${cleanDigits.slice(1)}` : cleanDigits;

  return (
    <Card className={incident.status === "aktif" ? "border-destructive/40" : ""}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cat.color}>{cat.label}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(incident.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <h4 className="font-semibold text-sm">{incident.driver_name}</h4>
          </div>
          <Badge
            variant={
              isResolved
                ? "outline"
                : incident.status === "dalam_penanganan"
                  ? "secondary"
                  : "destructive"
            }
          >
            {incident.status === "aktif"
              ? "Butuh Bantuan"
              : incident.status === "dalam_penanganan"
                ? "Ditangani Satgas"
                : "Selesai"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3 text-sm">
        <p className="text-xs text-foreground/90">{incident.deskripsi}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{incident.lokasi_teks}</span>
        </div>
        {incident.responders.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Users className="h-3.5 w-3.5" />
            <span>Satgas Meluncur: {incident.responders.join(", ")}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <a
            href={`https://wa.me/${waPhone}?text=Halo%20rekan%20${encodeURIComponent(incident.driver_name)},%20Satgas%20DRG%20merespons%20laporan%20SOS%20Anda.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Phone className="h-3.5 w-3.5" /> Hubungi Driver
          </a>
          <div className="flex gap-2">
            {incident.status === "aktif" && (
              <Button size="sm" variant="outline" onClick={handleRespond} className="text-xs h-7">
                <ShieldCheck className="mr-1 h-3.5 w-3.5 text-primary" /> Saya Meluncur
              </Button>
            )}
            {!isResolved && (
              <Button
                size="sm"
                onClick={handleResolve}
                className="text-xs h-7 bg-primary text-primary-foreground"
              >
                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Tandai Selesai
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useKejadian } from "../logic/use-kejadian";
import { useMe } from "@/hooks/use-me";
import { useLiveLocation } from "@/hooks/use-live-location";
import { IncidentCategory, IncidentSeverity } from "../types";
import { ReportIncidentFields } from "./report-incident-fields";

export function ReportIncidentDialog() {
  const [open, setOpen] = useState(false);
  const { data: me } = useMe();
  const { coords } = useLiveLocation(me?.id);
  const { createIncident } = useKejadian();

  const [kategori, setKategori] = useState<IncidentCategory>("kecelakaan");
  const [tingkat, setTingkat] = useState<IncidentSeverity>("sedang");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) {
      toast.error("Silakan masuk terlebih dahulu");
      return;
    }
    const cleanDesc = deskripsi.trim();
    if (!cleanDesc) {
      toast.error("Deskripsi kejadian wajib diisi");
      return;
    }

    createIncident.mutate({
      driver_id: me.id,
      driver_name: me.nama,
      driver_phone: ((me as unknown as Record<string, unknown>)?.no_hp as string) || me.email || "",
      kategori,
      tingkat,
      lokasi_teks: lokasi.trim() || "Lokasi GPS saat ini",
      deskripsi: cleanDesc,
      lat: coords?.lat,
      lng: coords?.lng,
    });
    setOpen(false);
    setDeskripsi("");
    setLokasi("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground gap-2">
          <PlusCircle className="h-4 w-4" /> Kabari Kendala di Jalan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Kabari Kendala / Musibah Jalur</DialogTitle>
            <DialogDescription>
              Kirim info kendala di jalan (mogok, ban bocor, senggolan, dll) agar Korlap dan dulur
              Satgas gercep meluncur bantu.
            </DialogDescription>
          </DialogHeader>

          <ReportIncidentFields
            kategori={kategori}
            setKategori={setKategori}
            tingkat={tingkat}
            setTingkat={setTingkat}
            lokasi={lokasi}
            setLokasi={setLokasi}
            deskripsi={deskripsi}
            setDeskripsi={setDeskripsi}
            coords={coords}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createIncident.isPending || !deskripsi.trim()}
              className="bg-primary text-primary-foreground"
            >
              {createIncident.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Kirim Kabar ke Dulur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

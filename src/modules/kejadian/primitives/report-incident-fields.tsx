import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncidentCategory, IncidentSeverity } from "../types";

interface Props {
  kategori: IncidentCategory;
  setKategori: (v: IncidentCategory) => void;
  tingkat: IncidentSeverity;
  setTingkat: (v: IncidentSeverity) => void;
  lokasi: string;
  setLokasi: (v: string) => void;
  deskripsi: string;
  setDeskripsi: (v: string) => void;
  coords: { lat: number; lng: number } | null;
}

export function ReportIncidentFields({
  kategori,
  setKategori,
  tingkat,
  setTingkat,
  lokasi,
  setLokasi,
  deskripsi,
  setDeskripsi,
  coords,
}: Props) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Kategori Insiden</Label>
          <Select value={kategori} onValueChange={(v) => setKategori(v as IncidentCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kecelakaan">Kecelakaan Lalu Lintas</SelectItem>
              <SelectItem value="begal_kriminal">Tindak Kriminal / Begal</SelectItem>
              <SelectItem value="mogok_mesin">Mogok Mesin</SelectItem>
              <SelectItem value="razia_kendala">Kendala Razia</SelectItem>
              <SelectItem value="medis">Bantuan Medis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Urgensi</Label>
          <Select value={tingkat} onValueChange={(v) => setTingkat(v as IncidentSeverity)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="darurat_tinggi">Darurat Tinggi</SelectItem>
              <SelectItem value="sedang">Sedang</SelectItem>
              <SelectItem value="ringan">Ringan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Patokan Lokasi</Label>
        <Input
          placeholder="Contoh: Depan Kampus UB"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
        />
        {coords && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 text-primary" /> GPS terdeteksi ({coords.lat.toFixed(4)},{" "}
            {coords.lng.toFixed(4)})
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Keterangan Lengkap</Label>
        <Textarea
          placeholder="Jelaskan kondisi di lokasi..."
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  judul: string;
  setJudul: (v: string) => void;
  lokasi: string;
  setLokasi: (v: string) => void;
  agenda: string;
  setAgenda: (v: string) => void;
  keputusanRaw: string;
  setKeputusanRaw: (v: string) => void;
}

export function NewNotulenFormFields({
  judul,
  setJudul,
  lokasi,
  setLokasi,
  agenda,
  setAgenda,
  keputusanRaw,
  setKeputusanRaw,
}: Props) {
  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <Label>Judul / Topik Rapat</Label>
        <Input
          placeholder="Contoh: Rapat Koordinasi Satgas Wilayah Barat"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Lokasi Pertemuan</Label>
        <Input value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Agenda & Pembahasan</Label>
        <Textarea
          placeholder="Rangkuman jalannya musyawarah..."
          rows={2}
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Poin Keputusan (1 per baris)</Label>
        <Textarea
          placeholder="Tulis setiap poin keputusan di baris baru..."
          rows={3}
          value={keputusanRaw}
          onChange={(e) => setKeputusanRaw(e.target.value)}
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useInventaris } from "../logic/use-inventaris";
import { InventarisItem } from "../types";

export function NewItemDialog() {
  const [open, setOpen] = useState(false);
  const { addItem } = useInventaris();

  const [namaBarang, setNamaBarang] = useState("");
  const [kodeAlat, setKodeAlat] = useState("");
  const [kategori, setKategori] = useState<InventarisItem["kategori"]>("Komunikasi");
  const [kondisi, setKondisi] = useState<InventarisItem["kondisi"]>("Sangat Baik");
  const [lokasiPos, setLokasiPos] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang || !lokasiPos) return;

    addItem.mutate(
      {
        nama_barang: namaBarang,
        kode_alat: kodeAlat || `POS-${Math.floor(100 + Math.random() * 900)}`,
        kategori,
        kondisi,
        lokasi_pos: lokasiPos,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNamaBarang("");
          setKodeAlat("");
          setLokasiPos("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground text-xs">
          <PlusCircle className="h-3.5 w-3.5" /> Tambah Perlengkapan Pos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Daftarkan Alat / Perlengkapan Posko
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-foreground">Nama Barang / Peralatan</label>
            <Input
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              placeholder="Contoh: HT Baofeng UV-82 / Rompi Satgas"
              required
              className="mt-1 h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-foreground">Kode Seri / Alat</label>
              <Input
                value={kodeAlat}
                onChange={(e) => setKodeAlat(e.target.value)}
                placeholder="Contoh: HT-DRG-05"
                className="mt-1 h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Kondisi</label>
              <Select
                value={kondisi}
                onValueChange={(v) => setKondisi(v as InventarisItem["kondisi"])}
              >
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sangat Baik">Sangat Baik</SelectItem>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Servis">Perlu Servis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground">Kategori Barang</label>
            <Select
              value={kategori}
              onValueChange={(v) => setKategori(v as InventarisItem["kategori"])}
            >
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Komunikasi">Komunikasi Jalur (HT)</SelectItem>
                <SelectItem value="Keselamatan">Rompi & Helm Satgas</SelectItem>
                <SelectItem value="P3K">Kotak P3K Medis</SelectItem>
                <SelectItem value="Perlengkapan Pos">Perlengkapan Basecamp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-semibold text-foreground">Posko Penyimpanan</label>
            <Input
              value={lokasiPos}
              onChange={(e) => setLokasiPos(e.target.value)}
              placeholder="Contoh: Basecamp Arjosari Siaga"
              required
              className="mt-1 h-8 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addItem.isPending}
              className="bg-primary text-primary-foreground"
            >
              {addItem.isPending ? "Menyimpan..." : "Daftarkan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

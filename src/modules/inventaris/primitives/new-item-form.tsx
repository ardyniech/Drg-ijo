import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventarisItem } from "../types";
import { NewItemCategoryFields } from "./new-item-category-fields";

interface Props {
  namaBarang: string;
  setNamaBarang: (v: string) => void;
  kodeAlat: string;
  setKodeAlat: (v: string) => void;
  kategori: InventarisItem["kategori"];
  setKategori: (v: InventarisItem["kategori"]) => void;
  kondisi: InventarisItem["kondisi"];
  setKondisi: (v: InventarisItem["kondisi"]) => void;
  lokasiPos: string;
  setLokasiPos: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function NewItemForm({
  namaBarang,
  setNamaBarang,
  kodeAlat,
  setKodeAlat,
  kategori,
  setKategori,
  kondisi,
  setKondisi,
  lokasiPos,
  setLokasiPos,
  onSubmit,
  onCancel,
  isPending,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 text-xs">
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
          <Select value={kondisi} onValueChange={(v) => setKondisi(v as InventarisItem["kondisi"])}>
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

      <NewItemCategoryFields
        kategori={kategori}
        setKategori={setKategori}
        lokasiPos={lokasiPos}
        setLokasiPos={setLokasiPos}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="bg-primary text-primary-foreground"
        >
          {isPending ? "Menyimpan..." : "Daftarkan"}
        </Button>
      </div>
    </form>
  );
}

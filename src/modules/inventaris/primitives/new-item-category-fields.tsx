import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventarisItem } from "../types";

interface Props {
  kategori: InventarisItem["kategori"];
  setKategori: (v: InventarisItem["kategori"]) => void;
  lokasiPos: string;
  setLokasiPos: (v: string) => void;
}

export function NewItemCategoryFields({ kategori, setKategori, lokasiPos, setLokasiPos }: Props) {
  return (
    <>
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
    </>
  );
}

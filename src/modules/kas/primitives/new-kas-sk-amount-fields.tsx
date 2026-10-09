import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KasSkCategory } from "../types";

interface Props {
  kategori: KasSkCategory;
  setKategori: (v: KasSkCategory) => void;
  nominal: string;
  setNominal: (v: string) => void;
}

export function NewKasSkAmountFields({ kategori, setKategori, nominal, setNominal }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="font-semibold text-foreground">Kategori Santunan</label>
        <Select value={kategori} onValueChange={(v) => setKategori(v as KasSkCategory)}>
          <SelectTrigger className="mt-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="santunan_laka">Laka Lantas</SelectItem>
            <SelectItem value="santunan_duka">Santunan Duka</SelectItem>
            <SelectItem value="bantuan_kesehatan">Bantuan Medis</SelectItem>
            <SelectItem value="bantuan_kendaraan">Mogok/Perbaikan</SelectItem>
            <SelectItem value="modal_koperasi">Modal Koperasi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="font-semibold text-foreground">Nominal (Rp)</label>
        <Input
          type="number"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          placeholder="1500000"
          required
          className="mt-1 h-8 text-xs"
        />
      </div>
    </div>
  );
}

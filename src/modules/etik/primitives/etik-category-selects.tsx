import { ViolationSeverity } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  category: string;
  setCategory: (v: string) => void;
  severity: ViolationSeverity;
  setSeverity: (v: ViolationSeverity) => void;
}

export function EtikCategorySelects({ category, setCategory, severity, setSeverity }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-xs font-medium">Kategori</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="mt-1 h-9 text-xs rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="Perselisihan Lapangan">Perselisihan</SelectItem>
            <SelectItem value="Ketertiban Pangkalan">Ketertiban</SelectItem>
            <SelectItem value="Pungli / Iuran Ilegal">Pungli</SelectItem>
            <SelectItem value="Pelanggaran Disiplin">Disiplin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium">Tingkat Dugaan</label>
        <Select value={severity} onValueChange={(v) => setSeverity(v as ViolationSeverity)}>
          <SelectTrigger className="mt-1 h-9 text-xs rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="Ringan">Ringan (Teguran)</SelectItem>
            <SelectItem value="Sedang">Sedang (Mediasi)</SelectItem>
            <SelectItem value="Berat">Berat (Sanksi)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

import { ViolationSeverity } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EtikCategorySelects } from "./etik-category-selects";

interface Props {
  name: string;
  setName: (v: string) => void;
  memberId: string;
  setMemberId: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  severity: ViolationSeverity;
  setSeverity: (v: ViolationSeverity) => void;
  location: string;
  setLocation: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  desc: string;
  setDesc: (v: string) => void;
}

export function EtikReportFields({
  name,
  setName,
  memberId,
  setMemberId,
  category,
  setCategory,
  severity,
  setSeverity,
  location,
  setLocation,
  date,
  setDate,
  desc,
  setDesc,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium">Nama Terlapor</label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi S."
            className="mt-1 h-9 text-xs rounded-xl"
          />
        </div>
        <div>
          <label className="text-xs font-medium">ID / No Anggota</label>
          <Input
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="DRG-045"
            className="mt-1 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      <EtikCategorySelects
        category={category}
        setCategory={setCategory}
        severity={severity}
        setSeverity={setSeverity}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium">Lokasi</label>
          <Input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Pangkalan Dinoyo"
            className="mt-1 h-9 text-xs rounded-xl"
          />
        </div>
        <div>
          <label className="text-xs font-medium">Tanggal</label>
          <Input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Kronologi Masalah</label>
        <Textarea
          required
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Jelaskan secara objektif kronologi kejadian..."
          className="mt-1 h-20 text-xs rounded-xl"
        />
      </div>
    </>
  );
}
